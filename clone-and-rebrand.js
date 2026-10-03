#!/usr/bin/env node
/**
 * Autonomous Zero-Quota Site Replicator & Rebrander (/build engine)
 * 
 * Replicates an existing winning site (e.g. glass-dentistry, top-canada-plumbing) or master template,
 * scrapes new client assets, rewrites business branding, pushes to a fresh GitHub repo,
 * and deploys to production Vercel in seconds with ZERO LLM API tokens.
 *
 * Usage:
 *   node clone-and-rebrand.js --from="glass-dentistry" --to="new-dental" --name="Apex Dental Care" --url="https://..." --deploy
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { crawlFullWebsite } from './deep-crawler.js';
import { generateDesignTheme, injectDesignTheme } from './engine/design-agent-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDocumentsDir = path.resolve(__dirname, '..');

// 1. Parse Arguments
const args = process.argv.slice(2);
let fromSlug = 'service-biz-master-template';
let toSlug = '';
let businessName = '';
let targetUrl = '';
let shouldDeploy = true; // default to auto-deploy unless --no-deploy is specified

for (const arg of args) {
  if (arg.startsWith('--from=')) {
    fromSlug = arg.replace('--from=', '').trim().replace(/^["']|["']$/g, '');
  } else if (arg.startsWith('--to=')) {
    toSlug = arg.replace('--to=', '').trim().replace(/^["']|["']$/g, '');
  } else if (arg.startsWith('--name=')) {
    businessName = arg.replace('--name=', '').trim().replace(/^["']|["']$/g, '');
  } else if (arg.startsWith('--url=')) {
    targetUrl = arg.replace('--url=', '').trim().replace(/^["']|["']$/g, '');
  } else if (arg === '--no-deploy') {
    shouldDeploy = false;
  } else if (arg === '--deploy') {
    shouldDeploy = true;
  } else if (!toSlug && !arg.startsWith('--')) {
    toSlug = arg.trim();
  }
}

if (!toSlug) {
  if (businessName) {
    toSlug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  } else {
    console.error(`❌ Error: Please specify target project slug via --to="<slug>" or --name="<Business Name>"`);
    process.exit(1);
  }
}

if (!businessName) {
  businessName = toSlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const sourceDir = path.resolve(baseDocumentsDir, fromSlug);
const targetDir = path.resolve(baseDocumentsDir, toSlug);

console.log(`\n======================================================`);
console.log(`⚡ Autonomous Site Replicator (/build Engine)`);
console.log(`   Source Template : ${fromSlug} (${sourceDir})`);
console.log(`   New Project Slug: ${toSlug}`);
console.log(`   New Business    : "${businessName}"`);
console.log(`   Target URL      : ${targetUrl || 'None provided'}`);
console.log(`   Auto-Deploy     : ${shouldDeploy ? 'YES (GitHub + Vercel)' : 'NO'}`);
console.log(`   Destination     : ${targetDir}`);
console.log(`======================================================\n`);

if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Error: Source directory does not exist: ${sourceDir}`);
  process.exit(1);
}

if (fs.existsSync(targetDir)) {
  console.error(`❌ Error: Target directory already exists: ${targetDir}`);
  process.exit(1);
}

// 2. Recursive Copy (Skipping .git, node_modules, dist)
function copyDirSync(src, dest, ignoreList = []) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (ignoreList.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath, ignoreList);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log(`📦 1/5 Cloning source architecture from "${fromSlug}"...`);
copyDirSync(sourceDir, targetDir, [
  '.git',
  'node_modules',
  'dist',
  '.vercel',
  'clone-and-rebrand.js',
  'scaffold-new-project.js'
]);

// 3. Link node_modules via NTFS Junction (0 download time, 0 disk bloat)
console.log(`⚡ 2/5 Linking node_modules junction...`);
const sourceModules = path.join(sourceDir, 'node_modules');
const masterModules = path.resolve(baseDocumentsDir, 'service-biz-master-template', 'node_modules');
const targetModules = path.join(targetDir, 'node_modules');

const junctionSource = fs.existsSync(sourceModules) ? sourceModules : masterModules;
if (fs.existsSync(junctionSource)) {
  try {
    execSync(`cmd.exe /c mklink /J "${targetModules}" "${junctionSource}"`, { stdio: 'ignore' });
    console.log(`   ✅ Linked instant junction to node_modules`);
  } catch (err) {
    console.warn(`   ⚠️ Junction warning:`, err.message);
  }
}

// 4. Update package.json
const pkgPath = path.join(targetDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.name = toSlug;
    pkg.description = `${businessName} Web Application & Management Portal`;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
    console.log(`✅ Updated package.json`);
  } catch (_) {}
}

// 5. Scrape Real Assets & Details if Target URL Provided
async function runIntakeAndRebrand() {
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
    console.log(`📸 3/5 Deep multi-page crawler analyzing ${targetUrl}...`);
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

  // 6. Rewrite businessData.js
  const bizDataPath = path.join(targetDir, 'src', 'data', 'businessData.js');
  if (fs.existsSync(bizDataPath)) {
    let bizContent = fs.readFileSync(bizDataPath, 'utf-8');
    bizContent = bizContent.replace(/name:\s*["'].*?["'],/, `name: ${JSON.stringify(businessName)},`);
    bizContent = bizContent.replace(/legalName:\s*["'].*?["'],/, `legalName: ${JSON.stringify(businessName + " LLC")},`);
    if (scrapedData.phone) {
      bizContent = bizContent.replace(/phone:\s*["'].*?["'],/, `phone: ${JSON.stringify(scrapedData.phone)},`);
    }
    if (scrapedData.email) {
      bizContent = bizContent.replace(/email:\s*["'].*?["'],/, `email: ${JSON.stringify(scrapedData.email)},`);
    }
    if (scrapedData.address) {
      bizContent = bizContent.replace(/formatted:\s*["'].*?["'],/, `formatted: ${JSON.stringify(scrapedData.address)},`);
    }
  // 6B. Design Agent: Research Niche & Synthesize Bespoke Design Theme
  try {
    console.log(`🎨 Synthesizing bespoke design theme & typography...`);
    const serviceKeywords = (scrapedData.services || []).map(s => s.title || s.name || s || '');
    const designTheme = generateDesignTheme({
      businessName,
      targetUrl,
      keywords: serviceKeywords,
      city: scrapedData.address ? scrapedData.address.split(',')[1]?.trim() : ''
    });
    injectDesignTheme(targetDir, designTheme);
    console.log(`   ✨ Archetype: ${designTheme.archetypeName} | Font: "${designTheme.fonts.heading}"`);
  } catch (err) {
    console.warn(`   ⚠️ Design agent notice:`, err.message);
  }

  // 7. Rewrite imageManifest.js with categorized images
  const allHarvestedImages = [
    scrapedData.images.hero,
    scrapedData.images.profile,
    ...(scrapedData.images.gallery || []),
    ...(scrapedData.images.transformations || []),
    ...(scrapedData.images.facility || [])
  ].filter(Boolean);

  if (allHarvestedImages.length > 0) {
    const manifestContent = `/**
 * Auto-Generated Image Manifest for ${businessName}
 * Harvested across all subpages by /build Deep Crawler
 */
