# Security Hardening Guide - HMS Project

## Overview
This document outlines the security improvements made to the Hospital Management System (HMS) to make it production-ready and compliant with real-world security best practices.

## 🔒 Security Improvements Implemented

### 1. Environment Variables & Secrets Management
**Problem:** Database credentials and API keys were exposed in .env files committed to version control.

**Solution:**
- ✅ Updated `.gitignore` to exclude all `.env*` files
- ✅ Created `.env.example` files as templates showing required variables
- ✅ All sensitive credentials removed from version control

**What You Need to Do:**
```bash
# Backend setup
cd backend
cp .env.example .env
# Edit .env and add your actual values

# Client setup
cd ../client
cp .env.example .env
# Edit .env and add your API URL
```

**Never commit actual .env files to git!**

---

### 2. HTTP Security Headers (Helmet.js)
**Problem:** Missing security headers expose the application to various attacks.

**Solution:**
- ✅ Installed and configured `helmet` middleware
- Sets X-Frame-Options to prevent clickjacking
- Sets X-Content-Type-Options to prevent MIME sniffing
- Sets X-XSS-Protection headers
- Implements CSP (Content Security Policy)
- Adds HSTS headers for HTTPS enforcement

---

### 3. Rate Limiting
**Problem:** No protection against brute force attacks on login/registration.

**Solution:**
- ✅ Installed `express-rate-limit` package
- General rate limit: 100 requests per 15 minutes per IP
- Auth endpoints: 5 attempts per 15 minutes (login/register)
- Prevents brute force password attacks
- Mitigates DDoS attacks

**Configuration in `backend/server.js`:**
```javascript
// General limiter for all routes
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

---

### 4. CORS Hardening
**Problem:** CORS was too permissive, allowing all `*.vercel.app` deployments.

**Solution:**
- ✅ Restricted CORS to specific approved origins only
- Development: `localhost:5173`, `localhost:3000`
- Production: Only your production domain (from env variable)
- No more wildcard pattern matching for Vercel deployments

**Configuration:**
```javascript
// Only specific domains are allowed
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.PROD_CLIENT_URL]
  : ['http://localhost:5173', 'http://localhost:3000'];
```

---

### 5. Input Validation & Sanitization
**Problem:** No input validation/sanitization could allow injection attacks.

**Solution:**
- ✅ Installed `express-mongo-sanitize` to prevent NoSQL injection
- ✅ Installed `express-validator` for schema validation (ready for implementation)
- Removes $ and . from input to prevent MongoDB injection
- Protects against malicious data in request bodies

---

### 6. Data Compression
**Problem:** No compression increases bandwidth usage.

**Solution:**
- ✅ Installed and configured `compression` middleware
- Automatically gzip compresses responses
- Reduces payload size by 60-70%
- Speeds up API responses

---

### 7. Error Handling & Information Disclosure
**Problem:** Exposing detailed error messages reveals system internals to attackers.

**Solution:**
- ✅ Centralized error handler in `server.js`
- ✅ Generic error messages in production
- ✅ Full error details only logged in development
- Removed console.error statements that expose errors
- All sensitive API responses sanitized

**Example:**
```javascript
// Production error response
{ message: 'An error occurred. Please try again later.' }

