const jwt = require("jsonwebtoken");

const isTokenIncluded =(req) => {
   
    return (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    )

}

const getAccessTokenFromHeader = (req) => {

    const authorization = req.headers.authorization

    const access_token = authorization.split(" ")[1]

    return access_token
}

const sendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role, // only if user has role field
    },
    process.env.JWT_SECRET, // MUST be defined in .env
    {
      expiresIn: process.env.JWT_EXPIRE || "1d",
    }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

module.exports ={
    sendToken,
    isTokenIncluded,
    getAccessTokenFromHeader
}
