#!/usr/bin/env node
/**
 * Autonomous Zero-Quota Service Business Project Scaffolder & Asset Harvester
 * Integrated with Research-Driven Design Agent
 *
 * Usage:
 *   node scaffold-new-project.js "Business Name" "project-slug" --url="https://client-site.com" [--archetype="italian-rustic"]
 * Example:
 *   node scaffold-new-project.js "Sharon New Glass DMD" "glass-dentistry" --url="https://www.glassdentistry.com"
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { crawlFullWebsite } from './deep-crawler.js';
import { generateDesignTheme, injectDesignTheme } from './engine/design-agent-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawArgs = process.argv.slice(2);
let businessName = 'New Client Business';
let projectSlug = '';
let targetUrl = '';
let explicitArchetype = '';

for (const arg of rawArgs) {
  if (arg.startsWith('--url=')) {
    targetUrl = arg.replace('--url=', '').trim().replace(/^["']|["']$/g, '');
  } else if (arg.startsWith('--archetype=')) {
    explicitArchetype = arg.replace('--archetype=', '').trim().replace(/^["']|["']$/g, '');
  } else if (!projectSlug && businessName !== 'New Client Business') {
    projectSlug = arg.trim();
  } else if (businessName === 'New Client Business') {
    businessName = arg.trim();
  } else if (!projectSlug) {
    projectSlug = arg.trim();
  }
}

if (!projectSlug) {
  projectSlug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const targetDir = path.resolve(__dirname, '..', projectSlug);

console.log(`\n======================================================`);
console.log(`🚀 Autonomous Zero-Quota Client Scaffolder & Design Agent`);
console.log(`   Business Name: "${businessName}"`);
console.log(`   Project Slug:  "${projectSlug}"`);
console.log(`   Target URL:    "${targetUrl || 'None provided'}"`);
console.log(`   Archetype:     "${explicitArchetype || 'Auto-research'}"`);
console.log(`   Target Path:   ${targetDir}`);
console.log(`======================================================\n`);

if (fs.existsSync(targetDir)) {
  console.error(`❌ Error: Target directory already exists: ${targetDir}`);
  process.exit(1);
}

// 1. Recursive copy helper
function copyDirSync(src, dest, ignoreList = []) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (ignoreList.includes(entry.name)) continue;

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath, ignoreList);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log(`📦 1/6 Copying Master Template files...`);
copyDirSync(__dirname, targetDir, [
  'node_modules',
  '.git',
  'dist',
  'scaffold-new-project.js',
  'create-project.ps1'
]);

// 2. Create instant NTFS junction for node_modules (zero disk bloat, instant builds)
console.log(`⚡ 2/6 Linking node_modules junction...`);
const masterModules = path.join(__dirname, 'node_modules');
const targetModules = path.join(targetDir, 'node_modules');
if (fs.existsSync(masterModules)) {
  try {
    execSync(`cmd.exe /c mklink /J "${targetModules}" "${masterModules}"`, { stdio: 'ignore' });
    console.log(`   ✅ Created instant junction to master node_modules`);
  } catch (err) {
    console.warn(`   ⚠️ Junction warning:`, err.message);
  }
}

// 3. Customize package.json
const pkgPath = path.join(targetDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.name = projectSlug;
  pkg.version = '1.0.0';
  pkg.description = `${businessName} Web Application & Management Portal`;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
  console.log(`✅ 3/6 Updated package.json`);
}

// 4. Setup clean environment and database directory
const dbDir = path.join(targetDir, 'server', 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const envExamplePath = path.join(targetDir, '.env.example');
const envPath = path.join(targetDir, '.env');
if (fs.existsSync(envExamplePath)) {
  let envContent = fs.readFileSync(envExamplePath, 'utf-8');
  envContent = envContent.replace(/VITE_ADMIN_PASSWORD=.*/g, `VITE_ADMIN_PASSWORD=${projectSlug.slice(0, 4)}2026`);
  fs.writeFileSync(envPath, envContent, 'utf-8');
}

