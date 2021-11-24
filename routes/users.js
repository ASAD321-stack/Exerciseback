const express = require('express')
// const app= express();
// const cookieParser = require('cookie-parser');
// app.use(express.json());
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');

// require('../index.js');
const User = require('../models/user.model');
// const Driver = require('../models/userSchemaRide');
// const bcrypt = require('bcrypt');
// const dotenv = require('dotenv');
// dotenv.config({path:'../config.env'});
// app.use(cookieParser());
// const authentication = require('../middleware/authenticate');
// const bodyParser = require('body-parser');
// app.use(express.urlencoded({extended:true}));


router.post('/register', async (req, res) => {
    const { username, email, password, cpassword } = req.body;
    if (!username || !email || !password || !cpassword) {
        return res.status(422).json({ error: "plz filled the field" });
    }
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "Email is Already is Registed" });
        }
        else if (password != cpassword) {
            return res.status(422).json({ error: "password are not matching" });
        }
        else {
            const user = new User({ username, email, password, cpassword });


            await user.save();
            res.status(201).json({ message: "user registed successfully" });

        }

    } catch (err) {
        console.log(err);
    }
});

// login 
router.post('/login', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "please filled the field" });
        }
        const userLogin = await User.findOne({ email: email });

        //    if(!userLogin){
        //        res.json({error : "user error"})
        //    } else{
        //        res.json({message: "done successfully"})
        //    }


        if (userLogin) {

            const isMatch = await bcrypt.compare(password, userLogin.password);
             token = await userLogin.generateAuthToken();
             console.log("the token part "+token);

             res.cookie('jwt',token,{
               expires:new Date(Date .now()+300000000),
               httpOnly:true
             });

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credientials " });
            } else {
                res.status(201).json({ message: "User Login Successfully" });
            }
        }
        else {
            res.status(422).json({ error: "Invalid Credientials " });
        }

    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;