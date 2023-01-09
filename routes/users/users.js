const express = require("express");
const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const request = require("request");
const querystring = require("querystring");
const axios = require("axios");
dotenv.config();
//const auth = require("../../middlewares/auth");
const User = require("../../models/Users");
const preRegisterUser = require("../../models/preRegister");
const Register = require("../../models/Register");
const { findById } = require("../../models/Users");
const { setMaxIdleHTTPParsers } = require("http");

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
    const user = await preRegisterUser.findOne({ number: req.body.number });
    if (!user) {
      //Insert the new user
      const newUser = new preRegisterUser({
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

router.post("/send_vouchers", async (req, res, next) => {
  // connect to DB
  let users_list = [];
  try {
    const users = await User.find({});
    // push the contact list into a array of 10
    users.map((val) => users_list.push(val.number[0]));
  } catch (error) {
    next(error);
  }

  // select array[0] and define array[0] as sender
  // run a loop with array[1] and use it as receiver
  const result = users_list; // gets first n elements after shuffle

  console.log(result);

  const link = "https://test.ussd.bafoka.network/";
  const counter = 20353564646513;

  // Nested loop

  for (let i = 0; i < result.length; i++) {
    let sender = result[i];

    console.log("Sender " + sender);

    let params = {
      "ussd_code": "066",
      "msisdn": "237" + sender,
      "session_id": (counter + 1).toString(), //define how to change the session_id according to the error_code
      "ussd_response": "",
    };

    for (let j = 0; j < result.length; j++) {
      if (i == j) {
        j++;
      } else {
        let receiver = result[j];
        console.log("Receiver" + receiver);

        let array1 = ["", "1", receiver, "1", "5", "0000", "00"];
        //let array1 = ["00"];
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
});

router.post("/preRegistered", async (req, res, next) => {
  // connect to DB
  // 1. Get array of users from the body
  // 2. Loop through the array
  // 3. For i==0, create a user account
  // 4. Adding a flag status
  try {
    let users_list = [];
    const preRegister = await preRegisterUser.find({});
    preRegister.map((val) => users_list.push(val.number));

    //let creation_sequence = ["1", receiver, "1", "5", "0000", "00"];
    let creation_sequence_test = ["", "2", "1", "Ali", "1", "2", "1", "", "00"];
    const link = "https://test.ussd.bafoka.network/";
    const counter = 02988475614643213;
    for (let i = 0; i < users_list.length; i++) {
      let params = {
        "ussd_code": "066",
        "msisdn": "237" + users_list[i],
        "session_id": (counter + 1).toString(), //define how to change the session_id according to the error_code
        "ussd_response": "",
      };
			const delay = ms => new Promise(res => setTimeout(res, ms));

      for (const element of creation_sequence_test) {
        params.ussd_response = element;
        const sess = await axios.post(link, params);
        console.log(sess.data);
				await delay(6000)
				console.log("Waitting 3 minutes")
      }

      const newUser = new Register({
        number: users_list[i],
      });
      const user = await newUser.save();

      //return json
      res.status(200).json({
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/Register", async (req, res, next) => {
  //sleep(480); // to changer
  setTimeout(() => {
    Creation();
  }, 20);

  async function Creation() {
    let users_list = [];
    try {
      //connect to DB2
      const users = await Register.find({});
      // push the contact list into a array of 10
      users.map((val) => users_list.push(val.number[0]));
      //let creation_sequence = ["1", receiver, "1", "5", "0000", "00"];
      let creation_sequence_test = ["", "0000", "0000", ""];
      const link = "https://test.ussd.bafoka.network/";
      const counter = 02055367667664013;

      for (let i = 0; i < users_list.length; i++) {
        let params = {
          "ussd_code": "066",
          "msisdn": "237" + users_list[i],
          "session_id": (counter + 1).toString(), //define how to change the session_id according to the error_code
          "ussd_response": "",
        };
        for (const element of creation_sequence_test) {
          params.ussd_response = element;
          const sess = await axios.post(link, params);
          console.log(sess.data);
					res.status(200).json(sess.data);
        }
        const newUser = new User({
          number: users_list[i],
        });
        const user = await newUser.save();

        //return json
        res.status(200).json({
          user,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
});

module.exports = router;
