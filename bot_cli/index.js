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
		console.log('Sending Vouchers to users accounts ' +val[1])
		let res = contacts[0].slice(1)
		console.log(res)

		function generateRandomInteger(min, max) {
			return Math.floor(min + Math.random()*(max - min + 1))
		}

		const link = "https://test.ussd.bafoka.network/";
		// connecting to the Nexah API


		// connecting to the Nexah API
		for (i = 0; i < res.length; i++){
			let newUser = res[i];
			const counter = generateRandomInteger(20353565465648513, 20353654655646485135265487);
			let params = {
				"ussd_code": "066",
				"msisdn": "237" + newUser,
				"session_id": counter.toString(), //define how to change the session_id according to the error_code
				"ussd_response": "",
			};
			let array1 = ["", "2", "1", "Ali", "1", "2", "1"];
			//let array1 = ["99", "", "99"];
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

			//const users = await User.find({});

	}else if (input.includes('send')) {
		let contacts = [];
		contacts.push(val)
		console.log('creating users accounts ' + val)
		let result = contacts[0].slice(1)
		function generateRandomInteger(min, max) {
			return Math.floor(min + Math.random()*(max - min + 1))
		}

		const link = "https://test.ussd.bafoka.network/";
		// connecting to the Nexah API



		// Nested loop
		for (i = 0; i < result.length; i++){
			let sender = result[i];
			for (j = 0; j < result.length; j++){
				const counter = generateRandomInteger(20353564648513, 203535646485135265487);
				let params = {
					"ussd_code": "066",
					"msisdn": "237" + sender,
					"session_id": counter.toString(), //define how to change the session_id according to the error_code
					"ussd_response": "",
				};
				if ( result[i] != result[j]){
					let receiver = result[j];
					let array1 = ["", "1", receiver, "1", "5", "0000"];
					//let array1 = ["99", "", "99"];
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
	}else if(input.includes('validate')){
		let contacts = [];
		contacts.push(val)
		console.log('Validation users accounts by inserting the password' +val[1])
		let res = contacts[0].slice(1)
		console.log(res)

		function generateRandomInteger(min, max) {
			return Math.floor(min + Math.random()*(max - min + 1))
		}

		const link = "https://test.ussd.bafoka.network/";
		// connecting to the Nexah API


		// connecting to the Nexah API
		for (i = 0; i < res.length; i++){
			let validUser = res[i];
			const counter = generateRandomInteger(203535956465648513, 203433654655646485135265487);
			let params = {
				"ussd_code": "066",
				"msisdn": "237" + validUser,
				"session_id": counter.toString(), //define how to change the session_id according to the error_code
				"ussd_response": "",
			};
			let array1 = ["", "0000", "0000"];
			//let array1 = ["99", "", "99"];
			const delay = ms => new Promise(res => setTimeout(res, ms));
			try {
				delay(700)
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
})();
