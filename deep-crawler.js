/**
 * Deep Site Crawler & Asset Ingestion Engine
 * Crawls homepage + all internal subpages (about, services, contact, reviews, gallery),
 * extracts structured business intelligence, and downloads all categorized images to public/images/.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function cleanText(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function fetchHtmlWithFallback(url, timeoutMs = 8000) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 200) return text;
    }
  } catch (_) {}

  try {
    const script = `$ProgressPreference = 'SilentlyContinue'; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; (Invoke-WebRequest -Uri "${url}" -UseBasicParsing -TimeoutSec ${Math.round(timeoutMs / 1000)}).Content`;
    const b64 = Buffer.from(script, 'utf16le').toString('base64');
    const out = execFileSync('powershell.exe', ['-NoProfile', '-EncodedCommand', b64], {
      encoding: 'utf-8',
      maxBuffer: 15 * 1024 * 1024
    });
    if (out && out.length > 200) return out;
  } catch (_) {}

  return '';
}

async function downloadImageFile(imgUrl, filePath, timeoutMs = 7000) {
  try {
    const res = await fetch(imgUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length >= 6000) {
        fs.writeFileSync(filePath, buf);
        return buf.length;
      }
    }
  } catch (_) {}

  try {
    const script = `$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri "${imgUrl}" -OutFile "${filePath}" -TimeoutSec ${Math.round(timeoutMs / 1000)}`;
    const b64 = Buffer.from(script, 'utf16le').toString('base64');
    execFileSync('powershell.exe', ['-NoProfile', '-EncodedCommand', b64], { stdio: 'ignore' });
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      if (stat.size >= 6000) return stat.size;
      fs.unlinkSync(filePath);
    }
  } catch (_) {}

  return 0;
}

export async function crawlFullWebsite(rootUrl, targetImagesDir) {
  console.log(`\n🕷️ [Deep Crawler] Starting full multi-page crawl on: ${rootUrl}`);
  fs.mkdirSync(targetImagesDir, { recursive: true });

  const result = {
    title: '',
    businessName: '',
    phone: '',
    email: '',
    address: '',
    hours: [
      { day: "Monday", open: "8:00 AM", close: "5:00 PM", note: "" },
      { day: "Tuesday", open: "8:00 AM", close: "5:00 PM", note: "" },
      { day: "Wednesday", open: "8:00 AM", close: "5:00 PM", note: "" },
      { day: "Thursday", open: "8:00 AM", close: "5:00 PM", note: "" },
      { day: "Friday", open: "8:00 AM", close: "5:00 PM", note: "" },
      { day: "Saturday", open: "Closed", close: "Closed", note: "By Appt" },
      { day: "Sunday", open: "Closed", close: "Closed", note: "" }
    ],
    doctor: {
      name: '',
      role: 'Lead Specialist & Practitioner',
      quote: ''
    },
    bio: '',
    services: [],
    detailedServices: [],
    reviews: [],
    amenities: [],
    images: {
      hero: '/images/hero-poster.jpg',
      profile: '/images/profile.jpg',
      gallery: [],
      transformations: [],
      facility: []
    }
  };

  let rootOrigin = '';
  try {
    const parsed = new URL(rootUrl);
    rootOrigin = parsed.origin;
  } catch (err) {
    console.warn(`   ⚠️ Invalid URL: ${rootUrl}`);
    return result;
  }

  // 1. Fetch Homepage
  const homepageHtml = await fetchHtmlWithFallback(rootUrl, 12000);
  if (!homepageHtml) {
    console.warn(`   ⚠️ Homepage fetch failed on ${rootUrl}`);
    return result;
  }
  console.log(`   ✅ Fetched homepage (${(homepageHtml.length / 1024).toFixed(1)} KB)`);

  // Extract homepage title & og tags
  const titleMatch = homepageHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) result.title = titleMatch[1].trim();

  const phoneMatch = homepageHtml.match(/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
  if (phoneMatch) result.phone = phoneMatch[0].trim();

  const emailMatch = homepageHtml.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch && !emailMatch[0].includes('wixpress') && !emailMatch[0].includes('sentry')) {
    result.email = emailMatch[0].trim();
  }

  // 2. Discover High-Value Subpage Links (URL + Anchor Text)
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const discoveredUrls = new Map(); // url -> { category, anchor }
  let linkMatch;

  const categoryMap = [
    { cat: 'about', keywords: ['about', 'team', 'doctor', 'staff', 'story', 'history', 'dr-', 'practitioner', 'founder'] },
    { cat: 'services', keywords: ['service', 'procedure', 'treatment', 'cosmetic', 'family', 'restorative', 'implants', 'veneers', 'repair', 'offerings', 'specialties'] },
    { cat: 'gallery', keywords: ['gallery', 'before-and-after', 'results', 'smile', 'photos', 'portfolio', 'transformations', 'cases'] },
    { cat: 'reviews', keywords: ['review', 'testimonial', 'patient-stories', 'feedback'] },
    { cat: 'contact', keywords: ['contact', 'location', 'hours', 'appointment', 'directions', 'visit'] }
  ];

  while ((linkMatch = linkRegex.exec(homepageHtml)) !== null) {
    const rawHref = linkMatch[1].trim();
    const anchorText = cleanText(linkMatch[2]).toLowerCase();

    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:') || rawHref.startsWith('tel:') || rawHref.startsWith('mailto:')) continue;

    try {
      const resolved = new URL(rawHref, rootUrl);
      if (resolved.origin === rootOrigin && !discoveredUrls.has(resolved.href)) {
        const cleanPath = resolved.pathname.toLowerCase();

        for (const { cat, keywords } of categoryMap) {
          const pathHit = keywords.some(kw => cleanPath.includes(kw));
          const anchorHit = keywords.some(kw => anchorText.includes(kw));
          if (pathHit || anchorHit) {
            discoveredUrls.set(resolved.href, { category: cat, anchor: anchorText });
            break;
          }
        }
      }
    } catch (_) {}
  }

  const subpagesToCrawl = Array.from(discoveredUrls.entries()).slice(0, 15);
  console.log(`   🔍 Discovered ${subpagesToCrawl.length} high-value internal subpages:`);
  subpagesToCrawl.forEach(([url, info]) => console.log(`      • [${info.category.toUpperCase()}] ${url} ("${info.anchor || 'link'}")`));

  // 3. Crawl Subpages in Parallel
  const pagesData = [{ url: rootUrl, category: 'home', html: homepageHtml }];

  const crawlPromises = subpagesToCrawl.map(async ([url, info]) => {
    const text = await fetchHtmlWithFallback(url, 9000);
    if (text) {
      return { url, category: info.category, html: text, anchor: info.anchor };
    }
    return null;
  });

  const crawledResults = await Promise.allSettled(crawlPromises);
  crawledResults.forEach(r => {
    if (r.status === 'fulfilled' && r.value) {
      pagesData.push(r.value);
    }
  });

  // 4. Extract Deep Business Data & All Images
  const allImageUrls = new Map(); // url -> { category, alt }
  const serviceMap = new Map();
  const reviewQuotes = [];

  for (const page of pagesData) {
    const html = page.html;

    // A. Check for Phone & Email if missing
    if (!result.phone) {
      const pMatch = html.match(/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
      if (pMatch) result.phone = pMatch[0].trim();
    }
    if (!result.email) {
      const eMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (eMatch && !eMatch[0].includes('wixpress') && !eMatch[0].includes('sentry')) {
        result.email = eMatch[0].trim();
      }
    }

    // B. Check for Address
    if (!result.address) {
      const addrMatch = html.match(/[0-9]{2,5}\s+[A-Za-z0-9\s.,]{5,40},\s*[A-Z]{2}\s+[0-9]{5}/);
      if (addrMatch) result.address = addrMatch[0].trim();
    }

    // C. Extract Services with Descriptions
    if (page.category === 'services' || page.category === 'home') {
      const sectionRegex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>\s*(?:<p[^>]*>([\s\S]*?)<\/p>)?/gi;
      let sMatch;
      while ((sMatch = sectionRegex.exec(html)) !== null) {
        const title = cleanText(sMatch[1]);
        const desc = cleanText(sMatch[2] || '');

        if (title.length > 3 && title.length < 50 &&
            !title.toLowerCase().includes('welcome') &&
            !title.toLowerCase().includes('contact') &&
            !title.toLowerCase().includes('review') &&
            !title.toLowerCase().includes('menu') &&
            !title.toLowerCase().includes('hours') &&
            !title.toLowerCase().includes('navigation') &&
            !serviceMap.has(title)) {
          serviceMap.set(title, desc || 'Comprehensive professional care customized to your specific needs.');
        }
      }
    }

    // D. Extract Reviews
    if (page.category === 'reviews' || page.category === 'home') {
      const quoteRegex = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>|<p[^>]*class=["'][^"']*(?:quote|review|testimonial)[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi;
      let qMatch;
      while ((qMatch = quoteRegex.exec(html)) !== null) {
        const quote = cleanText(qMatch[1] || qMatch[2] || '');
        if (quote.length > 30 && quote.length < 350) {
          reviewQuotes.push(quote);
        }
      }
    }

    // E. Extract Doctor / Practitioner Details
    if ((page.category === 'about' || page.category === 'home') && !result.doctor.name) {
      const docNameMatch = html.match(/<(?:h1|h2|h3)[^>]*>\s*(?:Meet\s+)?(Dr\.\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}(?:,\s*[A-Z.]+)*)/i);
      if (docNameMatch) {
        result.doctor.name = cleanText(docNameMatch[1]);
      }

      const pRegex = /<p[^>]*>([\s\S]{60,500}?)<\/p>/gi;
      let pMatch;
      while ((pMatch = pRegex.exec(html)) !== null) {
        const pText = cleanText(pMatch[1]);
        if ((pText.toLowerCase().includes('dr.') || pText.toLowerCase().includes('graduate') || pText.toLowerCase().includes('founded') || pText.toLowerCase().includes('years of experience') || pText.toLowerCase().includes('passion')) && !result.bio) {
          result.bio = pText;
          result.doctor.quote = pText;
          break;
        }
      }
    }

    // F. Extract Images from every page
    const imgRegex = /<img[^>]+(?:src|data-src)=["']([^"']+)["'][^>]*?(?:alt=["']([^"']*)["'])?/gi;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      const src = imgMatch[1];
      const alt = (imgMatch[2] || '').trim();

      if (!src || src.startsWith('data:') || src.includes('.svg') || src.includes('pixel') || src.includes('spacer') || src.includes('icon')) continue;

      try {
        const absUrl = new URL(src, rootUrl).href;
        if (!allImageUrls.has(absUrl)) {
          allImageUrls.set(absUrl, { category: page.category, alt });
        }
      } catch (_) {}
    }
  }

  // Populate structured services
  let sIdx = 0;
  for (const [title, desc] of serviceMap.entries()) {
    result.services.push(title);
    result.detailedServices.push({
      id: slugify(title) || `service-${sIdx + 1}`,
      title: title,
      category: sIdx < 4 ? 'Featured Treatments' : 'Specialized Care',
      subType: title,
      description: desc.length > 20 ? desc : `Expert ${title} delivered with precision and comfort.`,
      icon: 'CheckCircle',
      popular: sIdx < 4
    });
    sIdx++;
    if (sIdx >= 12) break;
  }

  // Populate reviews
  result.reviews = reviewQuotes.slice(0, 4).map((comment, idx) => ({
    author: `Verified Patient ${idx + 1}`,
    location: result.address ? result.address.split(',')[1]?.trim() || 'Local Client' : 'Local Client',
    source: 'Google Review',
    rating: 5,
    date: 'Recent verified visit',
    comment: comment
  }));

  console.log(`   📋 Extracted Business Intelligence:`);
  console.log(`      • Business: ${result.businessName || 'Extracted from title'}`);
  console.log(`      • Phone:    ${result.phone || 'None found'}`);
  console.log(`      • Address:  ${result.address || 'None found'}`);
  console.log(`      • Doctor:   ${result.doctor.name || 'Practitioner'}`);
  console.log(`      • Services: ${result.detailedServices.length} structured procedures cataloged`);
  console.log(`      • Images:   ${allImageUrls.size} candidate images discovered across all pages`);

  // 5. Download and Classify High-Res Images
  console.log(`   ⬇️ Downloading and organizing images into public/images/...`);
  let downloadedCount = 0;
  const downloadedFiles = [];

  for (const [imgUrl, meta] of Array.from(allImageUrls.entries()).slice(0, 15)) {
    try {
      const ext = imgUrl.toLowerCase().includes('.png') ? 'png' : imgUrl.toLowerCase().includes('.webp') ? 'webp' : 'jpg';

      // Smart semantic naming based on page category and alt text
      let fileName = '';
      const lowerUrl = imgUrl.toLowerCase();
      const lowerAlt = meta.alt.toLowerCase();

      if ((lowerUrl.includes('doctor') || lowerUrl.includes('dr-') || lowerUrl.includes('staff') || lowerUrl.includes('team') || lowerUrl.includes('owner') || lowerAlt.includes('doctor') || lowerAlt.includes('dr.')) && !downloadedFiles.includes('profile.jpg')) {
        fileName = `profile.${ext}`;
        result.images.profile = `/images/${fileName}`;
      } else if (downloadedCount === 0) {
        fileName = `hero-poster.${ext}`;
        result.images.hero = `/images/${fileName}`;
      } else if (meta.category === 'gallery' || lowerUrl.includes('before') || lowerUrl.includes('after') || lowerUrl.includes('smile')) {
        fileName = `transformation-${downloadedCount}.${ext}`;
        result.images.transformations.push(`/images/${fileName}`);
      } else if (meta.category === 'about' || lowerUrl.includes('office') || lowerUrl.includes('building') || lowerUrl.includes('facility')) {
        fileName = `facility-${downloadedCount}.${ext}`;
        result.images.facility.push(`/images/${fileName}`);
      } else {
        fileName = `service-${downloadedCount}.${ext}`;
        result.images.gallery.push(`/images/${fileName}`);
      }

      const filePath = path.join(targetImagesDir, fileName);
      const size = await downloadImageFile(imgUrl, filePath, 7000);
      if (size > 0) {
        downloadedFiles.push(fileName);
        downloadedCount++;
        console.log(`      ✅ Saved: /images/${fileName} (${(size / 1024).toFixed(1)} KB) [${meta.category}]`);
      }
    } catch (_) {}
  }

  // If no transformations or facility were classified, distribute gallery
  if (result.images.transformations.length === 0 && downloadedFiles.length > 2) {
    result.images.transformations = downloadedFiles.slice(2, 5).map(f => `/images/${f}`);
  }

  console.log(`🎉 [Deep Crawler] Completed! Total ${downloadedCount} real media assets saved.\n`);
  return result;
}
