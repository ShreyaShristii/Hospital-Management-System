# 🛡️ HMS Security Quick Reference Card

## ⚡ Quick Setup (5 minutes)

```bash
# 1. Backend setup
cd backend
cp .env.example .env
# Edit .env with your actual values

# 2. Install packages
npm install

# 3. Start server
npm run dev
```

---

## 🔑 Environment Variables Required

### Backend (backend/.env)
```
✓ MONGO_URI          (MongoDB connection string)
✓ JWT_SECRET         (Strong random string, min 32 chars)
✓ RAZORPAY_KEY_ID    (Payment gateway ID)
✓ RAZORPAY_KEY_SECRET (Payment gateway secret)
✓ PORT               (Default: 5000)
✓ NODE_ENV           (development/production)
✓ PROD_CLIENT_URL    (Frontend URL for CORS)
```

### Client (client/.env) - Optional
```
✓ VITE_API_URL       (Backend API URL)
✓ VITE_RAZORPAY_KEY_ID (Payment gateway ID)
```

---

## 🚫 Security Do's and Don'ts

### ✅ DO
- Store secrets in `.env` files
- Use strong passwords/tokens (min 32 chars)
- Rotate credentials regularly
- Keep dependencies updated
- Use HTTPS in production
- Validate all user input
- Log errors safely (dev-only)
- Use rate limiting

### ❌ DON'T
- Commit `.env` files to git
- Hardcode secrets in code
- Share credentials via messages
- Use weak passwords
- Trust user input
- Log sensitive data
- Disable CORS security
- Skip input validation

---

## 🔒 Security Features Built In

| Feature | Status | What It Does |
|---------|--------|--------------|
| **Helmet** | ✅ | Sets 10+ security headers |
| **Rate Limiting** | ✅ | Blocks brute force attacks (5 auth/15min) |
| **CORS** | ✅ | Restricts to approved origins only |
| **Input Sanitization** | ✅ | Prevents MongoDB injection |
| **Compression** | ✅ | Gzip compression (60-70% smaller) |
| **Error Handling** | ✅ | Generic messages in production |
| **Password Hashing** | ✅ | Bcrypt with salt |
| **JWT Auth** | ✅ | Token-based authentication |

---

## 🧪 Quick Security Tests

### Test 1: Rate Limiting Works
```
1. Try to login 6 times within 1 minute
2. On the 6th attempt, you should get blocked
3. Message: "Too many login attempts..."
```

### Test 2: CORS Works
```
1. Open browser console
2. Try request from different domain
3. Should see: "CORS policy denied"
```

### Test 3: Error Messages Safe
```
1. Access protected endpoint without token
2. Response should be generic: "Not authorized..."
3. Should NOT expose token details
```

### Test 4: Headers Set
```
curl -I https://your-api.com/api
# Should see security headers like:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Strict-Transport-Security: ...
```

---

## 🚀 Deployment Checklist

- [ ] All `.env` variables configured
- [ ] `.env` files NOT in git
- [ ] `NODE_ENV=production`
- [ ] `PROD_CLIENT_URL` set correctly
- [ ] HTTPS/SSL certificate installed
- [ ] Database backups configured
- [ ] `npm audit` passed (no vulnerabilities)
- [ ] Rate limits reviewed for your traffic
- [ ] Monitoring/alerting set up
- [ ] Team trained on security practices

---

## 📖 Documentation Links

| Document | Purpose |
|----------|---------|
| [SECURITY_SETUP.md](./SECURITY_SETUP.md) | **START HERE** - Setup guide |
| [SECURITY.md](./SECURITY.md) | Detailed security documentation |
| [SECURITY_HARDENING_SUMMARY.md](./SECURITY_HARDENING_SUMMARY.md) | Complete summary of changes |

---

## 🆘 Common Issues

### Q: Server won't start
```
❌ Error: MONGO_URI not found
✅ Solution: Check backend/.env has MONGO_URI value
```

### Q: Getting 429 errors (rate limited)
```
❌ Error: Too many requests
✅ Solution: Wait 15 minutes or adjust limits in server.js
```

### Q: CORS errors in browser
```
❌ Error: CORS policy denied
✅ Solution: Add your domain to PROD_CLIENT_URL
```

### Q: Seeing generic error message
```
❌ Error: "An error occurred..."
✅ Info: This is correct for production! Set NODE_ENV=development to see details
```

---

## 🎯 Security Priorities

### Priority 1 (Critical)
- Never commit `.env` files
- Use strong JWT_SECRET
- Keep dependencies updated

### Priority 2 (High)
- Configure MongoDB securely
- Use HTTPS in production
- Set up monitoring

### Priority 3 (Medium)
- Review access logs regularly
- Rotate credentials quarterly
- Run security audits annually

---

## 🔄 Regular Maintenance

### Weekly
- Monitor error logs
- Check for unusual activity

### Monthly
- Run `npm audit`
- Update minor dependencies

### Quarterly
- Review security policies
- Rotate sensitive credentials
- Run security tests

---

## 🆘 Security Incident Response

**If you suspect a security breach:**

1. ⏹️ **Stop** - Don't panic, follow the steps
2. 🔍 **Investigate** - Check logs for suspicious activity
3. 🛡️ **Secure** - Rotate all credentials immediately
4. 📢 **Report** - Notify your security team
5. 📋 **Document** - Record what happened for review

---

## 🌐 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

---

## ❓ Need Help?

1. Check [SECURITY_SETUP.md](./SECURITY_SETUP.md)
2. Read [SECURITY.md](./SECURITY.md)
3. Review this quick reference
4. Ask your security team

---

**Remember: Security is Everyone's Responsibility! 🛡️**

*Print this card and keep it near your desk*
