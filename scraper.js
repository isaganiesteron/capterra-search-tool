const puppeteer = require("puppeteer-extra")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
puppeteer.use(StealthPlugin())

const getPageBody = (url) => {
	return new Promise((resolve, reject) => {
		puppeteer.launch({ headless: true, ignoreHTTPSErrors: true }).then(async (browser) => {
			try {
				const page = await browser.newPage()
				await page.goto(url)
				await page.waitForTimeout(5000)
				await page.waitForSelector("body")
				const bodyValue = await page.evaluate(() => document.querySelector("body").textContent)
				await browser.close()
				if (bodyValue) resolve(bodyValue)
				else reject("Failed to Fetch Body")
			} catch (err) {
				console.log("CATCH: " + err.message)
				reject(err)
			}
		})
	})
}

exports.getPageBody = getPageBody
