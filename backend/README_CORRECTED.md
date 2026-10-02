# Book-Store-Management-System — Corrected Backend

This is the complete backend project with the previously identified backend corrections applied to the original project structure.

## Run
1. Open this folder as a Maven/Spring Boot project.
2. Configure the values in `src/main/resources/application.properties` (or set the matching environment variables).
3. Make sure MySQL database `bookstore` exists.
4. Run `BookStoreManagementSystemApplication` or use the Maven wrapper.

## Required local configuration
- `DB_USERNAME`
- `DB_PASSWORD`
- `MAIL_USERNAME`
- `MAIL_APP_PASSWORD` — use a Google App Password, not your normal Gmail password.
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

The default frontend URL is `http://localhost:5173`.
The payment callback endpoint is `/api/payments/callback`.

## Important
Real credentials are intentionally not included in this corrected package. They were removed from the source copy so they are not exposed in the project archive.
