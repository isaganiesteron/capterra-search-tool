const puppeteer = require("puppeteer-extra")
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
puppeteer.use(StealthPlugin())

// puppeteer usage as normal
puppeteer.launch({ headless: true }).then(async (browser) => {
	console.log("Running tests..")
	const page = await browser.newPage()
	await page.goto("https://www.capterra.com/directoryPage/rest/v1/category?htmlName=wireframe-software&rbr=false&countryCode=PH")
	await page.waitForTimeout(5000)
	// await page.screenshot({ path: "testresult.png", fullPage: true })

	await page.waitForSelector("body")
	const pageBody = await page.evaluate(() => document.querySelector("body").textContent)
	console.log("BODY")
	console.log(pageBody)

	await browser.close()
	console.log(`All done, check the screenshot. ✨`)
})