// Development error response  
{ 
  message: 'Detailed error message',
  stack: 'Full stack trace for debugging'
}
```

---

### 8. Secure Response Handling
**Problem:** Sensitive information was exposed in API responses.

**Solution:**
- ✅ Removed `RAZORPAY_KEY_ID` from payment response (client can use environment variable)
- ✅ Removed database connection details from logs
- ✅ Sanitized error messages to prevent info leakage

---

### 9. Logging & Monitoring
**Problem:** Debug logs exposed sensitive information in production.

**Solution:**
- ✅ Wrapped all `console.error` and `console.log` statements with environment checks
- ✅ Only logs to console in development mode
- ✅ No sensitive information in log messages
- Recommendation: Use structured logging in production (Winston, Morgan)

```javascript
// Only logs in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Debug message');
}
```

---

### 10. Authentication Middleware
**Problem:** Poor error messages could leak authentication details.

**Solution:**
- ✅ Generic error message "Not authorized to access this route"
- ✅ No token details exposed in error responses
- ✅ Consistent error handling for all auth failures

---

## 📋 Checklist for Deployment

Before deploying to production, ensure:

- [ ] All environment variables are set correctly
- [ ] `.env` files are NOT committed to repository
- [ ] `NODE_ENV=production` is set in deployment environment
- [ ] `PROD_CLIENT_URL` is set to your actual frontend domain
- [ ] MongoDB connection string uses strong credentials
- [ ] JWT_SECRET is a strong, random string (minimum 32 characters)
- [ ] HTTPS/SSL certificate is installed
- [ ] All dependencies are up to date (`npm audit`)
- [ ] Rate limits are tuned for your expected traffic
- [ ] CORS origins are updated to your production domain
- [ ] Database backups are configured
- [ ] Monitoring and alerting are set up

---

## 🚀 Additional Security Recommendations

### 1. Implement JWT Refresh Tokens
Current implementation uses 1-day expiring tokens. Consider:
- Implement refresh token rotation
- Store refresh tokens in HTTP-only cookies
- Rotate tokens periodically

### 2. Add Request Logging
Install Morgan for production logging:
```bash
npm install morgan
```

### 3. Implement Input Validation
Use express-validator for all endpoints:
```javascript
const { body, validationResult } = require('express-validator');

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], loginController);
```

### 4. Database Security
- Use MongoDB Atlas with IP whitelisting
- Enable encryption at rest and in transit
- Regular automated backups
- Use minimum required permissions for database users

### 5. API Security Best Practices
- Use HTTPS only (redirect HTTP to HTTPS)
- Implement request signing for sensitive operations
- Add API versioning (`/api/v1/`)
- Implement rate limiting per user (not just per IP)
- Add request ID tracking for debugging

### 6. Secrets Management
- Use AWS Secrets Manager or similar in production
- Rotate secrets regularly
- Never log secrets
- Use different credentials for different environments

### 7. Database Injection Prevention
The system now uses `express-mongo-sanitize`, but also:
- Use parameterized queries (Mongoose handles this)
- Never concatenate user input into queries
- Validate all input types

### 8. Cross-Site Scripting (XSS) Prevention
- Helmet sets XSS protection headers
- Validate/sanitize all user input
- Use Content Security Policy headers
- Avoid `innerHTML` with user data on frontend

### 9. CSRF Protection
- Consider adding express-csrf for state-changing operations
- Use SameSite cookie attribute
- Validate referer headers

### 10. Security Headers
Current Helmet configuration includes:
- X-Frame-Options: Prevents clickjacking
- X-Content-Type-Options: Prevents MIME sniffing
- X-XSS-Protection: XSS protection
- Strict-Transport-Security: Enforces HTTPS
- Content-Security-Policy: Controls resource loading

---

## 🔐 Dependency Security

Keep dependencies up to date:
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update all packages (be careful)
npm update
```

---

## 📝 Environment Variables Reference

### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/db
JWT_SECRET=long_random_string_min_32_chars
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
PORT=5000
NODE_ENV=production
PROD_CLIENT_URL=https://yourdomain.com
```

### Client (.env)
```
VITE_API_URL=https://api.yourdomain.com/api
VITE_RAZORPAY_KEY_ID=your_key
```

---

## 🆘 Security Incident Response

If you suspect a security breach:
1. Immediately rotate all secrets/credentials
2. Check server logs for suspicious activity
3. Review database access logs
4. Notify affected users if needed
5. Implement additional monitoring

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

---

**Last Updated:** September 2026

For security concerns, contact your security team or maintainer immediately.
