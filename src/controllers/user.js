const User = require("../models/user")
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const ErrorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken")


exports.signup = async (req, res, next) => {

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(new ErrorHandler("User already exists", 400));
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            ...req.body, password: hash, username: shortid.generate(),
        });

        await newUser.save();
        sendToken(newUser, 200, res);

    } catch (err) {
        res.status(400).send(err)
    }
};


exports.signin = async (req, res, next) => {
    try {
        const { password, email } = req.body;


        if (!email || !password) {
            return next(new ErrorHandler("Please Enter Email & Password", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) return next(new ErrorHandler("Password does not match", 400));
        sendToken(user, 200, res);

    } catch (err) {
        return res.send(err)
    }

}

// LOGOUT
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("access_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

//get user detail

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (user) {
        res.status(200).send(user);
    }
    else {
        res.status(400).send({
            message: 'user not found'
        })
    }
});