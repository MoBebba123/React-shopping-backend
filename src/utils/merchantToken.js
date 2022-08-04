// Create Token and saving in cookie
const sendMerchantToken = (merchant, statusCode, res) => {
  const token = merchant.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  const { password, ...merchantsInfo } = merchant._doc;
  res.status(statusCode).cookie("merchant_token", token, options).json({
    success: true,
    merchant: merchantsInfo,
    token,
  });
};

module.exports = sendMerchantToken;
