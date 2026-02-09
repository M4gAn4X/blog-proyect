import pool from "../config/db.js";

export async function findUserByUsername(username) {
  const { rows } = await pool.query(
    `SELECT id, username, email, display_name, password_hash
     FROM users
     WHERE username = $1
     LIMIT 1`,
    [username]
  );

  return rows[0] || null;
}

export async function createUser({ username, email = null, displayName = null, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO users (username, email, display_name, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, display_name`,
    [username, email, displayName, passwordHash]
  );
  
  return rows[0];
}