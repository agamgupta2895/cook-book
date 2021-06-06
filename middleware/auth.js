import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    let token;
    let isCustomAuth;

    if (req.headers.authorization) {
      token = req.headers?.authorization.split(" ")[1];
      isCustomAuth = token.length < 500;
    }

    if (!token) {
      return res.status(401).json({ message: "Please login in" });
    }

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "secretkey");
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
