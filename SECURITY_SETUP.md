# 🔒 Security Setup Guide - Read This First!

## ⚠️ IMPORTANT: Environment Variables

### Backend Setup (REQUIRED)

1. **Create `.env` file in `backend/` directory:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `backend/.env` and add these values:**
   ```env
   # Required - Your MongoDB Atlas connection string
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_db
   
   # Required - JWT secret (use a strong random string, min 32 characters)
   JWT_SECRET=your_very_long_random_secret_string_at_least_32_chars
   
   # Required - Razorpay payment gateway credentials
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Optional
   PORT=5000
   NODE_ENV=development
   PROD_CLIENT_URL=http://localhost:5173
   ```

3. **NEVER commit the `.env` file!**
   - The file is already in `.gitignore`
   - Keep all secrets safe
   - Don't share credentials in messages

---

### Client Setup (OPTIONAL for local development)

1. **Create `.env` file in `client/` directory:**
   ```bash
   cd client
   cp .env.example .env
   ```

2. **Edit `client/.env`:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

3. **For production, use `.env.production`:**
   - Update the API URL to your production backend
   - This is used during the build process

---

## 🚀 Starting the Project Securely

### Development

```bash
# Backend (in backend/ directory)
npm install
npm run dev

# Client (in client/ directory)  
npm install
npm run dev
```

### Production

Before deploying:
1. Set `NODE_ENV=production`
2. Verify all `.env` values are correct
3. Ensure `.env` files are NOT in your deployment
4. Use a secrets management service (AWS Secrets Manager, etc.)

---

## 🔐 Security Improvements in This Project

✅ **Rate Limiting** - Protects against brute force attacks  
✅ **Security Headers** - Sets HTTP security headers (helmet)  
✅ **CORS Protection** - Only allows approved origins  
✅ **Input Sanitization** - Prevents MongoDB injection  
✅ **Error Handling** - Doesn't expose sensitive details  
✅ **Password Hashing** - Uses bcrypt with salt  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Compression** - Reduces bandwidth usage  
✅ **Clean Logging** - No sensitive data in logs  

---

## ⛔ What NOT to Do

- ❌ Never commit `.env` files
- ❌ Never hardcode secrets in code
- ❌ Never expose credentials in error messages
- ❌ Never use weak JWT secrets
- ❌ Never disable CORS security
- ❌ Never use `eval()` or similar on user input
- ❌ Never store passwords in plain text
- ❌ Never skip input validation
- ❌ Never commit API keys to version control
- ❌ Never log sensitive information

---

## 📚 Additional Resources

- [SECURITY.md](./SECURITY.md) - Detailed security documentation
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## 🆘 Need Help?

1. Check if `.env` file exists with correct values
2. Verify database connection string is correct
3. Ensure `NODE_ENV` is set appropriately
4. Check `backend/logs` for error messages
5. Review [SECURITY.md](./SECURITY.md) for detailed information

---

**Security is everyone's responsibility. Thank you for helping keep this project safe! 🛡️**
