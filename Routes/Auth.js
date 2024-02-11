const express = require("express")
const router = express.Router()
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
const { CustomerToken } = require("../Middlewares/CustomerAuth");

router.post("/create-order/upi", CustomerToken, async (req, res) => {

	const transaction_id = uuidv4();
	const jwt_payload = {
		"mercid": "UATINSPTV2",
		"orderid": transaction_id,
		"amount": Math.round(req.body.amount),
		"order_date": "2023-07-30T20:25:00+05:30",
		"currency": "356",
		"additional_info": {
			"additional_info1": `${req.customer._id}`,
		},
		"ru": "http://localhost:1000/authtest",
		"itemcode": "DIRECT",
		"device": {
			"init_channel": "internet",
			"ip": "192.168.0.104",
			"user_agent": req.body.user_agent,
			"accept_header": "text/html",
			"fingerprintid": "61b12c18b5d0cf901be34a23ca64bb19",
			"browser_tz": "-330",
			"browser_color_depth": "32",
			"browser_java_enabled": "false",
			"browser_screen_height": "601",
			"browser_screen_width": "657",
			"browser_language": "en-US",
			"browser_javascript_enabled": "true"
		}
	}
	const secretKey = '31MhbX6UsCr7io5GJltm7kXsbbnxs7KO';




	const header = {
		"alg": "HS256",
		"typ": "JWT",
		"clientid": "uatinsptv2"
	};

	const encodedHeader = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_');
	const encodedPayload = btoa(JSON.stringify(jwt_payload)).replace(/\+/g, '-').replace(/\//g, '_');

	const signingString = `${encodedHeader}.${encodedPayload}`;

	const signature = CryptoJS.HmacSHA256(signingString, secretKey).toString(CryptoJS.enc.Base64);
	const encodedSignature = signature.replace(/\+/g, '-').replace(/\//g, '_').replace("=", "");

	const jws = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;

	const headers = {
		"Content-Type": "application/jose",
		"bd-timestamp": Date.now(),
		"bd-traceid": transaction_id,
		"Accept": "application/jose"
	}
	var requestOptions = {
		method: 'POST',
		headers: headers,
		body: jws,
	};

	fetch("https://uat1.billdesk.com/u2/payments/ve1_2/orders/create", requestOptions)
		.then(response => response.text())
		.then(async (result) => {
			const data = await jwt.verify(result, secretKey)
			const transaction_payload = {
				"mercid": "UATINSPTV2",
				"orderid": transaction_id,
			}
			const encodedPayloadTransaction = btoa(JSON.stringify(transaction_payload)).replace(/\+/g, '-').replace(/\//g, '_');
			const signingString = `${encodedHeader}.${encodedPayloadTransaction}`;
			const signature = CryptoJS.HmacSHA256(signingString, secretKey).toString(CryptoJS.enc.Base64);
			const encodedSignature = signature.replace(/\+/g, '-').replace(/\//g, '_').replace("=", "");
			const jws = `${encodedHeader}.${encodedPayloadTransaction}.${encodedSignature}`;
			fetch("https://uat1.billdesk.com/u2/payments/ve1_2/transactions/get", {
				method: 'POST',
				headers: {
					"Content-Type": "application/jose",
					"bd-timestamp": Date.now(),
					"bd-traceid": transaction_id + transaction_id,
					"Accept": "application/jose",
					"Authorization": data?.links[1].headers.authorization,
					'bdOrderId': transaction_id
				},
				body: jws,
			})
				.then(response => response.text())
				.then((transaction_response) => {
					res.json({
						bdorderid: data.bdorderid,
						orderid: data.orderid,
						authorization: data?.links[1].headers.authorization,
						amount: data.amount,
						extra: transaction_response
					})
				})

			// res.json({
			// 	bdorderid: data.bdorderid,
			// 	orderid: data.orderid,
			// 	authorization: data?.links[1].headers.authorization,
			// 	amount: data.amount
			// })
		})
		.catch(error => console.log('error', error));

})

router.post("/topup-wallet", CustomerToken, async (req, res) => {
	// let device = {
	// 	"init_channel": "internet",
	// 	"ip": req.body.ip,
	// 	"user_agent": req.body.user_agent,
	// 	"accept_header": "text/html",
	// 	"fingerprintid": "61b12c18b5d0cf901be34a23ca64bb19",
	// 	"browser_tz": "-330",
	// 	"browser_color_depth": "32",
	// 	"browser_java_enabled": "false",
	// 	"browser_screen_height": "601",
	// 	"browser_screen_width": "657",
	// 	"browser_language": "en-US",
	// 	"browser_javascript_enabled": "true"
	// }
	const transaction_id = uuidv4();
	const jwt_payload = {
		"mercid": "UATINSPTV2",
		"orderid": transaction_id,
		"amount": req.body.amount,
		"order_date": "2023-07-30T20:25:00+05:30",
		"currency": "356",
		"additional_info": {
			"additional_info1": `${req.customer._id}`,
		},
		"ru": "https://instaport-backend-main.vercel.app/customer-transactions/wallet-topup",
		"itemcode": "DIRECT",
		"device": {
			"init_channel": "internet",
			"ip": "192.168.0.104",
			"user_agent": req.body.user_agent,
			"accept_header": "text/html",
			"fingerprintid": "61b12c18b5d0cf901be34a23ca64bb19",
			"browser_tz": "-330",
			"browser_color_depth": "32",
			"browser_java_enabled": "false",
			"browser_screen_height": "601",
			"browser_screen_width": "657",
			"browser_language": "en-US",
			"browser_javascript_enabled": "true"
		}
	}
	const secretKey = '31MhbX6UsCr7io5GJltm7kXsbbnxs7KO';

	const header = {
		"alg": "HS256",
		"typ": "JWT",
		"clientid": "uatinsptv2"
	};

	const encodedHeader = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_');
	const encodedPayload = btoa(JSON.stringify(jwt_payload)).replace(/\+/g, '-').replace(/\//g, '_');

	const signingString = `${encodedHeader}.${encodedPayload}`;

	const signature = CryptoJS.HmacSHA256(signingString, secretKey).toString(CryptoJS.enc.Base64);
	const encodedSignature = signature.replace(/\+/g, '-').replace(/\//g, '_').replace("=", "");

	const jws = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;

	const headers = {
		"Content-Type": "application/jose",
		"bd-timestamp": Date.now(),
		"bd-traceid": transaction_id,
		"Accept": "application/jose"
	}
	var requestOptions = {
		method: 'POST',
		headers: headers,
		body: jws,
	};

	fetch("https://uat1.billdesk.com/u2/payments/ve1_2/orders/create", requestOptions)
		.then(response => response.text())
		.then(async (result) => {
			const data = await jwt.verify(result, secretKey)
			res.json({
				bdorderid: data.bdorderid,
				orderid: data.orderid,
				authorization: data?.links[1].headers.authorization,
				amount: data.amount,
				extra: data
			})
		})
		.catch(error => console.log('error', error));

})

module.exports = router