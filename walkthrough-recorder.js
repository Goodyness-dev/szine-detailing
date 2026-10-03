#!/usr/bin/env node

/**
 * ============================================================================
 * 🎥 LUXURY 60-SECOND CINEMATIC WALKTHROUGH RECORDER (PLAYWRIGHT + FFMPEG)
 * ============================================================================
 * Agency-grade video pitch engine comparing a local business's missing or
 * leaky web presence against an AI-built high-conversion revenue platform.
 *
 * Full 4-Act Narrative Arc (~55–60 Seconds at 60 FPS):
 *  - ACT 1 (0:00–0:15): The Localized Google Audit (Authentic Mahé map + Profile)
 *  - ACT 2 (0:15–0:38): Desktop Platform Unveiling & Real DOM Drawer Interactions
 *  - ACT 3 (0:38–0:50): Mobile Viewport (iPhone 15 Pro) & Sticky Bottom Conversion
 *  - ACT 4 (0:50–0:58): Outro Finale & Dual-Device Revenue Proof
 * ============================================================================
 */

import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse CLI Arguments
const args = process.argv.slice(2);
function getArg(key, fallback = '') {
  const item = args.find((a) => a.startsWith(`--${key}=`));
  return item ? item.split('=')[1].replace(/^["']|["']$/g, '') : fallback;
}

const OLD_URL_RAW = getArg('old', '');
const NO_WEBSITE = args.includes('--no-website') || OLD_URL_RAW === 'none' || OLD_URL_RAW === '' || OLD_URL_RAW.includes('google.com/maps');
const NEW_URL = getArg('new', 'https://perrys-grillz.vercel.app/');
const BUSINESS_NAME = getArg('name', "Perry's Grillz");
const LOCATION = getArg('location', 'Les Canelles Hilltop, Mahé, Seychelles');
const TRADE = getArg('trade', 'Creole BBQ & Hilltop Dining');
const RATING = getArg('rating', '4.9');
const REVIEWS_COUNT = getArg('reviews', '164');
const PHONE = getArg('phone', '+248 2 527 260');
const FPS = parseInt(getArg('fps', '60'), 10);
const OUTPUT_DIR = path.resolve(__dirname, 'output', 'walkthroughs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const slug = BUSINESS_NAME.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const outputVideo = path.join(OUTPUT_DIR, `${slug}-walkthrough.mp4`);
const outputStill = path.join(OUTPUT_DIR, `${slug}-before-after.png`);

console.log(`\n======================================================`);
console.log(`🎬 60-SECOND LUXURY WALKTHROUGH RECORDER INITIALIZED`);
console.log(`======================================================`);
console.log(`🏢 Business:     ${BUSINESS_NAME}`);
console.log(`📍 Location:     ${LOCATION}`);
console.log(`⭐ Rating:       ${RATING}★ (${REVIEWS_COUNT} Reviews)`);
console.log(`✨ New Platform: ${NEW_URL}`);
console.log(`🎞️ Framerate:    ${FPS} FPS`);
console.log(`📁 Video Output: ${outputVideo}`);
console.log(`🖼️ Still Card:   ${outputStill}`);
console.log(`======================================================\n`);

/**
 * Easing Functions
 */
function cubicBezier(t) {
  // Apple / Figma smooth easing curve (cubic-bezier(0.16, 1, 0.3, 1))
  return 1 - Math.pow(1 - t, 4);
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Injected In-Page HUD, Virtual Cursor, and Visual Feedback Styles
 */
const OVERLAY_INJECT_SCRIPT = `
(function() {
  // If elements already exist in this document, skip
  if (document.getElementById('__rec_hud__')) return;

  // 1. Inject Styles
  let style = document.getElementById('__recorder_styles__');
  if (!style) {
    style = document.createElement('style');
    style.id = '__recorder_styles__';
    style.innerHTML = \`
      #__rec_cursor__ {
        position: fixed;
        top: 0;
        left: 0;
        width: 28px;
        height: 28px;
        z-index: 999999999;
        pointer-events: none;
        transform: translate(-2px, -2px);
        filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.5));
        transition: none;
      }

      #__rec_ripple__ {
        position: fixed;
        top: 0;
        left: 0;
        width: 60px;
        height: 60px;
        margin-left: -30px;
        margin-top: -30px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 999999998;
        opacity: 0;
        transform: scale(0.2);
      }

      #__rec_hud__ {
        position: fixed;
        bottom: 34px;
        left: 50%;
        transform: translateX(-50%) translateY(40px);
        z-index: 999999999;
        pointer-events: none;
        background: rgba(12, 12, 15, 0.92);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
        border-radius: 9999px;
        padding: 14px 30px;
        display: flex;
        align-items: center;
        gap: 16px;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        opacity: 0;
        transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        white-space: nowrap;
        max-width: 92vw;
      }

      #__rec_hud__.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      #__rec_hud_badge__ {
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 5px 12px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      #__rec_hud_badge__.leak {
        background: rgba(239, 68, 68, 0.22);
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.45);
      }

      #__rec_hud_badge__.fix {
        background: rgba(16, 185, 129, 0.22);
        color: #6ee7b7;
        border: 1px solid rgba(16, 185, 129, 0.45);
      }

      #__rec_hud_text__ {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.01em;
        color: #f3f4f6;
      }

      #__rec_hud_sub__ {
        font-size: 13px;
        color: #9ca3af;
        font-weight: 400;
        border-left: 1px solid rgba(255, 255, 255, 0.15);
        padding-left: 14px;
      }

      /* Live Action Toast (Phone call dialer banner) */
      #__rec_call_toast__ {
        position: fixed;
        top: 28px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        z-index: 999999999;
        pointer-events: none;
        background: #064e3b;
        border: 1px solid #059669;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        color: #ecfdf5;
        padding: 14px 28px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        font-weight: 600;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      #__rec_call_toast__.active {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    \`;
    document.head.appendChild(style);
  }

  // 2. Cursor SVG (macOS / Figma crisp pointer)
  const cursor = document.createElement('div');
  cursor.id = '__rec_cursor__';
  cursor.innerHTML = \`
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2L11.5 24.5L15.8 15.2L25 11.5L3 2Z" fill="#111827" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  \`;
  document.body.appendChild(cursor);

  // 3. Ripple
  const ripple = document.createElement('div');
  ripple.id = '__rec_ripple__';
  document.body.appendChild(ripple);

  // 4. HUD
  const hud = document.createElement('div');
  hud.id = '__rec_hud__';
  hud.innerHTML = \`
    <div id="__rec_hud_badge__" class="leak">LEAK DETECTED</div>
    <div id="__rec_hud_text__">Issue</div>
    <div id="__rec_hud_sub__">Explanation</div>
  \`;
  document.body.appendChild(hud);

  // 5. Call Toast
  const callToast = document.createElement('div');
  callToast.id = '__rec_call_toast__';
  callToast.innerHTML = \`
    <span style="font-size: 18px;">📞</span>
    <span id="__rec_call_msg__">Dialing +248 2 527 260... Direct Call Connected</span>
  \`;
  document.body.appendChild(callToast);

  // Global State Controllers
  window.__SET_CURSOR__ = (x, y) => {
    const c = document.getElementById('__rec_cursor__');
    if (c) c.style.transform = \`translate(\${x}px, \${y}px)\`;
  };

  window.__TRIGGER_RIPPLE__ = (x, y, isFix = false) => {
    const r = document.getElementById('__rec_ripple__');
    if (!r) return;
    r.style.left = \`\${x}px\`;
    r.style.top = \`\${y}px\`;
    r.style.background = isFix
      ? 'radial-gradient(circle, rgba(16, 185, 129, 0.85) 0%, rgba(16, 185, 129, 0) 70%)'
      : 'radial-gradient(circle, rgba(239, 68, 68, 0.85) 0%, rgba(239, 68, 68, 0) 70%)';
    r.style.transform = 'scale(0.2)';
    r.style.opacity = '1';
    r.style.transition = 'none';

    requestAnimationFrame(() => {
      r.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease-out';
      r.style.transform = 'scale(2.2)';
      r.style.opacity = '0';
    });
  };

  window.__SET_HUD__ = (visible, type, title, subtitle) => {
    const hudEl = document.getElementById('__rec_hud__');
    const badge = document.getElementById('__rec_hud_badge__');
    const text = document.getElementById('__rec_hud_text__');
    const sub = document.getElementById('__rec_hud_sub__');
    if (!hudEl || !badge || !text) return;

    if (visible) {
      badge.className = '__rec_hud_badge__ ' + (type === 'fix' ? 'fix' : 'leak');
      badge.textContent = type === 'fix' ? 'ZERO-FRICTION FIX' : 'CONVERSION LEAK';
      text.textContent = title;
      sub.textContent = subtitle || '';
      hudEl.classList.add('visible');
    } else {
      hudEl.classList.remove('visible');
    }
  };

  window.__SHOW_CALL_TOAST__ = (msg, durationMs = 2800) => {
    const toast = document.getElementById('__rec_call_toast__');
    const label = document.getElementById('__rec_call_msg__');
    if (!toast) return;
    if (label && msg) label.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, durationMs);
  };
})();
`;

/**
 * Hyper-Localized Google Business Profile Template (Mahé, Seychelles)
 */
function getLocalizedGoogleHtml(bizName, rating, reviews, location, trade, phone) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Google Maps - ${bizName}</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1440px;
          height: 900px;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          color: #1e293b;
          overflow: hidden;
        }
        /* Top Google Search Bar */
        .search-bar-wrap {
          position: absolute;
          top: 16px;
          left: 16px;
          width: 390px;
          height: 48px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.18);
          z-index: 1000;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 12px;
          font-size: 15px;
          font-weight: 500;
        }
        .search-icon { color: #5f6368; font-size: 16px; }
        .search-input { color: #202124; flex: 1; }
        .google-mic { color: #4285f4; font-weight: bold; }

        /* Left Google Listing Card */
        .sidebar {
          width: 410px;
          height: 900px;
          background: #ffffff;
          box-shadow: 4px 0 24px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e2e8f0;
          z-index: 100;
          padding-top: 76px;
          overflow-y: auto;
        }
        .cover-photo {
          width: 100%;
          height: 190px;
          background: url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80') center/cover;
          position: relative;
        }
        .listing-details {
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .biz-title {
          font-size: 23px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.25;
        }
        .rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #475569;
        }
        .stars { color: #f59e0b; font-size: 16px; font-weight: 700; }
        .cat-tag { color: #64748b; font-size: 13px; }

        /* Action Buttons */
        .action-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 6px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 10px 4px;
          border-radius: 12px;
          background: #f1f5f9;
          font-size: 11px;
          font-weight: 700;
          color: #1d4ed8;
          text-align: center;
        }
        .action-btn.missing {
          background: #fef2f2;
          color: #dc2626;
          border: 2px dashed #ef4444;
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.3);
        }

        /* Detail Rows */
        .detail-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 13px;
          color: #334155;
          line-height: 1.4;
        }
        .detail-row span:first-child { font-size: 16px; }

        /* Right Real Map */
        #map {
          flex: 1;
          height: 900px;
          z-index: 1;
        }
      </style>
    </head>
    <body>
      <div class="search-bar-wrap">
        <span class="search-icon">🔍</span>
        <span class="search-input">${bizName} Seychelles</span>
        <span class="google-mic">🎤</span>
      </div>

      <div class="sidebar">
        <div class="cover-photo"></div>
        <div class="listing-details">
          <div class="biz-title">${bizName}</div>
          <div class="rating-row">
            <span class="stars">${rating} ★★★★★</span>
            <span>(${reviews} reviews)</span>
          </div>
          <div class="cat-tag">${trade} · Open · Closes 10:00 PM</div>

          <div class="action-row">
            <div class="action-btn">
              <span>📞</span>
              <span>Call</span>
            </div>
            <div class="action-btn">
              <span>🚗</span>
              <span>Directions</span>
            </div>
            <div class="action-btn">
              <span>💾</span>
              <span>Save</span>
            </div>
            <div id="missing-web-btn" class="action-btn missing">
              <span>⚠️</span>
              <span>NO SITE</span>
            </div>
          </div>

          <div class="detail-row">
            <span>📍</span>
            <div>
              <strong>${location}</strong><br>
              <span style="color: #64748b; font-size: 12px;">Overlooking southern coastline</span>
            </div>
          </div>

          <div class="detail-row">
            <span>📞</span>
            <span>${phone}</span>
          </div>

          <div class="detail-row" style="color: #dc2626; font-weight: 700; background: #fef2f2; padding: 10px 12px; border-radius: 8px;">
            <span>❌</span>
            <span>No Official Website Linked · Diners Cannot Reserve Tables Online</span>
          </div>
        </div>
      </div>

      <div id="map"></div>

      <script>
        // Real geographic map of Mahé, Seychelles centered on Les Canelles
        const map = L.map('map', { zoomControl: false }).setView([-4.715, 55.488], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        // Custom Google-style red location pin
        const marker = L.marker([-4.715, 55.488]).addTo(map);
        marker.bindPopup('<b>${bizName}</b><br>${location}').openPopup();
      </script>
    </body>
    </html>
  `;
}

/**
 * Main Cinematic Walkthrough Rendering Loop
 */
async function renderWalkthrough() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-web-security', '--allow-running-insecure-content', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  console.log(`🎥 Spawning FFmpeg video pipe at ${FPS} FPS...`);
  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-r', `${FPS}`,
    '-i', '-',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    outputVideo
  ];

  const ffmpeg = spawn(ffmpegPath, ffmpegArgs);

  ffmpeg.stderr.on('data', (data) => {
    const str = data.toString();
    if (str.includes('error') || str.includes('Error')) {
      console.error(`[FFmpeg Err]: ${str.trim()}`);
    }
  });

  let totalFramesWritten = 0;
  const startTime = Date.now();

  async function writeFrame() {
    const buffer = await page.screenshot({ type: 'png' });
    ffmpeg.stdin.write(buffer);
    totalFramesWritten++;
    if (totalFramesWritten % 120 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const videoTime = (totalFramesWritten / FPS).toFixed(1);
      process.stdout.write(`\r🎞️ Rendered ${totalFramesWritten} frames (${videoTime}s video time | ${elapsed}s wall clock)...`);
    }
  }

  async function animateMotion({
    startX = 100,
    startY = 100,
    endX = 100,
    endY = 100,
    startScroll = 0,
    endScroll = 0,
    durationSec = 1.0,
    easing = cubicBezier
  }) {
    const frameCount = Math.max(1, Math.round(durationSec * FPS));
    for (let i = 0; i <= frameCount; i++) {
      const progress = easing(i / frameCount);
      const curX = lerp(startX, endX, progress);
      const curY = lerp(startY, endY, progress);
      const curScroll = lerp(startScroll, endScroll, progress);

      await page.evaluate(
        ({ x, y, scroll }) => {
          window.scrollTo(0, scroll);
          if (window.__SET_CURSOR__) window.__SET_CURSOR__(x, y);
        },
        { x: curX, y: curY, scroll: curScroll }
      );

      await writeFrame();
    }
  }

  async function hold(seconds) {
    const frameCount = Math.max(1, Math.round(seconds * FPS));
    for (let i = 0; i < frameCount; i++) {
      await writeFrame();
    }
  }

  async function clickWithVisualFeedback(x, y, isFix = false) {
    await page.evaluate(
      ({ x, y, isFix }) => {
        if (window.__TRIGGER_RIPPLE__) window.__TRIGGER_RIPPLE__(x, y, isFix);
      },
      { x, y, isFix }
    );
    await hold(0.35);
  }

  async function showHud(type, title, subtitle) {
    await page.evaluate(
      ({ type, title, subtitle }) => {
        if (window.__SET_HUD__) window.__SET_HUD__(true, type, title, subtitle);
      },
      { type, title, subtitle }
    );
  }

  async function hideHud() {
    await page.evaluate(() => {
      if (window.__SET_HUD__) window.__SET_HUD__(false);
    });
  }

  let oldSiteScreenshot;
  let newSiteDesktopScreenshot;
  let newSiteMobileScreenshot;

  // ==========================================================================
  // 🎬 ACT 1: THE LOCALIZED GOOGLE AUDIT (0:00 – 0:15) [15 Seconds]
  // ==========================================================================
  console.log(`\n📍 ACT 1: Rendering Localized Mahé Google Maps Audit (15s)...`);
  const googleHtml = getLocalizedGoogleHtml(BUSINESS_NAME, RATING, REVIEWS_COUNT, LOCATION, TRADE, PHONE);
  await page.setContent(googleHtml);
  await page.waitForTimeout(2000); // Allow Leaflet tiles to render cleanly
  await page.evaluate(OVERLAY_INJECT_SCRIPT);

  // Capture high-res screenshot for comparison postcard
  oldSiteScreenshot = await page.screenshot({ type: 'png' });

  // 0:00 - 0:05: Slow pan across Google rating & review count
  await page.evaluate(() => window.__SET_CURSOR__(200, 290));
  await showHud('leak', 'HIGH-REPUTATION GOOGLE PROFILE', `${REVIEWS_COUNT} Verified 5-Star Reviews with 0 Dedicated Web Presence`);
  await hold(4.5);

  // 0:05 - 0:12: Cursor smoothly curves toward the missing website button
  console.log(`👉 Targeting Missing Website Action Slot...`);
  await animateMotion({
    startX: 200, startY: 290,
    endX: 350, endY: 375,
    startScroll: 0, endScroll: 0,
    durationSec: 3.5
  });
  await hold(1.0);

  // 0:12 - 0:15: Double click with crimson warning ripple effect
  await clickWithVisualFeedback(350, 375, false);
  await hold(0.4);
  await clickWithVisualFeedback(350, 375, false);
  await showHud('leak', 'CONVERSION LEAK', 'Searchers looking for menus, prices & reservations bounce to competitors');
  await hold(3.5);
  await hideHud();
  await hold(0.6);

  // ==========================================================================
  // 🎬 ACT 2: DESKTOP PLATFORM UNVEILING & REAL DOM INTERACTIONS (0:15 – 0:38) [23s]
  // ==========================================================================
  console.log(`\n✨ ACT 2: Loading Modern Desktop Platform (${NEW_URL}) (23s)...`);
  await page.goto(NEW_URL, { waitUntil: 'networkidle', timeout: 25000 });
  await page.evaluate(OVERLAY_INJECT_SCRIPT);
  await page.evaluate(() => window.scrollTo(0, 0));

  // Capture desktop screenshot for postcard
  newSiteDesktopScreenshot = await page.screenshot({ type: 'png' });

  // 0:15 - 0:20: Cinematic scroll down the hero section
  await page.evaluate(() => window.__SET_CURSOR__(720, 320));
  await showHud('fix', 'HIGH-CONVERSION REVENUE ENGINE', 'Custom platform engineered around authentic 5-star reputation');
  await animateMotion({
    startX: 720, startY: 320,
    endX: 720, endY: 420,
    startScroll: 0, endScroll: 350,
    durationSec: 4.0
  });
  await hold(1.0);

  // 0:20 - 0:28: Cursor moves to the phone header & triggers live call dialer toast
  console.log(`📞 Interacting with Phone Dialer Link...`);
  const telBtn = page.locator('a[href^="tel:"], #tel-btn').first();
  const telBox = await telBtn.boundingBox() || { x: 1080, y: 35, width: 120, height: 30 };
  const telTargetX = telBox.x + telBox.width / 2;
  const telTargetY = telBox.y + telBox.height / 2;

  await animateMotion({
    startX: 720, startY: 420,
    endX: telTargetX, endY: telTargetY,
    startScroll: 350, endScroll: 0,
    durationSec: 2.5
  });

  // Click phone link -> trigger visible call toast
  await clickWithVisualFeedback(telTargetX, telTargetY, true);
  await page.evaluate((phoneNum) => {
    if (window.__SHOW_CALL_TOAST__) {
      window.__SHOW_CALL_TOAST__(`📞 Connecting to Perry's Grillz: ${phoneNum} ... Direct Call Initiated`, 3200);
    }
  }, PHONE);
  await showHud('fix', '1-TAP INSTANT DIALER', 'Direct phone integration for tourists and local diners');
  await hold(4.0);

  // 0:28 - 0:38: Cursor scrolls to Featured Dishes & clicks "BOOK A TABLE"
  console.log(`📅 Triggering Live Reservation Modal...`);
  await showHud('fix', '24/7 RESERVATION DRAWER', 'Captures table bookings automatically after hours');

  // Scroll down toward Featured Dishes
  await animateMotion({
    startX: telTargetX, startY: telTargetY,
    endX: 720, endY: 500,
    startScroll: 0, endScroll: 650,
    durationSec: 2.5
  });

  // Target the BOOK A TABLE button in navbar or hero
  const bookBtn = page.locator('button:has-text("BOOK A TABLE"), button:has-text("RESERVE A TABLE")').first();
  const bookBox = await bookBtn.boundingBox() || { x: 1240, y: 35, width: 130, height: 40 };
  const bookTargetX = bookBox.x + bookBox.width / 2;
  const bookTargetY = bookBox.y + bookBox.height / 2;

  await animateMotion({
    startX: 720, startY: 500,
    endX: bookTargetX, endY: bookTargetY,
    startScroll: 650, endScroll: 0,
    durationSec: 2.0
  });

  // Physically click the button in Playwright to trigger React modal state!
  await clickWithVisualFeedback(bookTargetX, bookTargetY, true);
  await bookBtn.click();
  await page.waitForTimeout(400); // Allow modal animation to pop
  await page.evaluate(OVERLAY_INJECT_SCRIPT); // Re-ensure overlay on top

  // Cursor moves inside the opened modal
  console.log(`👉 Navigating inside Reservation Modal...`);
  await animateMotion({
    startX: bookTargetX, startY: bookTargetY,
    endX: 520, endY: 420,
    startScroll: 0, endScroll: 0,
    durationSec: 1.5
  });
  await clickWithVisualFeedback(520, 420, true);
  await hold(3.0);

  // Close modal to prepare for mobile phase
  const closeBtn = page.locator('button[aria-label="Close modal"], button:has-text("✕")').first();
  try {
    if (await closeBtn.isVisible({ timeout: 2000 })) {
      const cBox = await closeBtn.boundingBox();
      if (cBox) {
        await animateMotion({
          startX: 520, startY: 420,
          endX: cBox.x + cBox.width / 2, endY: cBox.y + cBox.height / 2,
          startScroll: 0, endScroll: 0,
          durationSec: 1.0
        });
        await clickWithVisualFeedback(cBox.x + cBox.width / 2, cBox.y + cBox.height / 2, true);
        await closeBtn.click({ force: true });
        await hold(0.5);
      }
    } else {
      await page.keyboard.press('Escape');
      await hold(0.5);
    }
  } catch (e) {
    await page.keyboard.press('Escape');
    await hold(0.5);
  }

  await hideHud();
  await hold(0.5);

  // ==========================================================================
  // 🎬 ACT 3: MOBILE VIEWPORT & STICKY CONVERSION (0:38 – 0:50) [12 Seconds]
  // ==========================================================================
  console.log(`\n📱 ACT 3: Switching to Mobile Viewport (iPhone 15 Pro - 390x844) (12s)...`);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(NEW_URL, { waitUntil: 'networkidle' });
  await page.evaluate(OVERLAY_INJECT_SCRIPT);
  await page.evaluate(() => window.scrollTo(0, 0));

  // Capture mobile screenshot for postcard
  newSiteMobileScreenshot = await page.screenshot({ type: 'png' });

  // 0:38 - 0:42: Hero on mobile
  await page.evaluate(() => window.__SET_CURSOR__(195, 360));
  await showHud('fix', 'MOBILE-FIRST ARCHITECTURE', 'Optimized for 80%+ of island tourists searching on phones');
  await hold(2.5);

  // 0:42 - 0:50: Scroll down mobile page & highlight persistent sticky call/book bar
  console.log(`👉 Interacting with Persistent Sticky Bottom Bar...`);
  await animateMotion({
    startX: 195, startY: 360,
    endX: 195, endY: 520,
    startScroll: 0, endScroll: 550,
    durationSec: 2.5
  });

  // Tap the visible sticky Book Table button at the bottom
  const stickyBookBtn = page.locator('div.fixed.bottom-0 button, button:visible:has-text("Book Table"), button:visible:has-text("BOOK")').first();
  const stickyBox = await stickyBookBtn.boundingBox() || { x: 280, y: 790, width: 160, height: 45 };
  const stickyTargetX = stickyBox.x + stickyBox.width / 2;
  const stickyTargetY = stickyBox.y + stickyBox.height / 2;

  await animateMotion({
    startX: 195, startY: 520,
    endX: stickyTargetX, endY: stickyTargetY,
    startScroll: 550, endScroll: 550,
    durationSec: 1.5
  });

  await clickWithVisualFeedback(stickyTargetX, stickyTargetY, true);
  try {
    if (await stickyBookBtn.isVisible({ timeout: 2000 })) {
      await stickyBookBtn.click({ force: true });
    }
  } catch (err) {
    // Fallback
  }
  await page.waitForTimeout(400);
  await page.evaluate(OVERLAY_INJECT_SCRIPT);

  await showHud('fix', '1-TAP CONVERSION ON TOUCH SCREENS', 'Zero friction for diners on the go');
  await hold(3.5);

  try {
    const mobileClose = page.locator('button[aria-label="Close modal"]:visible').first();
    if (await mobileClose.isVisible({ timeout: 1500 })) {
      await mobileClose.click({ force: true });
    } else {
      await page.keyboard.press('Escape');
    }
  } catch (e) {
    await page.keyboard.press('Escape');
  }

  await hideHud();
  await hold(0.5);

  // ==========================================================================
  // 🎬 ACT 4: OUTRO FINALE & DUAL-DEVICE REVENUE PROOF (0:50 – 0:58) [8 Seconds]
  // ==========================================================================
  console.log(`\n🏆 ACT 4: Rendering Grand Finale & Dual-Device Showcase (8s)...`);
  await page.setViewportSize({ width: 1440, height: 900 });

  const desktopBase64 = newSiteDesktopScreenshot.toString('base64');
  const mobileBase64 = newSiteMobileScreenshot.toString('base64');

  const finaleHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1440px;
          height: 900px;
          background: radial-gradient(circle at center, #0f2b23 0%, #061914 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
          position: relative;
        }
        .glow {
          position: absolute;
          width: 650px;
          height: 400px;
          background: rgba(16, 185, 129, 0.15);
          filter: blur(120px);
          border-radius: 50%;
        }
        .header-tag {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #34d399;
          margin-bottom: 8px;
          z-index: 10;
        }
        .main-headline {
          font-size: 38px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 28px;
          z-index: 10;
          text-align: center;
        }
        .devices-wrap {
          display: flex;
          align-items: flex-end;
          gap: 24px;
          z-index: 10;
        }
        .desktop-frame {
          width: 780px;
          height: 480px;
          border-radius: 16px;
          box-shadow: 0 25px 70px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.12);
          overflow: hidden;
          background: #000;
        }
        .desktop-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
        }
        .mobile-frame {
          width: 220px;
          height: 460px;
          border-radius: 28px;
          box-shadow: 0 25px 70px rgba(0,0,0,0.8), 0 0 0 4px #1f2937, 0 0 0 5px rgba(255,255,255,0.2);
          overflow: hidden;
          background: #000;
        }
        .mobile-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
        }
      </style>
    </head>
    <body>
      <div class="glow"></div>
      <div class="header-tag">LAUNCH READY // 24/7 REVENUE ENGINE</div>
      <div class="main-headline">Turn Google Search Traffic Into Daily Booked Covers</div>
      <div class="devices-wrap">
        <div class="desktop-frame">
          <img src="data:image/png;base64,${desktopBase64}" />
        </div>
        <div class="mobile-frame">
          <img src="data:image/png;base64,${mobileBase64}" />
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(finaleHtml);
  await page.evaluate(OVERLAY_INJECT_SCRIPT);
  await page.evaluate(() => window.__SET_CURSOR__(720, 450));
  await showHud('fix', 'REVENUE ENGINE ACTIVE', 'Turn Google search traffic into daily booked covers');
  await hold(7.0);

  await hideHud();
  await hold(0.8);

  // Close FFmpeg Pipe
  ffmpeg.stdin.end();
  await new Promise((resolve) => ffmpeg.on('close', resolve));
  console.log(`\n🎉 Full Walkthrough Video Compiled Successfully: ${outputVideo}`);

  // ==========================================================================
  // 🖼️ GENERATE HIGH-RES 2880x900 SIDE-BY-SIDE STILL (POSTCARD READY)
  // ==========================================================================
  console.log(`🖼️ Creating High-Res Side-by-Side Comparison Postcard (2880x900)...`);
  const comparisonPage = await context.newPage();
  await comparisonPage.setViewportSize({ width: 2880, height: 900 });

  const oldBase64 = oldSiteScreenshot.toString('base64');
  const newBase64 = newSiteDesktopScreenshot.toString('base64');

  const comparisonHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 2880px;
          height: 900px;
          background: #09090b;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          color: white;
          overflow: hidden;
        }
        .half {
          width: 1440px;
          height: 900px;
          position: relative;
          overflow: hidden;
        }
        .half img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
        }
        .label {
          position: absolute;
          top: 32px;
          left: 32px;
          padding: 12px 26px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          backdrop-filter: blur(18px);
          box-shadow: 0 10px 35px rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 50;
        }
        .label.old {
          background: rgba(239, 68, 68, 0.28);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.5);
        }
        .label.new {
          background: rgba(16, 185, 129, 0.28);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.5);
        }
        .divider {
          width: 4px;
          height: 900px;
          background: linear-gradient(to bottom, #ef4444, #3b82f6, #10b981);
          z-index: 100;
        }
      </style>
    </head>
    <body>
      <div class="half">
        <div class="label old">❌ GOOGLE PROFILE // NO DEDICATED SITE</div>
        <img src="data:image/png;base64,${oldBase64}" />
      </div>
      <div class="divider"></div>
      <div class="half">
        <div class="label new">✅ DEDICATED PLATFORM // 24/7 REVENUE ENGINE</div>
        <img src="data:image/png;base64,${newBase64}" />
      </div>
    </body>
    </html>
  `;

  await comparisonPage.setContent(comparisonHtml);
  await comparisonPage.screenshot({ path: outputStill });
  console.log(`✅ Side-by-Side Comparison Postcard Saved: ${outputStill}`);

  await browser.close();

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n======================================================`);
  console.log(`🏆 ALL DELIVERABLES GENERATED IN ${totalDuration}s`);
  console.log(`🎞️ Total Video Frames: ${totalFramesWritten} (~${(totalFramesWritten / FPS).toFixed(1)}s runtime)`);
  console.log(`🎥 Walkthrough Video:   ${outputVideo}`);
  console.log(`🖼️ Pitch Postcard:     ${outputStill}`);
  console.log(`======================================================\n`);
}

renderWalkthrough().catch((err) => {
  console.error(`❌ Recording failed:`, err);
  process.exit(1);
});
