# BookNest — Full-Stack Library Management System

BookNest is a full-stack library management platform built with **Spring Boot** and **React**. It provides separate user and administrator workflows for catalog management, borrowing, reservations, fines, subscriptions, payments, authentication, and account management.

> **Project status:** Core frontend and backend are complete and tested locally. Google authentication is intentionally left as a future enhancement.

## Repository structure

```text
BookNest-Library-Management-System/
├── backend/
└── frontend/
```

## Main features

### User
- Registration and JWT login
- Role-aware access control
- Browse and search books
- Book details and reviews
- Borrow, renew, return and reservation workflows
- Wishlist
- Fine viewing and payment flow
- Subscription plans and membership management
- Profile and settings
- Forgot/reset password through email

### Administrator
- Dashboard and library statistics
- Book and inventory management
- Loan management
- Fine management
- Reservation management
- Hierarchical genre management
- User management
- Subscription and plan management
- Payment records

### Security / backend integrations
- Spring Security + JWT
- BCrypt password hashing
- Role-based authorization
- MySQL + JPA/Hibernate
- Gmail SMTP password-reset flow
- Razorpay payment-link integration and server-side payment verification
- CORS configuration for the React client

## Technology stack

**Backend**
- Java 17
- Spring Boot 4.1.0
- Spring MVC / Web
- Spring Security
- JPA / Hibernate
- MySQL
- JJWT 0.12.6
- Spring Mail
- Razorpay Java SDK
- Maven

**Frontend**
- React 19
- Vite 7
- React Router
- Axios
- Tailwind CSS 4
- lucide-react

## Architecture

```text
React + Vite
      │
      │ REST / JSON + JWT
      ▼
Spring Boot REST API
      │
      ├── Spring Security / JWT
      ├── Service layer
      ├── JPA / Hibernate
      ▼
    MySQL
      │
      ├── Gmail SMTP
      └── Razorpay
```

## Local setup

### 1. Prerequisites
- JDK 17
- MySQL
- Node.js + npm/pnpm
- A Gmail account with 2-Step Verification and an App Password if password-reset emails are required
- Razorpay test credentials if the payment flow is being tested

### 2. Backend

Create the `bookstore` database in MySQL, then configure the environment variables listed in `backend/.env.example`. **Do not commit your real `.env` file.**

On Windows PowerShell, for example:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/bookstore"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="YOUR_DB_PASSWORD"
$env:JWT_SECRET="YOUR_RANDOM_SECRET_AT_LEAST_32_CHARACTERS"
$env:ADMIN_EMAIL="YOUR_ADMIN_EMAIL"
$env:ADMIN_PASSWORD="YOUR_ADMIN_PASSWORD"
$env:ADMIN_FULL_NAME="BookNest Administrator"
$env:MAIL_USERNAME="YOUR_GMAIL_ADDRESS"
$env:MAIL_APP_PASSWORD="YOUR_GMAIL_APP_PASSWORD"
$env:RAZORPAY_KEY_ID="YOUR_RAZORPAY_KEY_ID"
$env:RAZORPAY_KEY_SECRET="YOUR_RAZORPAY_KEY_SECRET"

cd backend
.\mvnw.cmd spring-boot:run
```

The backend runs at `http://localhost:8080`.

### 3. Frontend

```powershell
cd frontend
pnpm install
pnpm run dev
```

The frontend runs at `http://localhost:5173`. The default API URL is `http://localhost:8080`. To use another backend URL, create a local `.env` in `frontend/` based on `.env.example`.

### 4. Admin account

On first backend startup, `DataInitializationComponent` creates an administrator only when the configured `ADMIN_EMAIL` does not already exist. The password is read from `ADMIN_PASSWORD` and is BCrypt-hashed before storage.

## Environment variables

See:
- `backend/.env.example`
- `frontend/.env.example`

Never put real credentials in these example files.

## API overview

The backend exposes REST endpoints grouped around:

```text
/auth/**
/api/books/**
/api/book-loans/**
/api/reservations/**
/api/fines/**
/api/genres/**
/api/subscriptions/**
/api/subscription-plans/**
/api/users/**
/api/payments/**
/api/wishlist/**
/api/reviews/**
```

Protected endpoints require the JWT returned by login. Administrator endpoints require `ROLE_ADMIN`.

## Payments

Razorpay payment links are used for supported membership/fine payment flows. The backend validates payment information against Razorpay before completing the corresponding application action. The callback endpoint is:

```text
GET /api/payments/callback
```

Production deployment should additionally use the appropriate Razorpay webhook/signature protections and production HTTPS configuration.

## Google authentication

Google OAuth login is **not part of the current stable release**. It is intentionally documented as a future enhancement rather than included as an unfinished feature.

## Security checklist

Before pushing this repository publicly, confirm:

- [ ] No database password is present in source code.
- [ ] No Gmail password/App Password is present in source code.
- [ ] No Razorpay secret is present in source code.
- [ ] No JWT signing secret is present in source code.
- [ ] No admin password is present in source code.
- [ ] No GitHub Personal Access Token is present in source code.
- [ ] No `.env` file is tracked by Git.
- [ ] Only `.env.example` files contain placeholders.
- [ ] `git status` and `git diff --cached` have been reviewed before the first commit.
- [ ] If an old secret was ever committed to Git history, it has been rotated/revoked before publishing.

## License

This project is intended as a portfolio/academic project. Add a formal open-source license only if you want to grant those permissions to others.
