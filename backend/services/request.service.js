import { pool } from "../db.js";

export async function createRequest(userId) {
  const res = await pool.query(
    `INSERT INTO requests (user_id) 
     VALUES ($1) 
     RETURNING *`,
    [userId]
  );
  return res.rows[0];
}

export async function getAllRequests() {
  const res = await pool.query(`
    SELECT r.*, u.phone
    FROM requests r
    JOIN users u ON u.id = r.user_id
    WHERE r.status = 'pending'
    ORDER BY r.created_at DESC
  `);
  return res.rows;
}

export async function approveRequest(id) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. get request
    const reqRes = await client.query(
      `SELECT * FROM requests WHERE id = $1 AND status = 'pending'`,
      [id]
    );

    if (reqRes.rows.length === 0) {
      throw new Error("Request not found or already processed");
    }

    const request = reqRes.rows[0];

    // 2. mark request approved
    const updatedRequest = await client.query(
      `UPDATE requests 
       SET status = 'approved' 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    // 3. update user points
    const updatedUser = await client.query(
      `UPDATE users 
       SET points = points + $1,
           purchases = purchases + $1
       WHERE id = $2
       RETURNING *`,
      [request.quantity, request.user_id]
    );

    await client.query("COMMIT");

    return {
      request: updatedRequest.rows[0],
      user: updatedUser.rows[0],
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function rejectRequest(id) {
  console.log("Rejecting request with id:", id);
  const res = await pool.query(
    `UPDATE requests 
     SET status = 'rejected' 
     WHERE id = $1 
     RETURNING *`,
    [id]
  );

  return res.rows[0];
}