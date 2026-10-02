# BookNest Backend

Spring Boot backend for the BookNest Library Management System.

## Technology

- Java 17
- Spring Boot 4.1.0
- Spring Security
- JWT authentication
- Spring Data JPA / Hibernate
- MySQL
- Spring Mail
- Razorpay Payment Links
- Maven

## Local setup

1. Create a MySQL database named `bookstore`.
2. Copy `.env.example` to `.env`.
3. Fill in your local database, admin, SMTP, JWT, and Razorpay test credentials.
4. Keep `.env` local. It is ignored by Git.
5. Start the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

The API runs on `http://localhost:8080`.

## Important security note

No passwords, JWT secrets, SMTP credentials, admin credentials, or Razorpay secrets are stored in source control. Configure them through the local `.env` file.

## Frontend

The frontend runs on `http://localhost:5173` by default. The backend is configured to accept the BookNest frontend origin.

## Future enhancement

Google OAuth authentication is intentionally not part of the current stable release and can be added later.
