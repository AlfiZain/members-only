import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'node:path';

const PASSWORD = '@Password123';

const users = [
  // Admin
  {
    firstname: 'Admin',
    lastname: 'User',
    email: 'admin@example.com',
    membership_status: true,
    is_admin: true,
  },

  // Members
  {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    membership_status: true,
    is_admin: false,
  },
  {
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane@example.com',
    membership_status: true,
    is_admin: false,
  },

  // Non-members
  {
    firstname: 'Alice',
    lastname: 'Johnson',
    email: 'alice@example.com',
    membership_status: false,
    is_admin: false,
  },
  {
    firstname: 'Bob',
    lastname: 'Wilson',
    email: 'bob@example.com',
    membership_status: false,
    is_admin: false,
  },
  {
    firstname: 'Charlie',
    lastname: 'Taylor',
    email: 'charlie@example.com',
    membership_status: false,
    is_admin: false,
  },
];

const messages = [
  // Admin (2)
  {
    title: 'Welcome to Members Only',
    content: 'Welcome everyone to the clubhouse.',
    email: 'admin@example.com',
  },
  {
    title: 'Club Rules',
    content: 'Be respectful and enjoy the discussions.',
    email: 'admin@example.com',
  },

  // Members (3)
  {
    title: 'Learning Express',
    content: 'Express routing is getting easier every day.',
    email: 'john@example.com',
  },
  {
    title: 'PostgreSQL Tips',
    content: 'Foreign keys are extremely useful.',
    email: 'jane@example.com',
  },
  {
    title: 'Database Design',
    content: 'Normalization makes life easier.',
    email: 'john@example.com',
  },

  // Non-members (4)
  {
    title: 'Hello Everyone',
    content: 'I just joined the platform.',
    email: 'alice@example.com',
  },
  {
    title: 'My First Post',
    content: 'Looking forward to becoming a member.',
    email: 'bob@example.com',
  },
  {
    title: 'Secret Club?',
    content: 'What is the passcode anyway?',
    email: 'charlie@example.com',
  },
  {
    title: 'Still Waiting',
    content: 'I hope I can join the club soon.',
    email: 'alice@example.com',
  },
];

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  const userIds = {};

  try {
    const schema = await readFile(
      path.join(path.dirname(fileURLToPath(import.meta.url)), 'schema.sql'),
      'utf-8',
    );
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);

    await client.connect();

    await client.query(schema);
    await client.query(`
      TRUNCATE TABLE 
        users,
        messages
      RESTART IDENTITY
      CASCADE;
      `);

    for (const user of users) {
      const result = await client.query(
        `
        INSERT INTO users (
          firstname,
          lastname,
          email,
          password,
          membership_status,
          is_admin
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
        `,
        [
          user.firstname,
          user.lastname,
          user.email,
          hashedPassword,
          user.membership_status,
          user.is_admin,
        ],
      );

      userIds[user.email] = result.rows[0].id;
    }

    for (const message of messages) {
      await client.query(
        `
        INSERT INTO messages (
          title,
          content,
          user_id
        )
        VALUES ($1, $2, $3);
        `,
        [message.title, message.content, userIds[message.email]],
      );
    }

    console.log('Database seeded successfully');
    console.log(`Login password for all users: ${PASSWORD}`);
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await client.end();
  }
}

main();
