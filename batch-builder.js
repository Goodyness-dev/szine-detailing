#!/usr/bin/env node
/**
 * 🚀 High-Volume Autonomous Batch Outreach Engine (100 Sites / Day)
 *
 * Usage:
 *   node batch-builder.js [--file="targets.txt"] [--concurrency=3] [--no-deploy]
 *
 * Reads a list of target URLs, deep-crawls and rebuilds each client website,
 * deploys to Vercel, and exports an outreach spreadsheet (outreach_leads.csv).
 */

import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDocumentsDir = path.resolve(__dirname, '..');

// 1. Parse CLI Arguments
const args = process.argv.slice(2);
let targetsFile = path.resolve(__dirname, 'targets.txt');
let concurrency = 3;
let shouldDeploy = true;

for (const arg of args) {
  if (arg.startsWith('--file=')) {
    const customPath = arg.replace('--file=', '').trim().replace(/^["']|["']$/g, '');
    targetsFile = path.isAbsolute(customPath) ? customPath : path.resolve(process.cwd(), customPath);
  } else if (arg.startsWith('--concurrency=')) {
    concurrency = parseInt(arg.replace('--concurrency=', '').trim(), 10) || 3;
  } else if (arg === '--no-deploy') {
    shouldDeploy = false;
  } else if (arg === '--deploy') {
    shouldDeploy = true;
  }
}

// 2. Ensure Targets File Exists
if (!fs.existsSync(targetsFile)) {
  const sampleContent = `# Paste target client website URLs below (one per line):
https://www.glassdentistry.com
# https://example-dental.com
`;
  fs.writeFileSync(targetsFile, sampleContent, 'utf-8');
  console.log(`ℹ️ Created starter targets file at: ${targetsFile}`);
  console.log(`Please paste your client URLs into targets.txt and re-run.`);
  process.exit(0);
}

// 3. Read & Sanitize Target URLs
const lines = fs.readFileSync(targetsFile, 'utf-8').split('\n');
const rawTargets = lines
  .map(l => l.trim())
  .filter(l => l.length > 0 && !l.startsWith('#') && (l.startsWith('http://') || l.startsWith('https://')));

// 4. Load History & De-duplicate
const historyFile = path.resolve(__dirname, 'built_history.json');
let history = {};
if (fs.existsSync(historyFile)) {
  try {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
  } catch (_) {
    history = {};
  }
}

const targets = rawTargets.filter(url => {
  if (history[url] && history[url].status === 'success') {
    return false; // Skip already built sites
  }
  return true;
});

const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '_');
const csvFile = path.resolve(process.cwd(), `outreach_leads_${todayStr}.csv`);
const masterCsvFile = path.resolve(process.cwd(), 'outreach_leads.csv');

// Initialize CSV header if not exists
const csvHeader = 'Business Name,Phone,Address,Live Pitch URL,Admin Portal,Admin Password,Original URL,Status,Date\n';
if (!fs.existsSync(csvFile)) {
  fs.writeFileSync(csvFile, csvHeader, 'utf-8');
}
if (!fs.existsSync(masterCsvFile)) {
  fs.writeFileSync(masterCsvFile, csvHeader, 'utf-8');
}

console.log(`\n======================================================`);
console.log(`🚀 AUTONOMOUS BATCH OUTREACH ENGINE (100 SITES / DAY)`);
console.log(`======================================================`);
console.log(`📋 Total Targets in File: ${rawTargets.length}`);
console.log(`⚡ New Targets to Build : ${targets.length} (Skipped ${rawTargets.length - targets.length} duplicates)`);
console.log(`⚙️ Concurrency Level    : ${concurrency} parallel workers`);
console.log(`📊 Export CSV File       : ${csvFile}`);
console.log(`🚀 Auto-Deploy to Vercel : ${shouldDeploy ? 'YES' : 'NO'}`);
console.log(`======================================================\n`);

if (targets.length === 0) {
  console.log(`🎉 All targets in ${path.basename(targetsFile)} have already been built!`);
  console.log(`Paste new URLs into ${path.basename(targetsFile)} to generate more sites.\n`);
  process.exit(0);
}

// 5. Worker Queue
let currentIndex = 0;
let activeWorkers = 0;
let successCount = 0;
let failCount = 0;

function escapeCsv(field) {
  if (!field) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

function processNextTarget() {
  if (currentIndex >= targets.length && activeWorkers === 0) {
    onBatchComplete();
    return;
  }

  while (activeWorkers < concurrency && currentIndex < targets.length) {
    const targetUrl = targets[currentIndex];
    const taskIndex = currentIndex + 1;
    currentIndex++;
    activeWorkers++;

    executeRebuild(targetUrl, taskIndex)
      .then(result => {
        activeWorkers--;
        if (result.success) {
          successCount++;
          history[targetUrl] = { status: 'success', date: new Date().toISOString(), url: result.deployUrl };
          
          // Append to CSVs
          const row = [
            escapeCsv(result.name),
            escapeCsv(result.phone),
            escapeCsv(result.address),
            escapeCsv(result.deployUrl),
            escapeCsv(result.adminUrl),
            escapeCsv('demo2026'),
            escapeCsv(targetUrl),
            escapeCsv('LIVE'),
            escapeCsv(new Date().toLocaleDateString())
          ].join(',') + '\n';

          fs.appendFileSync(csvFile, row, 'utf-8');
          fs.appendFileSync(masterCsvFile, row, 'utf-8');
          fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf-8');

          console.log(`✅ [${taskIndex}/${targets.length}] BUILT: ${result.name} -> ${result.deployUrl}`);
        } else {
          failCount++;
          history[targetUrl] = { status: 'failed', date: new Date().toISOString(), error: result.error };
          fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf-8');
          console.warn(`❌ [${taskIndex}/${targets.length}] FAILED: ${targetUrl} (${result.error})`);
        }

        processNextTarget();
      })
      .catch(err => {
        activeWorkers--;
        failCount++;
        console.error(`❌ [${taskIndex}/${targets.length}] UNEXPECTED ERROR:`, err.message);
        processNextTarget();
      });
  }
}

function executeRebuild(url, index) {
  return new Promise(resolve => {
    const rebuildScript = path.resolve(__dirname, 'rebuild-site.js');
    const deployFlag = shouldDeploy ? '--deploy' : '--no-deploy';
    const cmd = `node "${rebuildScript}" --url="${url}" ${deployFlag}`;

    console.log(`⏳ [${index}/${targets.length}] Starting crawl & build for: ${url}`);

    exec(cmd, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024, timeout: 180000 }, (error, stdout, stderr) => {
      const output = (stdout || '') + (stderr || '');

      // Parse URLs from stdout
      const publicMatch = output.match(/🌐 Public Website\s*:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
      const adminMatch = output.match(/🛠️ Admin Dashboard\s*:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app\/admin)/i);
      const nameMatch = output.match(/Business Name\s*:\s*"([^"]+)"/i);
      const destMatch = output.match(/Destination\s*:\s*(.+)/i);

      let name = nameMatch ? nameMatch[1].trim() : 'Client Business';
      let phone = '';
      let address = '';
      let deployUrl = publicMatch ? publicMatch[1] : '';
      let adminUrl = adminMatch ? adminMatch[1] : (deployUrl ? `${deployUrl}/admin` : '');

      // Try reading businessData.js from target folder if available
      if (destMatch) {
        const destDir = destMatch[1].trim();
        const bizDataPath = path.join(destDir, 'src', 'data', 'businessData.js');
        if (fs.existsSync(bizDataPath)) {
          try {
            const content = fs.readFileSync(bizDataPath, 'utf-8');
            const n = content.match(/name:\s*["']([^"']+)["']/);
            const p = content.match(/phone:\s*["']([^"']+)["']/);
            const a = content.match(/formatted:\s*["']([^"']+)["']/);
            if (n) name = n[1];
            if (p) phone = p[1];
            if (a) address = a[1];
          } catch (_) {}
        }
      }

      if (error && !deployUrl) {
        const errSnippet = output.split('\n').filter(l => l.includes('Error') || l.includes('failed')).slice(-2).join(' ') || error.message;
        resolve({ success: false, error: errSnippet.slice(0, 100) });
      } else {
        resolve({
          success: true,
          name,
          phone,
          address,
          deployUrl: deployUrl || `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.vercel.app`,
          adminUrl: adminUrl || `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.vercel.app/admin`
        });
      }
    });
  });
}

function onBatchComplete() {
  console.log(`\n======================================================`);
  console.log(`🎉 BATCH CAMPAIGN COMPLETE!`);
  console.log(`======================================================`);
  console.log(`✅ Successfully Built: ${successCount}`);
  console.log(`❌ Failed / Skipped   : ${failCount}`);
  console.log(`📄 Spreadsheet Ready  : ${csvFile}`);
  console.log(`   (Also updated master file: ${masterCsvFile})`);
  console.log(`======================================================\n`);
  console.log(`💡 NEXT STEPS:`);
  console.log(`1. Open ${path.basename(csvFile)} to see all live links & client details.`);
  console.log(`2. If you want to tweak any site (e.g. change colors or headline),`);
  console.log(`   just ask me in the chat box: "On <client-slug>: change headline to..."`);
  console.log(`3. Import the CSV into your cold outreach software (Instantly / Lemlist) to start booking calls!\n`);
}

processNextTarget();
