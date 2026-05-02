const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Go to the login page
  await page.goto('http://localhost:5173/#/login');
  
  // Type email
  await page.type('input[type="email"]', 'admin@condor.dz');
  await page.type('input[type="password"]', 'admin');
  
  // Click login
  await page.click('button[type="submit"]');
  
  // Wait for dashboard to load
  await page.waitForSelector('h1', { timeout: 10000 });
  await page.waitForTimeout(2000); // Wait for animations
  
  // Find the massive element
  const info = await page.evaluate(() => {
    const tabNav = document.querySelector('div[class*="tabNav"]');
    const computed = window.getComputedStyle(tabNav);
    return {
      className: tabNav.className,
      height: computed.height,
      minHeight: computed.minHeight,
      padding: computed.padding,
      margin: computed.margin,
      display: computed.display,
      flex: computed.flex,
      parentHeight: window.getComputedStyle(tabNav.parentElement).height,
      parentDisplay: window.getComputedStyle(tabNav.parentElement).display,
    };
  });
  
  console.log(JSON.stringify(info, null, 2));
  
  await browser.close();
})();
