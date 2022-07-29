const jwt = require("jsonwebtoken");
const ErrorHandler = require("./error.js");

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(ErrorHandler("You are not authenticated!",401));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(ErrorHandler("Token is not valid!",401));
    req.user = user;
    next()
  });
};
