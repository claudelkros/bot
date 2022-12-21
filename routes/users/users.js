const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const request = require('request');
const querystring = require('querystring');
const axios = require('axios');
dotenv.config();
//const auth = require("../../middlewares/auth");
const User = require("../../models/Users");
const Station = require("../../models/Stations");
const { findById } = require("../../models/Users");


router.get("/", async (req, res, next) => {
	try {
		const users = await User.find({});
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
});

//Insert new phone number into the Database
router.post("/seeds", async (req, res, next) => {
	const { number } = req.body;
	// First Validate The Request
	//const { errors } = await Schema.validateAsync(req.body);
	if (!number) {
		return res.status(422).json({ error: "please add all the fields" });
	}

	try {
		// Check if this user already exisits
		const user = await User.findOne({ number: req.body.number });
		if (!user) {
			//Insert the new user
			const newUser = new User({
				number,
			});
			const user = await newUser.save();

			//return json
			res.status(200).json({
				user,
			});
		} else {
			//Insert the new user
			return res.status(400).json({ message: "Username already use " });
		}
	} catch (error) {
		next(error);
	}
});
router.post("/logsession", async (req, res, next) => {
	// connect to DB
	let users_list = []
	try {
		const users = await User.find({});
		// push the contact list into a array of 10
		users.map(val => users_list.push(val.number))
	} catch (error) {
		next(error);
	}
	console.log(users_list)

	// select array[0] and define array[0] as sender
	// run a loop with array[1] and use it as receiver
	const n = 2; // number of elements we want to get
	const shuffledArray = users_list.sort(() => 0.5 - Math.random()); // shuffles array
	const result = shuffledArray.slice(0, n); // gets first n elements after shuffle

	const sender = result[0]
	const receiver = result[1]

	console.log(result);
 	params_changing = ["00", "1", "671118536", "5"]

 	const link = 'https://test.ussd.bafoka.network/';
	const counter = 0000000000000000013;
	let params = {
		"ussd_code": "066",
		"msisdn": "237690996669",
		"session_id": (counter).toString(), //define how to change the session_id according to the error_code
		"ussd_response": ""
	}
	const sess = await axios.post(link, params)
	.then( response => response.data)
	.catch( response => {
		//console.log('Error', response);
	})
	const array1 = ['1', '671118536', '1', '5', '0000', '00'];

	for (const element of array1) {
		params.ussd_response = element
		const sess = await axios.post(link, params)
		console.log(sess.data)
	}

});

router.delete("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const users = await User.findOne({
			_id: id,
		});

		if (!users) {
			res.json({ message: "Users don't exit " });
		} else {
			await User.deleteOne({ _id: id });
			res.json({ message: "Delete Sucessful" });
		}
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const users = await User.findOne({
			_id: id,
		});

		if (!users) {
			res.json({ message: "Users don't exit " });
		} else {
			//await Files.deleteOne({ _id: id });
			res.json(users);
		}
	} catch (error) {
		next(error);
	}
});

router.put("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const { firstName, lastName } = req.body;
		const oldUser = await User.findOne({
			_id: id,
		});

		if (!oldUser)
			return res.status(401).json({ message: "invalid credentials" });
		const Newuser = await User.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					firstName,
					lastName,
				},
			}
		);
		res.status(200).json({ message: "Update successfuly" });
	} catch (error) {
		next(error);
	}
});



router.post("/validtoken", async (req, res) => {
	try {
		const token = req.header("Authorization");
		console.log(`valid ${token}`);

		if (!token) return res.status(400).json("Token absent");

		const verified = jwt.verify(token, process.env.JWT_SECRET);

		if (!verified) return res.status(400).json("Token not verified");
		const user = await User.findById(verified.id);

		const station = await Station.find({ userId: user.id });

		if (!user)
			return res.status(400).json("Token not valid for this user anymore");
		return res.json({
			user: user,
			token: token,
			stations: station,
		});
	} catch (error) {
		return error;
	}
});

router.put("/subscription/:id/:name", async (req, res, next) => {
	const { id, name } = req.params;
	try {
		if (name == "premium") {
			const user = await User.findOne({ _id: id });
			if (!user)
				return res.status(401).json({ message: "invalid credentials" });
			const newUser = await User.updateOne(
				{
					_id: id,
				},
				{
					$set: {
						roles: "premium",
					},
				}
			);
			res.status(200).json({ message: "Update successfuly" });
		} else if (name == "owner") {
			const user = await User.findOne({ _id: id });
			if (!user)
				return res.status(401).json({ message: "invalid credentials" });
			const newUser = await User.updateOne(
				{
					_id: id,
				},
				{
					$set: {
						roles: "owner",
					},
				}
			);
			res.status(200).json({ message: "Update successfuly" });
		} else {
			res.json({ message: "Information incorrect" });
		}
	} catch (error) {
		next(error);
	}
});

router.post("/follow/", async (req, res, next) => {
	const { id, idStation } = req.body;
	if (!id && !idStation) {
		res.json({ message: "Informations incorrectes" });
	}
	try {
		const user = await User.findOne({ _id: id });
		if (!user) {
			res.json({ message: "Cet utilisateurs n'existe pas" });
		} else {
			const newStation = await User.updateOne(
				{
					_id: id,
				},
				{
					$addToSet: {
						stationSuivie: req.body.idStation,
					},
				}
			);
			res.status(200).json({ message: "Mise a jour effectuée" });
		}
	} catch (error) {
		next(error);
	}
});

router.post("/unfollow/", async (req, res, next) => {
	const { id, idStation } = req.body;
	if (!id && !idStation) {
		res.json({ message: "Informations incorrectes" });
	}
	try {
		const user = await User.findOne({ _id: id });
		if (!user) {
			res.json({ message: "Cet utilisateurs n'existe pas" });
		} else {
			const newStation = await User.updateOne(
				{
					_id: id,
				},
				{
					$unset: {
						stationSuivie: req.body.idStation,
					},
				}
			);
			res.status(200).json({ message: "Vous ne suivez plus cette station" });
		}
	} catch (error) {
		next(error);
	}
});

module.exports = router;
