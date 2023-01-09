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
const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	debug && log(flags);


	if (input.includes('register')){
		let users_list = [];
			const re = await axios.post('http://localhost:5000/users/register')
			//const users = await User.find({});
			console.log(re)

	}
})();
