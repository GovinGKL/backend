const Jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyToken = (req, res, next) => {
  // setting authToken to the headers.
  const authToken = req.headers.token;
  try {
    if (authToken) {
      // assigning auth Token
      const token = authToken.split(" ")[1];
      // if the token is found in the header then fisrt verifying it
      Jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        // throwing an error if the token is invalid
        if (err) {
          return res.status(403).json("Token invalid");
        }
        // ! if the token is valid assigning decoded token(user) to req.user coz here decoded data contains the payload information about the user which is the userId and email which is used to verify and check the authorization of the orginal user(owner) i,e req.user containing the info of the user should match the req.params.id => which means its the original user
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You are not authenticated");
    }
  } catch (error) {
    console.log(error, "Internal server error");
  }
};

// verifying if the user is authorized to make changes by checking the payload information consisting the userId.

const verifyTokenandAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userId === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that");
    }
  });
};

const verifyTokenandAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenandAuthorization,
  verifyTokenandAdmin,
};
