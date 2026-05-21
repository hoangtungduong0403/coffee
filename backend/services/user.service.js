import { pool } from "../db.js";

// normalize phone
function normalizePhone(phone) {
  return phone.replace(/\D/g, "");
}

// find by phone
export async function findByPhone(phone) {
  const clean = normalizePhone(phone);

  const res = await pool.query(
    "SELECT * FROM users WHERE phone = $1",
    [clean]
  );

  return res.rows[0];
}

export async function findByPhoneLike(phone) {
  const clean = normalizePhone(phone);

  const res = await pool.query(
    `SELECT * FROM users
     WHERE phone LIKE $1
     ORDER BY created_at DESC`,
    [`%${clean}%`]
  );

  return res.rows;
}

// find by id
export async function findById(id) {
  const res = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  return res.rows[0];
}

// create or return existing
export async function createIfNotExist(phone) {
  const clean = normalizePhone(phone);

  let user = await findByPhone(clean);
  if (user) return user;

  const res = await pool.query(
    `INSERT INTO users (phone, points, purchases)
     VALUES ($1, 0, 0)
     RETURNING *`,
    [clean]
  );

  return res.rows[0];
}

export async function findOrCreateUser(phone) {
  let user = await findByPhone(phone);

  if (!user) {
    user = await createUser(phone);
  }

  return user;
}

// add points + purchases
export async function addPoints(id, qty) {
  if (!qty || qty <= 0) {
    throw new Error("Invalid quantity");
  }

  const res = await pool.query(
    `UPDATE users 
     SET points = points + $1,
         purchases = purchases + $1
     WHERE id = $2
     RETURNING *`,
    [qty, id]
  );

  if (res.rows.length === 0) {
    throw new Error("User not found");
  }

  return res.rows[0];
}

// redeem (5 points = 1 coffee)
export async function redeem(id) {
  const res = await pool.query(
    `UPDATE users 
     SET points = points - 5
     WHERE id = $1 AND points >= 5
     RETURNING *`,
    [id]
  );

  if (res.rows.length === 0) {
    throw new Error("Not enough points or user not found");
  }

  return res.rows[0];
}