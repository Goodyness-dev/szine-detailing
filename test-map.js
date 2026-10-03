import { chromium } from 'playwright';

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map', { zoomControl: false }).setView([-4.717, 55.485], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);
        L.marker([-4.717, 55.485]).addTo(map).bindPopup('<b>Perry\\'s Grillz</b><br>Les Canelles, Mahé').openPopup();
      </script>
    </body>
    </html>
  `;
  
  await page.setContent(html);
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'C:/Users/DELL/Documents/service-biz-master-template/test-leaflet-mahe.png' });
  console.log('Leaflet screenshot saved successfully!');
  await browser.close();
}

test().catch(console.error);
