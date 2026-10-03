import { chromium } from 'playwright';

async function testMobile() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  
  await page.goto('https://perrys-grillz.vercel.app/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/DELL/Documents/service-biz-master-template/test-mobile-hero.png' });
  
  // Scroll down to see sticky bar or content
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/DELL/Documents/service-biz-master-template/test-mobile-scroll.png' });
  
  // Test clicking book button on mobile
  const bookBtn = page.locator('button:has-text("Book"), button:has-text("BOOK A TABLE"), button:has-text("RESERVE")').first();
  if (await bookBtn.isVisible()) {
    await bookBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'C:/Users/DELL/Documents/service-biz-master-template/test-mobile-modal.png' });
  }
  
  console.log('Mobile tests completed successfully!');
  await browser.close();
}

testMobile().catch(console.error);
