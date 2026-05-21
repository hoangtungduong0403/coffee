import bcrypt from "bcryptjs";
import {generateAccessToken, generateRefreshToken} from "../utils/token.js";
import { pool } from "../db.js";
const admin = {
  id: 1,
  email: "admin@coffee.com",
  password: bcrypt.hashSync("123456", 8), // hashed
};

export function validateUser(email, password) {
if (email !== admin.email) return null;
  const valid = bcrypt.compareSync(password, admin.password);
  if (!valid) return null;
  return { id: admin.id, email: admin.email };
}

export async function login(email, password) {
  const user = validateUser(email, password);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  await pool.query(
    `INSERT INTO refresh_tokens (token, expires_at)
     VALUES ($1, NOW() + INTERVAL '7 days')`,
    [refreshToken]
  );

  return { accessToken, refreshToken };
}
export async function refresh(refreshToken) {
  const res = await pool.query(
    `SELECT * FROM refresh_tokens WHERE token = $1`,
    [refreshToken]
  );

  const record = res.rows[0];
  if (!record) throw new Error("Invalid refresh token");

  if (new Date(record.expires_at) < new Date()) {
    throw new Error("Expired refresh token");
  }

  // always return admin
  const user = {
    id: 1,
    email: "admin@coffee.com",
  };

  const accessToken = generateAccessToken(user);

  return { accessToken };
}

export async function logout(refreshToken) {
  await pool.query(
    `DELETE FROM refresh_tokens WHERE token = $1`,
    [refreshToken]
  );
}