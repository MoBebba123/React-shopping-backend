const User = require("../models/user")
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const ErrorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary").v2

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
        await sendEmail({
            email: newUser.email,
            subject: "welcome",
            message: `thank you for registration ${newUser.fullname}`
        })

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
//get users Only admins
exports.getAllUsers = catchAsyncError(async (req, res, next) => {

    const users = await User.find({});
    if (users) {
        res.status(200).send(users);
    }
    else {
        res.status(400).send({
            message: 'no user found'
        })
    }
});

// Get single user (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});


// update User Role -- Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,

    });
});
// update User Profile
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (user.avatar.public_id !== '') {

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

    }
    const file = req.body.avatar

    if (file) {
        const myCloud = await cloudinary.v2.uploader.upload(file, {
            folder: "proimages",
        });
        if (user) {
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.email = req.body.email || user.email;
            user.avatar.public_id = myCloud?.public_id || user.avatar.public_id;
            user.avatar.url = myCloud?.secure_url || user.avatar.url;
        }
    } else {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
    }

    await user.save({
        validateBeforeSave: false
    })
    res.status(200).json({
        succuss: true,
        message: "user Updated succussfully",
        user
    })
});

exports.deleteProfilePicture = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user) {
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        user.avatar.url = "";
        const updatedUser = await user.save({
            validateBeforeSave: false
        });
        res.send({ message: 'profile Picture deleted successfully', user: updatedUser });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
});
// Delete User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);


    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404)
        );
    }
    if (user.role === "admin") {
        return next(
            new ErrorHandler('Can not delete admin Users', 401)
        );
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});

// update User password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await bcrypt.compare(req.body.oldPassword, user.password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }
    const salt = bcrypt.genSaltSync(10);

    user.password = bcrypt.hashSync(req.body.newPassword, salt);

    await user.save();

    sendToken(user, 200, res);
});
// delete own profile
exports.deleteMe = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (user) {
        await user.remove();
        res.status(301).json({
            success: true,
            message: 'user deleted'
        })
    } else {
        return next(new ErrorHandler("User not found", 404));

    }
});

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: ` Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  });
  
  // Reset Password
  exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });
  