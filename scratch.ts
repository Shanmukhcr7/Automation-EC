import { chromium } from 'playwright';
import fs from 'fs';

async function research() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  console.log('Navigating to EC Page...');
  await page.goto('https://registration.telangana.gov.in/EncumbranceSearch.htm', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000); 

  const html = await page.content();
  fs.writeFileSync('ec_page.html', html);
  console.log('EC Page HTML saved to ec_page.html');

  await browser.close();
}

research().catch(console.error);
