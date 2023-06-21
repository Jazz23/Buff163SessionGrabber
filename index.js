const puppeteer = require('puppeteer');

async function tryGetSessionCookie(page) {
  const start = Date.now();
  while (true) {
    const cookies = await page.cookies();
    if (cookies.length === 3) {
      return cookies[1].value;
    }

    if (Date.now() - start > 5000) {
      throw new Error('timeout');
    }
  }
}

async function main() {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  // get username/pass from commandline args
  const username = process.argv[2];
  const password = process.argv[3];
  await page.goto('https://store.steampowered.com/login/?redir=&redir_ssl=1&snr=1_4_4__global-header');
  // wait for page to load
  await page.waitForSelector('#responsive_page_template_content > div > div:nth-child(1) > div > div > div > div.newlogindialog_FormContainer_3jLIH > div > form > div:nth-child(1) > input');
  // type in username
  await page.type('#responsive_page_template_content > div > div:nth-child(1) > div > div > div > div.newlogindialog_FormContainer_3jLIH > div > form > div:nth-child(1) > input', username);
  await page.type('#responsive_page_template_content > div > div:nth-child(1) > div > div > div > div.newlogindialog_FormContainer_3jLIH > div > form > div:nth-child(2) > input', password);
  await page.click('#responsive_page_template_content > div > div:nth-child(1) > div > div > div > div.newlogindialog_FormContainer_3jLIH > div > form > div.newlogindialog_SignInButtonContainer_14fsn > button');
  await page.waitForSelector('#account_pulldown');

  // Go to buff steam login page and login
  await page.goto('https://steamcommunity.com/openid/login?openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.realm=https%3A%2F%2Fbuff.163.com%2F&openid.sreg.required=nickname%2Cemail%2Cfullname&openid.assoc_handle=None&openid.return_to=https%3A%2F%2Fbuff.163.com%2Faccount%2Flogin%2Fsteam%2Fverification%3Fback_url%3D%252Faccount%252Fsteam_bind%252Ffinish&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select');
  await page.waitForSelector('#imageLogin');
  await page.click('#imageLogin');

  try {
    console.log(await tryGetSessionCookie(page));
  }
  catch {
    console.log('error');
  }
  await browser.close();
}

main();