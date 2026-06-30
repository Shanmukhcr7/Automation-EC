import { chromium } from 'playwright';
import * as fs from 'fs-extra';
import Tesseract from 'tesseract.js';

async function researchLogin() {
  const browser = await chromium.launch({ headless: true, slowMo: 100 });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  console.log('Navigating to EC Page (Login Wall)...');
  await page.goto('https://registration.telangana.gov.in/EncumbranceSearch.htm', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  console.log('Filling provided credentials...');
  // 2 = Citizen
  await page.selectOption('#user_type', '2').catch(() => console.log('Could not find user_type select'));
  await page.fill('#username', '7801035193').catch(() => console.log('Could not find username'));
  await page.fill('#password', 'Shanmukh@123').catch(() => console.log('Could not find password'));
  
  console.log('Extracting CAPTCHA...');
  // Find the captcha image
  const captchaElement = page.locator('#frame1'); // Based on previous HTML
  if (await captchaElement.count() > 0) {
    const captchaBuffer = await captchaElement.screenshot();
    console.log('Running OCR on CAPTCHA...');
    const { data: { text } } = await Tesseract.recognize(captchaBuffer, 'eng');
    const captchaText = text.replace(/[^a-zA-Z0-9]/g, '').trim(); // Clean up OCR result
    console.log(`OCR Extracted CAPTCHA: "${captchaText}"`);
    
    await page.fill('#captcha', captchaText).catch(() => console.log('Could not fill captcha'));
  } else {
    console.log('CAPTCHA element not found.');
  }
  
  console.log('Submitting login form...');
  await page.click('button[type="submit"], input[type="submit"], #submit').catch(() => console.log('Could not click submit'));
  
  console.log('Waiting for navigation...');
  // Wait for page load or network idle
  await page.waitForTimeout(5000);

  // Now we should be logged in. Let's dump the HTML.
  const loggedInHtml = await page.content();
  fs.writeFileSync('logged_in_page.html', loggedInHtml);
  console.log('Saved logged_in_page.html');
  
  console.log(`Current URL after login: ${page.url()}`);
  
  // If we are not on the EC Search form, try to navigate there
  if (!page.url().includes('EncumbranceSearch')) {
      console.log('Attempting to navigate to EC Search again...');
      await page.goto('https://registration.telangana.gov.in/EncumbranceSearch.htm', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
  }
  
  const ecSearchHtml = await page.content();
  fs.writeFileSync('ec_search_form.html', ecSearchHtml);
  console.log('Saved ec_search_form.html');

  await browser.close();
}

researchLogin().catch(console.error);
