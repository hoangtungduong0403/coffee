// utils/token.js
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const SECRET = process.env.JWT_SECRET || "secret";

export function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    SECRET,
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken() {
  return uuidv4();
}