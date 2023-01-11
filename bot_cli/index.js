#!/usr/bin/env node

/**
 * ussd-bot
 * Bots to test a USSD Service
 *
 * @author claudelkros <claudelkros.com>
 */
var express = require('express');
var router = express.Router()
const createUser = require('../routes/users/users')

// Models import
const User = require("../models/Users");
const preRegisterUser = require("../models/preRegister");
const Register = require("../models/Register");
const { findById } = require("../models/Users");

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const { default: axios } = require('axios');
const { use } = require('../routes/users/users');
const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	debug && log(flags);

	const val = process.argv.slice(2)

	if (input.includes('create')){
		// parsing command input into array
		let contacts = [];
		contacts.push(val)
		console.log('creating users accounts ' +val[1])
		let res = contacts[0].slice(1)
		console.log(res)

		// connecting to the Nexah API
		const url = 'https://test.ussd.bafoka.network/'
		axios.post(url, {
			"ussd_code": "066",
			"msisdn": "237690669909",
			"session_id": "0000000000010500061",
			"ussd_response": ""
		})
		.then(function (response) {
			console.log(response);
		})
		.catch(function (error) {
			console.log(error);
		});

			//const users = await User.find({});


	}else if (input.includes('send')) {
		let contacts = [];
		contacts.push(val)
		console.log('creating users accounts ' +val[1])
		let result = contacts[0].slice(1)
		console.log(result[0])
		function generateRandomInteger(min, max) {
			return Math.floor(min + Math.random()*(max - min + 1))
		}

		const link = "https://test.ussd.bafoka.network/";
		// connecting to the Nexah API



		// Nested loop
		for (i = 0; i < result.length; i++){
			let sender = result[i];

			const counter = generateRandomInteger(20353564648513, 203535646485135265487);
			console.log("Sender " + sender);
			console.log("session_id " + counter);

			let params = {
				"ussd_code": "066",
				"msisdn": "237" + sender,
				"session_id": counter.toString(), //define how to change the session_id according to the error_code
				"ussd_response": "",
			};
			for (j = 0; j < result.length; j++){
				if ( result[i] != result[j]){
					let receiver = result[j];
					console.log("Receiver" + receiver);

					let array1 = ["", "1", receiver, "1", "5", "0000"];
					//let array1 = ["99", "", "99"];
					console.log(params);
					try {
						for (const element of array1) {
							params.ussd_response = element;
							const sess = await axios.post(link, params);
							console.log(sess.data);
						}
					} catch (err) {
						console.log(err);
					}
				}
			}
		}
	}
})();
