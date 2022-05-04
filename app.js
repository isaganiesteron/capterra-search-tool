const fs = require("fs")
const { getPageBody } = require("./scraper")
const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")

const app = express()
app.engine("html", require("ejs").renderFile)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const getCapterraCategoryNames = () => {
	let catHtml = require("./categories").html
	let dataAliasArr = catHtml.split('<li data-alias-name="')
	dataAliasArr.shift()
	let onlyHref = dataAliasArr.map((x) => x.split('<a href="/')[1].split('/"')[0])
	fs.writeFile("capterra-category-names.json", JSON.stringify({ categorynames: onlyHref }), () => console.log("DONE"))
}

const hasAffiliateProgram = (website) => {
	return new Promise((resolve, reject) => {
		console.log("hasAffiliateProgram: " + website)
		let searchKeywords = ["affiliate", "ambassador"]
		getPageBody(website)
			.then((res) => {
				let bodyText = JSON.stringify(res).toLowerCase()
				let result = searchKeywords.filter((kw) => {
					return bodyText.indexOf(kw) > -1
				})
				resolve(result.length > 0)
			})
			.catch((err) => {
				console.log(err)
				reject(err)
			})
	})
}

const hasSerpAds = (keyword) => {
	return new Promise((resolve, reject) => {
		let googleSearch = `https://www.google.com/search?q=${encodeURI(keyword)}&cr=countryUS`
		console.log("hasSerpAds: " + googleSearch)
		getPageBody(googleSearch)
			.then((res) => {
				let bodyText = JSON.stringify(res).toLowerCase()
				resolve(bodyText.indexOf("About this ad") > -1)
			})
			.catch((err) => {
				console.log(err)
				reject(err)
			})
	})
}

const isValidUrl = (url) => {
	try {
		new URL(url)
	} catch (e) {
		console.error(e)
		return false
	}
	return true
}

app.post("/hasAffiliateProgram", (req, res) => {
	let { site } = req.body

	if (!isValidUrl(site)) return res.send({ result: "Invalid URL => " + site })
	try {
		hasAffiliateProgram(site)
			.then((result) => {
				console.log("hasAffiliateProgram SUCCESS: " + result)
				res.send({ result: result })
			})
			.catch((err) => {
				console.log("hasAffiliateProgram ERR: " + err.message)
				res.send({ result: err.message })
			})
	} catch (err) {
		res.send({ result: err.message })
	}
})

app.get("/", async (req, res) => {
	res.render(path.join(__dirname, "/index.html"), { data: {} })
})

const port = 8989
app.listen(port, () => {
	console.log(` ---- Capterra Tool http://localhost:${port}/ ${new Date()}  ---- `)
})
