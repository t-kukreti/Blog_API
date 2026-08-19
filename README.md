# Blog_API

A RESTful API for a blogging platform, built with Node.js, Express, and Prisma (PostgreSQL). Supports JWT-based authentication, author/reader roles, nested comment threads, and soft-deletable comments.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Prisma (with `@prisma/adapter-pg`)
- **Auth:** JWT (`jsonwebtoken`, `passport`, `passport-jwt`)
- **Password hashing:** bcrypt
- **Validation:** express-validator
- **Other:** cors, dotenv

## Project Structure

```
Blog_API/
├── config/                 # Passport strategy config
├── controllers/            # Route handler logic (auth, post, comment)
├── db/                     # Prisma query helpers
├── generated/prisma/       # Generated Prisma client (not hand-edited)
├── lib/                    # passport setup, password hashing, prisma client instance
├── middleware/
│   ├── authMiddleware.js   # JWT auth, role/ownership checks, post/comment loaders
│   └── validators/         # express-validator rule sets
├── prisma/
│   ├── schema.prisma       # User, Post, Comment models
│   └── migrations/
├── routes/
│   ├── authRouter.js       # /auth
│   ├── postRouter.js       # /posts
│   └── commentRouter.js    # /comments
├── app.js                  # App entry point
└── prisma.config.js
```

## Data Model

- **User** — email, username, hashed password, `isAuthor` flag. Has many posts and comments.
- **Post** — title, content, `published` flag, belongs to an author (User). Has many comments.
- **Comment** — content, `deleted` flag (soft delete), belongs to an author and a post, and can optionally reply to another comment (`parentCommentId`), enabling threaded replies.

## Prerequisites

- Node.js (LTS recommended)
- PostgreSQL database
- npm

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/t-kukreti/Blog_API.git
   cd Blog_API
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   PORT=8000
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   JWT_SECRET_KEY="your_jwt_secret"
   ```

4. Run Prisma migrations to set up the database schema

   ```bash
   npx prisma migrate dev
   ```

5. Start the server

   ```bash
   node app.js
   ```

   The API will be available at `http://localhost:8000` (or your configured `PORT`).

> **Note:** CORS is currently locked to `http://localhost:5173` and `http://localhost:5174` in `app.js`. Update `allowedOrigins` there before pointing a frontend at a different origin or deploying.

## Authentication

Auth is handled via Passport's `passport-jwt` strategy. After signing up or logging in, include the returned token on protected routes:

```
Authorization: Bearer <token>
```

Users start as regular accounts; hitting `/auth/become-author` upgrades the authenticated user to an author, which is required to create posts.

## API Endpoints

### Auth — `/auth`

| Method | Endpoint            | Auth Required | Body                                                  | Description                          |
|--------|----------------------|----------------|--------------------------------------------------------|---------------------------------------|
| POST   | `/auth/sign-up`      | No             | `email`, `username`, `password`, `confirmPassword`     | Register a new user                   |
| POST   | `/auth/login`        | No             | `email`, `password`                                     | Log in, returns a JWT                 |
| POST   | `/auth/become-author` | Yes           | —                                                        | Upgrade the current user to author    |
| GET    | `/auth/me`           | Yes            | —                                                        | Get the current authenticated user    |

### Posts — `/posts`

| Method | Endpoint                  | Auth Required | Notes                                                        |
|--------|-----------------------------|----------------|----------------------------------------------------------------|
| GET    | `/posts`                    | No             | Get all posts                                                 |
| GET    | `/posts/mine`                | Yes (author)   | Get all posts by the logged-in author                         |
| GET    | `/posts/:id`                 | Optional       | Get a single post — unpublished posts only visible to their author |
| POST   | `/posts`                     | Yes (author)   | Body: `title`, `content` — create a new post                  |
| PATCH  | `/posts/:id`                  | Yes (owner)    | Body: `title`, `content` — edit a post you own                |
| PATCH  | `/posts/:id/publish`          | Yes (owner)    | Publish a draft post                                           |
| DELETE | `/posts/:id`                  | Yes (owner)    | Delete a post you own                                          |

### Comments (nested under posts) — `/posts/:postId/comments`

| Method | Endpoint                      | Auth Required | Body                                | Description                          |
|--------|---------------------------------|----------------|---------------------------------------|----------------------------------------|
| GET    | `/posts/:postId/comments`       | No             | —                                      | Get all top-level comments on a post   |
| POST   | `/posts/:postId/comments`       | Yes            | `content`, `parentCommentId` (optional) | Add a comment or reply to a comment    |

### Comments — `/comments`

| Method | Endpoint                        | Auth Required | Body       | Description                                |
|--------|-----------------------------------|----------------|--------------|-----------------------------------------------|
| GET    | `/comments/:commentId/replies`     | No             | —            | Get replies to a comment                       |
| PATCH  | `/comments/:commentId`             | Yes (owner)    | `content`    | Edit a comment you own (not if already deleted) |
| DELETE | `/comments/:commentId`             | Yes (owner)    | —            | Soft-delete a comment you own                  |

## Error Handling

Unhandled errors return a JSON error body:

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong"
  }
}
```

## License

Add a license (e.g., MIT) here.

## Author

**t-kukreti** — [GitHub](https://github.com/t-kukreti)