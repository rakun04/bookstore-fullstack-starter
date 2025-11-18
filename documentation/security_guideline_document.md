# Security Guidelines for the E-Commerce Admin Panel

This document outlines best practices and actionable controls to secure your Admin Panel built with Next.js (`shadcn/ui` + Tailwind), NestJS backend, Drizzle ORM, PostgreSQL, Docker Compose, and Flutter mobile client. It aligns with Security-by-Design principles, ensuring defense in depth, least privilege, and secure defaults.

---

## 1. Authentication & Access Control

- **Robust Credential Handling**  
  • Enforce strong password policy in NestJS: minimum length 12, uppercase, lowercase, numbers, symbols.  
  • Hash passwords with Argon2 or bcrypt + per-user salt.  
  • Implement account lockout and exponential back-off on repeated failed logins.

- **JWT & Session Management**  
  • Use HS256 or RS256 (avoid “none”) for JWTs.  
  • Validate `exp`, `iat`, and `aud` claims on every request.  
  • Store tokens in HttpOnly, Secure, SameSite=Strict cookies.  
  • Provide logout endpoint to revoke refresh tokens (maintain revoke list).  
  • Rotate signing keys periodically; support key rollover.

- **Role-Based Access Control**  
  • Define roles (`Admin`, `Customer`) in database schema.  
  • Enforce server-side authorization in NestJS guards for every protected route.  
  • In Next.js, perform an initial session check in `/dashboard/layout.tsx` server component; redirect non-admins to sign-in.

- **Multi-Factor Authentication (MFA)**  
  • Offer TOTP via authenticator apps for Admin users.  
  • Require MFA enrollment on first login for high-privileged accounts.

---

## 2. Input Handling & Processing

- **Schema Validation**  
  • Use Zod or class-validator in NestJS DTOs to validate all API inputs.  
  • In Next.js, validate form values client- and server-side (with Next.js API routes removed, server actions should re-validate inputs).

- **Injection Prevention**  
  • Use Drizzle ORM’s parameterized queries—never concatenate SQL strings.  
  • Sanitize dynamic values in server-side templates and maintain strict HTML escaping in React.

- **File Upload Security**  
  • If uploading images (e.g., product photos), validate MIME type and file signature.  
  • Restrict max file size, store uploads in a secured bucket/container (not webroot).

- **Safe Redirects**  
  • Maintain an allow-list of valid redirect URLs when handling `next` query parameters.  
  • Reject any target not matching your own domains.

---

## 3. Data Protection & Privacy

- **Encryption in Transit & At Rest**  
  • Enforce HTTPS (TLS 1.2+) for all Next.js and NestJS endpoints.  
  • Enable `sslmode=require` on PostgreSQL connections.  
  • Use AES-256 for any field-level encryption (e.g., tokens, PII).  

- **Secrets Management**  
  • Store DB credentials, JWT keys, OAuth secrets in a vault (e.g., AWS Secrets Manager, HashiCorp Vault).  
  • Load secrets at runtime; do not commit to code or environment files.

- **Logging & Error Handling**  
  • Avoid leaking stack traces or sensitive values in error responses.  
  • Centralize logs in a secure system (e.g., ELK, CloudWatch) with restricted access.  
  • Mask PII in logs (e.g., truncate email addresses).

---

## 4. API & Service Security

- **Rate Limiting & Throttling**  
  • Integrate NestJS Throttler module to cap requests per IP or user (e.g., 100 reqs/min).  
  • Apply stricter limits on login and password reset endpoints.

- **CORS & CSRF**  
  • Configure NestJS CORS to allow only your Next.js admin origin.  
  • With cookie-based sessions, implement CSRF tokens for all state-changing requests.

- **API Versioning & Minimal Exposure**  
  • Version endpoints (e.g., `/api/v1/products`).  
  • Return only required fields in responses; never expose internal IDs or secrets.

- **Correct HTTP Verbs & Status Codes**  
  • Use GET for reads, POST for creation, PUT/PATCH for updates, DELETE for deletions.  
  • Return appropriate status codes: 200, 201, 400, 401, 403, 404, 500.

---

## 5. Web Application Security Hygiene

- **Security Headers**  
  • Content-Security-Policy: restrict scripts to self and approved CDNs; block inline scripts.  
  • Strict-Transport-Security: `max-age=31536000; includeSubDomains; preload`.  
  • X-Frame-Options: `DENY` or CSP `frame-ancestors 'none'`.  
  • X-Content-Type-Options: `nosniff`.  
  • Referrer-Policy: `no-referrer-when-downgrade` or stricter.

- **Cookie Hardening**  
  • Set `HttpOnly`, `Secure`, `SameSite=Strict` on session cookies.  
  • Avoid storing tokens or secrets in localStorage/sessionStorage.

- **Subresource Integrity (SRI)**  
  • For any third-party scripts/styles (e.g., analytics), include SRI hashes.

---

## 6. Infrastructure & Configuration Management

- **Container Security**  
  • Base images: use minimal, up-to-date official Node.js and Postgres images.  
  • Run containers as non-root user.  
  • Limit exposed ports to necessary ones (3000, 4000).  
  • Use Docker secrets for runtime credentials.

- **Server Hardening**  
  • Disable unused ports and services on host.  
  • Keep host OS, Docker Engine, and dependencies patched.

- **Disable Debug in Prod**  
  • Ensure `NODE_ENV=production`.  
  • Remove verbose logging and debug endpoints from deployed images.

---

## 7. Dependency Management

- **Vulnerability Scanning**  
  • Integrate SCA tools (e.g., GitHub Dependabot, Snyk) to detect CVEs in dependencies.  
  • Remediate critical/high issues within 48h.

- **Lockfiles & Pinning**  
  • Commit `package-lock.json` or `yarn.lock` and `go.mod`/`go.sum` if using Go.  
  • Pin Docker image tags to specific versions rather than `latest`.

- **Minimal Footprint**  
  • Audit and remove unused libraries.  
  • Avoid large utility frameworks on the client that can broaden the attack surface.

---

## 8. Mobile Application Security (Flutter)

- **Secure Storage**  
  • Use encrypted storage (Flutter Secure Storage) for tokens.  
  • Do not embed secrets or API keys in the binary.

- **API Communication**  
  • Enforce TLS pinning to prevent MITM.  
  • Validate server certificates at runtime.

- **Input & Output Handling**  
  • Reuse the same server-side validation rules.  
  • Avoid reflecting untrusted data directly in WebViews or dynamic UI.

---

## 9. DevOps & CI/CD Security

- **Pipeline Hardening**  
  • Store pipeline secrets in vault-backed variables (GitHub Secrets, GitLab CI variables).  
  • Enforce branch protection rules and mandatory code reviews.

- **Automated Testing & Scanning**  
  • Run unit/integration tests, linters, and SCA scans on every PR.  
  • Fail builds on high-severity findings.

- **Immutable Artifact Promotion**  
  • Build Docker images once; tag and push the same artifact through staging and production.

- **Infrastructure as Code (IaC)**  
  • Define Docker Compose, Terraform, or CloudFormation in version control.  
  • Scan IaC for misconfigurations (e.g., Terraform Sentinel, AWS Config).

---

Adhering to these controls will provide a strong security posture for your E-Commerce Admin Panel, ensuring confidentiality, integrity, and availability across the entire stack. Regularly review and update these guidelines as your architecture and threat landscape evolve.