// 5. Scrape Metadata & Download Media Assets
async function harvestAssetsAndMetadata() {
  console.log(`📸 4/6 Harvesting Assets & Metadata with Deep Multi-Page Crawler...`);
  const imagesDir = path.join(targetDir, 'public', 'images');
  fs.mkdirSync(imagesDir, { recursive: true });

  const scrapedData = {
    title: `${businessName} | Professional Care & Trusted Service`,
    phone: '',
    email: '',
    address: '',
    bio: '',
    services: [],
    reviews: [],
    images: {
      hero: '/images/hero-poster.jpg',
      profile: '/images/profile.jpg',
      gallery: [],
      transformations: [],
      facility: []
    }
  };

  if (targetUrl) {
    try {
      const deepData = await crawlFullWebsite(targetUrl, imagesDir);
      if (deepData.title) scrapedData.title = deepData.title;
      if (deepData.phone) scrapedData.phone = deepData.phone;
      if (deepData.email) scrapedData.email = deepData.email;
      if (deepData.address) scrapedData.address = deepData.address;
      if (deepData.bio) scrapedData.bio = deepData.bio;
      if (deepData.services?.length) scrapedData.services = deepData.services;
      if (deepData.reviews?.length) scrapedData.reviews = deepData.reviews;
      if (deepData.images) scrapedData.images = deepData.images;
    } catch (err) {
      console.warn(`   ⚠️ Deep crawler notice:`, err.message);
    }
  }

  // 6. DESIGN AGENT PHASE: Research, Generate Ideas, Synthesize Theme
  console.log(`🎨 5/6 Design Agent: Researching niche identity and generating creative direction...`);
  const serviceKeywords = scrapedData.services.map(s => s.title || s.name || '');
  const designTheme = generateDesignTheme({
    businessName,
    targetUrl,
    archetypeId: explicitArchetype,
    keywords: serviceKeywords,
    city: scrapedData.address ? scrapedData.address.split(',')[1]?.trim() : ''
  });

  injectDesignTheme(targetDir, designTheme);

  console.log(`   ✨ Archetype Identified: ${designTheme.archetypeName} (${designTheme.archetypeId})`);
  console.log(`   ✨ Curated Typography  : Heading: "${designTheme.fonts.heading}" | Body: "${designTheme.fonts.body}"`);
  console.log(`   ✨ Harmonic Palette    : Primary: ${designTheme.colors.primary} | Accent: ${designTheme.colors.accent} | Dark: ${designTheme.colors.bgDark}`);
  console.log(`   ✨ Layout Archetype    : ${designTheme.layout.style}`);
  console.log(`   🖼️ Image Generation Spec Ready:`);
  console.log(`      Hero Poster Prompt  : "${designTheme.imageGeneration.heroPosterPrompt}"`);

  // 7. Write src/data/imageManifest.js
  const allDiscovered = [
    ...(scrapedData.images.transformations || []),
    ...(scrapedData.images.facility || []),
    ...(scrapedData.images.gallery || [])
  ];

  const manifestContent = `/**
 * Auto-Generated Image Manifest
 * Seeded by Deep Multi-Page Scaffolder for ${businessName}
 */
export const imageManifest = {
  hero: {
    poster: '${scrapedData.images.hero || '/images/hero-poster.jpg'}',
    alt: '${businessName} welcome and primary hero'
  },
  leadership: {
    primary: '${scrapedData.images.profile || '/images/profile.jpg'}',
    alt: '${businessName} leadership portrait'
  },
  transformations: [
${(scrapedData.images.transformations || []).map(img => `    '${img}',`).join('\n') || "    '/images/hero-poster.jpg',"}
  ],
  facility: [
${(scrapedData.images.facility || []).map(img => `    '${img}',`).join('\n') || "    '/images/hero-poster.jpg',"}
  ],
  gallery: [
${allDiscovered.map(img => `    '${img}',`).join('\n') || "    '/images/hero-poster.jpg',"}
  ]
};
`;
  const manifestPath = path.join(targetDir, 'src', 'data', 'imageManifest.js');
  fs.writeFileSync(manifestPath, manifestContent, 'utf-8');
  console.log(`✅ Exported src/data/imageManifest.js`);

  // 8. Update businessData.js with scraped information & design hooks
  const bizDataPath = path.join(targetDir, 'src', 'data', 'businessData.js');
  if (fs.existsSync(bizDataPath)) {
    let bizContent = fs.readFileSync(bizDataPath, 'utf-8');
    bizContent = bizContent.replace(/name:\s*["'].*?["'],/, `name: ${JSON.stringify(businessName)},`);
    bizContent = bizContent.replace(/legalName:\s*["'].*?["'],/, `legalName: ${JSON.stringify(businessName + " LLC")},`);
    bizContent = bizContent.replace(/tagline:\s*["'].*?["'],/, `tagline: ${JSON.stringify(designTheme.copyHooks.heroSubtitle)},`);
    if (scrapedData.phone) {
      bizContent = bizContent.replace(/phone:\s*["'].*?["'],/, `phone: ${JSON.stringify(scrapedData.phone)},`);
    }
    if (scrapedData.email) {
      bizContent = bizContent.replace(/email:\s*["'].*?["'],/, `email: ${JSON.stringify(scrapedData.email)},`);
    }
    if (scrapedData.address) {
      bizContent = bizContent.replace(/formatted:\s*["'].*?["'],/, `formatted: ${JSON.stringify(scrapedData.address)},`);
    }
    fs.writeFileSync(bizDataPath, bizContent, 'utf-8');
    console.log(`✅ Updated src/data/businessData.js`);
  }

  // 9. Update index.html title
  const indexPath = path.join(targetDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf-8');
    indexContent = indexContent.replace(/<title>.*?<\/title>/, `<title>${scrapedData.title || `${businessName} | ${designTheme.archetypeName}`}</title>`);
    fs.writeFileSync(indexPath, indexContent, 'utf-8');
    console.log(`✅ Updated index.html title`);
  }

  // 10. Initialize clean Git repository
  try {
    execSync('git init', { cwd: targetDir, stdio: 'ignore' });
    console.log(`✅ 6/6 Initialized clean Git repository`);
  } catch (e) {
    console.warn(`   ⚠️ Git init warning:`, e.message);
  }

  console.log(`\n======================================================`);
  console.log(`🎉 Scaffolding & Design System Synthesis Complete!`);
  console.log(`   Archetype Applied: ${designTheme.archetypeName}`);
  console.log(`======================================================`);
  console.log(`To generate custom AI imagery for this site's hero:`);
  console.log(`Run generate_image with:`);
  console.log(`Prompt: "${designTheme.imageGeneration.heroPosterPrompt}"`);
  console.log(`Target: ${path.join(targetDir, 'public', 'images', 'hero-poster.jpg')}\n`);
}

harvestAssetsAndMetadata();
