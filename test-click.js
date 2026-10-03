import { chromium } from 'playwright';

async function testClick() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://perrys-grillz.vercel.app/', { waitUntil: 'networkidle' });
  console.log('Page loaded');
  
  // Find BOOK A TABLE button
  const bookBtn = page.locator('button:has-text("BOOK A TABLE")').first();
  const box = await bookBtn.boundingBox();
  console.log('Book button box:', box);
  
  // Click it
  await bookBtn.click();
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: 'C:/Users/DELL/Documents/service-biz-master-template/test-booking-opened.png' });
  console.log('Screenshot of opened modal saved!');
  await browser.close();
}

testClick().catch(console.error);
