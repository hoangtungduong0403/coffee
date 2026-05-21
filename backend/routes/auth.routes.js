import express from "express";
import jwt from "jsonwebtoken";
import { validateUser } from "../services/auth.service.js";
import * as authService from "../services/auth.service.js";
const router = express.Router();

function signAccessToken(user) {
  return jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
}

function signRefreshToken(user) {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
}

// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const user = validateUser(email, password);

//   if (!user) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const accessToken = signAccessToken(user);
//   const refreshToken = signRefreshToken(user);

//   res.json({ accessToken, refreshToken, user });
// });
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refresh(refreshToken);
    res.json(data);
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
});

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  res.json({ ok: true });
});

export default router;
