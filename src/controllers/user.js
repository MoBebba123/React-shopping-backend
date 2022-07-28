const User = require("../models/user")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

exports.signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.hash_password, salt);
        const newUser = new User({ ...req.body, hash_password: hash, username: shortid.generate(),
        });

        await newUser.save();
        const { hash_password, ...otherDetails } = newUser._doc;
        res.status(200).send(otherDetails);
    } catch (err) {
        res.status(400).send(err)
    }
};
