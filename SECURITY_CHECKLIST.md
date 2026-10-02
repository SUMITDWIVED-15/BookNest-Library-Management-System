# BookNest GitHub Security Checklist

## Never commit

- MySQL username/password when it is private
- Gmail password or Gmail App Password
- Razorpay `key_secret`
- JWT secret/signing key
- Admin password
- GitHub Personal Access Token
- Google OAuth client secret (when Google login is added later)
- Any third-party private API key
- Private certificates or private keys
- Production database connection strings containing credentials

## Safe to commit

- Java/React source code
- Maven `pom.xml`
- `package.json`
- Sanitized `application.properties` using environment variables
- `.env.example` with placeholders only
- API route names
- Public documentation and screenshots

## Important distinction

A username/email is not automatically a secret. However, personal account identifiers should still not be hardcoded when they are only needed for local administration. This project therefore reads the initial admin email and password from environment variables.

## Before first push

Run from the repository root:

```powershell
git status
git add .
git diff --cached
```

Stop if you see a real password, API secret, token, private key, or private credential.

## If a secret was previously committed

1. Rotate/revoke the affected credential immediately.
2. Do not assume deleting the file from the latest commit makes the secret safe.
3. If the repository was already pushed, follow GitHub's sensitive-data removal procedure when history must be rewritten.
4. Re-check the entire Git history after cleanup.

See GitHub's current guidance on removing sensitive data before performing history rewrites.
