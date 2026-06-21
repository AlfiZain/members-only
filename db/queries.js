import pool from './pool.js';

export async function getHomepageData() {
  const { rows } = await pool.query(
    `SELECT m.*, u.firstname, u.lastname FROM messages m INNER JOIN users u ON m.user_id = u.id ORDER BY m.created_at DESC`,
  );

  return rows;
}

export async function getUserById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

  return rows[0] || null;
}

export async function getUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);

  return rows[0] || null;
}

export async function createUser({
  firstname,
  lastname,
  email,
  password,
  membership_status = false,
  is_admin = false,
}) {
  await pool.query(
    'INSERT INTO users (firstname, lastname, email, password, membership_status, is_admin) VALUES ($1, $2, $3, $4, $5, $6);',
    [firstname, lastname, email, password, membership_status, is_admin],
  );
}

export async function promoteToMember(id) {
  await pool.query('UPDATE users SET membership_status = $1 WHERE id = $2', [
    true,
    id,
  ]);
}

export async function promoteToAdmin(id) {
  await pool.query(
    'UPDATE users SET membership_status = $1, is_admin = $2 WHERE id = $3',
    [true, true, id],
  );
}

export async function createMessage({ title, content, user_id }) {
  await pool.query(
    `
      INSERT INTO messages (title, content, user_id) VALUES ($1, $2, $3)
    `,
    [title, content, user_id],
  );
}

export async function deleteMessageById(id) {
  await pool.query('DELETE FROM messages WHERE id = $1', [id]);
}
