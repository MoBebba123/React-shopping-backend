const User = require("../models/user")
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const ErrorHander = require("../utils/error");
const jwt = require("jsonwebtoken")



exports.signup = async (req, res, next) => {

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(new ErrorHander("User already exists", 400));
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.hash_password, salt);
        const newUser = new User({
            ...req.body, hash_password: hash, username: shortid.generate(),
        });

        await newUser.save();
        const { hash_password, ...otherDetails } = newUser._doc;
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

        res
            .cookie("access_token", token, {
                expires: new Date(
                    Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
            })
            .status(201)
            .json(otherDetails);
    } catch (err) {
        res.status(400).send(err)
    }
};