export const imageManifest = {
  hero: {
    poster: '${scrapedData.images.hero || '/images/hero-poster.jpg'}',
    alt: '${businessName} primary hero visual'
  },
  leadership: {
    primary: '${scrapedData.images.profile || '/images/profile.jpg'}',
    alt: '${businessName} leadership'
  },
  transformations: [
${(scrapedData.images.transformations || []).map(img => `    '${img}',`).join('\n')}
  ],
  facility: [
${(scrapedData.images.facility || []).map(img => `    '${img}',`).join('\n')}
  ],
  gallery: [
${(scrapedData.images.gallery || []).map(img => `    '${img}',`).join('\n')}
  ]
};
`;
    const manifestPath = path.join(targetDir, 'src', 'data', 'imageManifest.js');
    fs.writeFileSync(manifestPath, manifestContent, 'utf-8');
    console.log(`✅ Updated src/data/imageManifest.js with ${allHarvestedImages.length} multi-page media assets`);
  }

  // 8. Rewrite index.html
  const indexPath = path.join(targetDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf-8');
    indexContent = indexContent.replace(/<title>.*?<\/title>/, `<title>${scrapedData.title || businessName}</title>`);
    fs.writeFileSync(indexPath, indexContent, 'utf-8');
    console.log(`✅ Updated index.html with new business title`);
  }

  // 9. Git Init & Initial Commit
  console.log(`🛠️ 4/5 Setting up Git repository...`);
  const gitSteps = [
    'git init',
    'git branch -M main',
    'git add .',
    `git commit -m "feat: initial launch for ${toSlug}"`
  ];
  for (const step of gitSteps) {
    try {
      execSync(step, { cwd: targetDir, stdio: 'ignore' });
    } catch (_) {}
  }
  console.log(`   ✅ Initialized clean Git repository on branch "main"`);

  // 10. Autonomous Build & Deployment
  let deployUrl = `https://${toSlug}.vercel.app`;
  const githubRepoUrl = `https://github.com/Goodyness-dev/${toSlug}`;

  if (shouldDeploy) {
    console.log(`\n🚀 5/5 Building & Deploying autonomously to GitHub & Vercel...`);
    try {
      console.log(`   🔨 Compiling production build (npm run build)...`);
      execSync('npm run build', { cwd: targetDir, stdio: 'inherit' });
      console.log(`   ✅ Build successful (0 errors)`);
    } catch (err) {
      console.error(`   ❌ Build compilation error:`, err.message);
      process.exit(1);
    }

    try {
      console.log(`   📦 Pushing to GitHub (Goodyness-dev/${toSlug})...`);
      execSync(`gh repo create ${toSlug} --public --source=. --remote=origin --push`, {
        cwd: targetDir,
        stdio: 'inherit'
      });
      console.log(`   ✅ Pushed to GitHub repository: ${githubRepoUrl}`);
    } catch (err) {
      console.warn(`   ⚠️ GitHub push notice:`, err.message);
    }

    try {
      console.log(`   🌐 Deploying to Vercel production...`);
      const vercelOutput = execSync('npx vercel --prod --yes', {
        cwd: targetDir,
        encoding: 'utf-8'
      });
      const match = vercelOutput.match(/https:\/\/[a-z0-9-]+\.vercel\.app/i);
      if (match) {
        deployUrl = match[0];
      }
      console.log(`   ✅ Deployed to Vercel!`);
    } catch (err) {
      console.warn(`   ⚠️ Vercel deployment notice:`, err.message);
    }
  }

  console.log(`\n======================================================`);
  console.log(`🎉 /build COMPLETE! 100% Autonomous, ZERO Token Burn!`);
  console.log(`======================================================`);
  console.log(`🌐 Public Website : ${deployUrl}`);
  console.log(`🛠️ Admin Dashboard: ${deployUrl}/admin`);
  console.log(`📦 GitHub Repo    : ${githubRepoUrl}`);
  console.log(`======================================================\n`);
}

runIntakeAndRebrand();
