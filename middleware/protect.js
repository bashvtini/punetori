const User = require("../model/user");
const jwt = require("jsonwebtoken");

// Protect Authorizied Routes
module.exports = async (req, res, next) => {
  try {
    let token;
    const auth = req.headers.authorization;

    if (auth && auth.startsWith("Bearer")) {
      token = auth.split(" ")[1];
    }

    if (!token) {
      return next({
        message: "Invalid Token",
        statusCode: 400,
      });
    }

    let decode;

    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return next({
        message: "Invalid Token",
        statusCode: 400,
      });
    }

    const user = await User.findById(decode.id);

    if (!user) {
      return next({
        message: "Invalid Token",
        statusCode: 400,
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
