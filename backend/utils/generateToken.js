
//utils/generateToken.js

import jwt from "jsonwebtoken";

const generateToken = (id, res) => {
  // Use JWT_SECRET consistently
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  });

  return token;
};

export default generateToken;