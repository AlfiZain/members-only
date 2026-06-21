# Members Only

An exclusive clubhouse application where users can share anonymous messages. Everyone can read the messages, but only club members can see who wrote them and when they were posted.

This project was built as part of The Odin Project Node.js curriculum to practice authentication, authorization, sessions, and PostgreSQL database management.

## Live Preview

https://members-only-alfi.up.railway.app/

## Features

### Authentication

- User registration with validation and password confirmation
- Secure password hashing using bcrypt
- User login and logout with Passport.js
- Session-based authentication

### Membership System

- New users are registered as regular users
- Users can become club members by entering a secret membership code
- Members can view:
  - Message author
  - Message creation date

### Admin System

- Users can become administrators by entering a secret admin code
- Administrators automatically receive member privileges
- Administrators can:
  - View message authors
  - View message dates
  - Delete messages

### Messages

- Create new messages when logged in
- Display all messages on the homepage
- Anonymous message viewing for non-members
- Author and timestamp visibility for members and admins only

### Additional Features

- Custom 404 page
- Form validation and sanitization
- PostgreSQL session storage

---

## User Roles

### Guest

- View all messages
- Cannot see authors
- Cannot see message dates
- Cannot create messages

### User

- View all messages
- Create messages
- Cannot see authors
- Cannot see message dates

### Member

- View all messages
- Create messages
- View message authors
- View message dates

### Admin

- All member permissions
- Delete messages

---

## Technologies Used

- Node.js
- Express
- PostgreSQL
- Passport.js
- express-session
- node-postgres(pg)
- connect-pg-simple
- bcrypt
- EJS
- CSS

---

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=your_database_url

SESSION_SECRET=your_session_secret

MEMBERSHIP_CODE=your_membership_code
ADMIN_CODE=your_admin_code
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd members-only
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

```bash
cp .env.example .env
```

Database seeding and table creation:

```bash
npm run seed:dev
```

Development mode:

```bash
npm run dev
```

---

## Becoming a Member

After creating an account and logging in:

1. Visit `/join-club`
2. Enter the value stored in the `MEMBERSHIP_CODE` environment variable

Once verified, your account will be upgraded to a member account.

---

## Becoming an Admin

After creating an account and logging in:

1. Visit `/join-club`
2. Enter the value stored in the `ADMIN_CODE` environment variable

Once verified:

- Your account will be upgraded to an administrator account
- You will automatically receive member privileges

---

## Project Requirements

This project implements the following concepts:

- Authentication with Passport.js
- Password hashing with bcrypt
- Session management
- Role-based authorization
- PostgreSQL database relationships
- Form validation and sanitization
- Server-side rendering with EJS
