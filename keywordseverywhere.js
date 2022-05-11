const axios = require("axios")
const qs = require("qs")

const access_token = "0eb9980e63b03953a1e6"

const getKwData = (keywords) => {
	return new Promise((resolve, reject) => {
		let payload = {
			dataSource: "gkp",
			currency: "USD",
			kw: keywords,
			// country: "us",
			// kw: ["keywords tool", "keyword planner"],
		}
		axios
			.post("https://api.keywordseverywhere.com/v1/get_keyword_data", qs.stringify(payload), {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${access_token}`,
				},
			})
			.then((response) => response.data)
			.then(resolve)
			.catch(reject)
	})
}

exports.getKwData = getKwData
