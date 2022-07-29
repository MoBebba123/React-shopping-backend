const User = require("../models/user")
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const ErrorHandler = require("../utils/error");
const jwt = require("jsonwebtoken")



exports.signup = async (req, res, next) => {

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(new ErrorHandler("User already exists", 400));
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.hash_password, salt);
        const newUser = new User({
            ...req.body, password: hash, username: shortid.generate(),
        });

        await newUser.save();
        const { password, ...userDetails } = newUser._doc;
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);

        res
            .cookie("access_token", token, {
                expires: new Date(
                    Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
            })
            .status(201)
            .json({
                success: true,
                message:"profile created",
                user: userDetails
            });
    } catch (err) {
        res.status(400).send(err)
    }
};


exports.signin = async (req, res, next) => {
    try {
        var { password, email } = req.body;


        if (!email || password) {
            return next(new ErrorHandler("Please Enter Email & Password", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) return next(new ErrorHandler("Password does not match", 400));
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

        var { password, ...userDetails } = user._doc
        res
            .cookie("access_token", token, {
                httpOnly: true,
                expires: new Date(
                    Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
            })
            .status(200)
            .json({
                success: true,
                message:"logged in",
                user: userDetails
            });
    } catch (err) {
        return res.send(err)
    }

}