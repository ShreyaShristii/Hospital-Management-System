# Hospital Management System (HMS)

> ⚠️ **SECURITY NOTICE**: Please read [SECURITY_SETUP.md](./SECURITY_SETUP.md) before starting development. This project includes security hardening measures that require proper environment configuration.

## Tech Stack

### Frontend
- React - UI components
- Redux - Global state management
- React Router - Client-side routing
- Axios - API calls
- Formik + Yup - Form handling and validation
- Recharts - Reports and analytics

### Backend
- Node.js + Express - REST API server
- MongoDB - Database
- JWT - Authentication
- Multer / Cloudinary - File uploads

---

## Folder Structure

### Backend
backend/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── .env
├── package.json
└── server.js

### Frontend
client/src/
├── assets/
├── components/
├── features/
├── pages/
├── routes/
├── services/
└── utils/

---

## Database Schema (MVP)

### users
- name
- username
- email
- password
- role (admin/doctor/patient/receptionist/nurse/lab_staff/pharmacist)
- dateOfJoining
- isActive

### patients
- userId (reference to users)
- age
- previousRecords
- emergencyContact
- contactNumber
- currentHealthStatus

### doctors
- userId (reference to users)
- specialization
- degree
- yearsOfExperience
- successRate
- workingDays
- workingHours
- consultationFee

### appointments
- patientId (reference to patients)
- doctorId (reference to doctors)
- appointmentDate
- appointmentTime
- status (Scheduled/Completed/Cancelled/No Show)
- reason

### bills
- patientId (reference to patients)
- doctorId (reference to doctors)
- amount
- paymentMode (cash/card/UPI)
- paymentStatus (paid/unpaid/partial)
- paymentDate
- items[]

### departments
- name
- description
- location
- totalStaff
- headDoctorId (reference to doctors)

---

## API Routes (MVP)

### Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password

### Patients
POST   /api/patients
GET    /api/patients
GET    /api/patients/:id
PUT    /api/patients/:id
DELETE /api/patients/:id

### Doctors
POST   /api/doctors
GET    /api/doctors
GET    /api/doctors/:id
PUT    /api/doctors/:id
DELETE /api/doctors/:id

### Appointments
POST   /api/appointments
GET    /api/appointments
GET    /api/appointments/:id
PUT    /api/appointments/:id
DELETE /api/appointments/:id

### Bills
POST   /api/bills
GET    /api/bills
GET    /api/bills/:id
PUT    /api/bills/:id
DELETE /api/bills/:id

### Departments
POST   /api/departments
GET    /api/departments
GET    /api/departments/:id
PUT    /api/departments/:id
DELETE /api/departments/:id

---

## Current Phase - COMPLETE ✅

### Backend Implementation ✅
**Database Models** (12 models implemented)
- User, Patient, Doctor, Appointment, Bill, Department
- Additional: Bed, EMR, Lab, Pharmacy, Notification, Review, Staff, Admission

**Controllers & Route Handlers** (100% CRUD)
- Patient: Create, Read, List, Update, Delete
- Doctor: Create, Read, List, Update, Delete, Filter by Specialization
- Appointment: Create, Read, List, Update, Delete, Filter by Patient/Doctor
- Bill: Create, Read, List, Update, Delete, Filter by Payment Status
- Department: Create, Read, List, Update, Delete, Search by Name
- Auth: Register, Login (JWT token)
- Additional controllers for Bed, EMR, Lab, Pharmacy, etc.

**Middleware & Security**
- ✅ JWT Authentication (authMiddleware.js)
- ✅ Role-based Authorization (roleMiddleware.js) - 7 roles supported
- ✅ CORS enabled for frontend integration
- ✅ Protected routes on all endpoints
- ✅ Password hashing with bcryptjs

**Server Configuration**
- ✅ Express.js with proper middleware setup
- ✅ MongoDB connection in config/db.js
- ✅ All routes mounted and operational
- ✅ Environment variables setup (.env)

---

### Frontend Implementation ✅

**API Layer**
- ✅ Axios instance with base URL configuration
- ✅ Request interceptor: Automatically adds JWT token to headers
- ✅ Response interceptor: Handles 401 errors, redirects to login
- ✅ Centralized API service (services/api.js)

**Redux State Management**
- ✅ Redux store configured (store.js)
- ✅ authSlice: Login, Register, Logout, Token management
- ✅ patientSlice: Fetch, Add, Update patient state
- ✅ doctorSlice: Fetch, Add, Update doctor state
- ✅ Ready for: appointmentSlice, billSlice, departmentSlice

**Pages Implemented**
- ✅ Login.jsx - User authentication with form validation
- ✅ Register.jsx - User registration with role selection
- ✅ Dashboard.jsx - Main landing page with quick stats
- ✅ Patients.jsx - Patient list with table view
- ✅ Doctors.jsx - Doctor list with card grid view
- ✅ AppRoutes.jsx - Route protection & navigation

**Reusable Components**
- ✅ Navbar.jsx - Navigation bar with user info & logout
- ✅ Loading.jsx - Loading spinner component
- ✅ Alert.jsx - Alert/toast notifications (info, success, warning, error)

**Styling**
- ✅ Global CSS (index.css) - 500+ lines with responsive design
- ✅ Navbar styles (navbar.css)
- ✅ Loading spinner animation (loading.css)
- ✅ Alert notifications (alert.css)
- ✅ Patients page (patients.css) - Table with status badges
- ✅ Doctors page (doctors.css) - Card grid layout
- ✅ Responsive design for mobile/tablet/desktop

---

### Features Working ✅

**Authentication**
- ✅ User registration with role selection
- ✅ User login with JWT token generation
- ✅ Token stored in localStorage
- ✅ Automatic token injection in API requests
- ✅ Token expiration handling (401 redirect)
- ✅ Logout functionality

**Data Display**
- ✅ Patients list with full information
- ✅ Doctors list with specialization & fees
- ✅ Loading states during API calls
- ✅ Error handling with user-friendly messages
- ✅ Empty states when no data

**UI/UX**
- ✅ Professional color scheme and typography
- ✅ Smooth hover effects and transitions
- ✅ Loading spinners with animations
- ✅ Alert notifications for success/error
- ✅ Responsive grid layouts
- ✅ Navigation between pages
- ✅ User role display

---

## Testing Status

### Backend (Postman Tested) ✅
- POST /api/auth/register - working ✅
- POST /api/auth/login - working ✅ (returns JWT token)
- GET /api/patients - protected, working ✅
- GET /api/doctors - protected, working ✅
- Other CRUD endpoints - ready to test

### Frontend (Component Level) ✅
- Redux store - connected ✅
- API interceptors - configured ✅
- Login flow - working ✅
- Register flow - working ✅
- Route protection - working ✅
- Data fetching - ready ✅

---

## Technology Stack Summary

| Component | Technology |
|-----------|------------|
| Frontend Framework | React.js |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| API Client | Axios |
| Backend Server | Node.js + Express.js |
| Database | MongoDB |
| Authentication | JWT (jsonwebtoken) |
| Password Security | bcryptjs |
| Forms | React Hooks (useState) |
| Styling | CSS3 (Responsive) |

---

## Project Statistics

- **Backend Controllers**: 12 files (100+ functions)
- **Frontend Components**: 5 pages + 3 components
- **CSS Files**: 6 stylesheets (1000+ lines)
- **API Endpoints**: 40+ routes
- **User Roles**: 7 (admin, doctor, patient, receptionist, nurse, lab_staff, pharmacist)
- **Database Models**: 12 schemas
- **Lines of Code**: 2000+ LOC

---

## Quick Start Guide

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or Atlas connection)
- npm or yarn package manager
- Postman (for API testing)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (if not exists)
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hms
   JWT_SECRET=your_secret_key_here
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run backend server**
   ```bash
   npm start
   # Server will run on http://localhost:5000
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # App will run on http://localhost:5173
   ```

### Testing the Application

1. **Register a new user**
   - Go to http://localhost:5173/register
   - Fill in credentials and select a role
   - Click Register

2. **Login**
   - Go to http://localhost:5173/login
   - Enter registered email and password
   - Dashboard will load with navigation

3. **Navigate features**
   - Click "Patients" to view patient list
   - Click "Doctors" to view doctor list
   - (More features coming soon)

### API Testing with Postman

1. **Register endpoint** (No auth required)
   ```
   POST http://localhost:5000/api/auth/register
   Body: {
     "name": "John Doe",
     "username": "johndoe",
     "email": "john@example.com",
     "password": "password123",
     "role": "patient"
   }
   ```

2. **Login endpoint** (No auth required)
   ```
   POST http://localhost:5000/api/auth/login
   Body: {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Get Patients** (Auth required)
   ```
   GET http://localhost:5000/api/patients
   Headers: Authorization: Bearer <token_from_login>
   ```

4. **Create Patient** (Auth required)
   ```
   POST http://localhost:5000/api/patients
   Headers: Authorization: Bearer <token_from_login>
   Body: {
     "userId": "user_id_from_login",
     "age": 30,
     "gender": "Male",
     "bloodGroup": "O+",
     "emergencyContact": "+1234567890",
     "contactNumber": "+0987654321",
     "currentHealthStatus": "Healthy"
   }
   ```

---

## Common Issues & Solutions

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Try: `mongodb://localhost:27017/hms`

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Change in package.json dev script

### CORS Error
- Backend CORS is configured for `http://localhost:5173`
- If using different port, update in server.js

### Token Not Working
- Clear localStorage in browser DevTools
- Ensure token is being sent in Authorization header
- Check JWT_SECRET in .env matches

---

## Next Steps

### Short Term (Week 1-2)
- [ ] Create Appointments page with booking interface
- [ ] Implement Bills/Payments page
- [ ] Add patient detail page
- [ ] Add doctor detail/profile page
- [ ] Implement search & filter functionality

### Medium Term (Week 3-4)
- [ ] Create admin dashboard
- [ ] Implement role-specific views
- [ ] Add report generation
- [ ] Implement notifications
- [ ] Add file upload for documents

### Long Term (Month 2+)
- [ ] EMR (Electronic Medical Records) system
- [ ] Pharmacy management
- [ ] Lab management system
- [ ] Inventory tracking
- [ ] Analytics & reporting
- [ ] Mobile app (React Native)
- [ ] Deployment & hosting

---

## File Locations Quick Reference

| Feature | Location |
|---------|----------|
| Login Logic | `/client/src/pages/Login.jsx` |
| Register Logic | `/client/src/pages/Register.jsx` |
| Dashboard | `/client/src/pages/Dashboard.jsx` |
| Patients List | `/client/src/pages/Patients.jsx` |
| Doctors List | `/client/src/pages/Doctors.jsx` |
| API Service | `/client/src/services/api.js` |
| Redux Auth | `/client/src/features/auth/authSlice.js` |
| Redux Patients | `/client/src/features/patients/patientSlice.js` |
| Redux Doctors | `/client/src/features/doctors/doctorSlice.js` |
| Routes | `/client/src/routes/AppRoutes.jsx` |
| Auth Routes | `/backend/routes/authRoutes.js` |
| Patient Routes | `/backend/routes/patientRoutes.js` |
| Doctor Routes | `/backend/routes/doctorRoutes.js` |
| Auth Controller | `/backend/controllers/authController.js` |
| Patient Controller | `/backend/controllers/patientController.js` |
| Doctor Controller | `/backend/controllers/doctorController.js` |

---

## Useful Commands

```bash
# Backend
cd backend && npm start                    # Start server
npm run dev                                # Development mode (if configured)
npm test                                   # Run tests (if configured)

# Frontend
cd client && npm run dev                   # Start dev server
npm run build                              # Build for production
npm run preview                            # Preview production build
npm run lint                               # Lint code (if configured)

# Database
# MongoDB
mongod                                     # Start MongoDB daemon
mongo                                      # Connect to MongoDB CLI
```

---

## Contributing

1. Create a new branch for your feature
2. Follow the existing code structure
3. Test your changes thoroughly
4. Update README if adding new features
5. Commit with clear messages

---

## License

This project is licensed under the MIT License.

---

## Support & Contact

For issues, questions, or suggestions:
- Check the LEARNING_SYLLABUS.md for detailed concepts
- Review existing code examples
- Test endpoints with Postman before frontend integration

----------------------------------------------------------------------------------------------------





# Hospital Management System (HMS)

## Tech Stack

### Frontend
- React - UI components
- Redux - Global state management
- React Router - Client-side routing
- Axios - API calls
- Formik + Yup - Form handling and validation
- Recharts - Reports and analytics

### Backend
- Node.js + Express - REST API server
- MongoDB - Database
- JWT - Authentication
- Bcryptjs - Password hashing

---

## Folder Structure

### Backend
```
backend/
├── config/
│   └── db.js
├── controllers/
├── middlewares/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/
├── routes/
├── utils/
├── .env
├── package.json
└── server.js
```

### Frontend
```
client/src/
├── assets/
├── components/
├── features/
├── pages/
├── routes/
├── services/
└── utils/
```

---

## Database Schema

### Users
- name, username, email, password, role, phone, dateOfJoining, isActive

### Patients
- userId, age, gender, bloodGroup, allergies, address, emergencyContact, contactNumber, currentHealthStatus

### Doctors
- userId, specialization, degree, yearsOfExperience, successRate, workingDays, workingHours, consultationFee

### Appointments
- patientId, doctorId, appointmentDate, appointmentTime, status, reason

### Bills
- patientId, doctorId, items[], amount, paymentMode, paymentStatus, paymentDate

### Departments
- name, description, location, totalStaff, headDoctorId

### Admission
- patientId, doctorId, bedId, admissionDate, dischargeDate, status, reason

### Bed
- bedNumber, ward, room, status, patientId

### EMR
- patientId, doctorId, diagnosis, treatment, prescription[], attachments[], notes, visitDate

### Lab
- patientId, doctorId, testName, status, result, reportUrl, requestedDate, completedDate

### Pharmacy
- medicineName, category, manufacturer, stock, price, lowStockAlert, expiryDate

### Staff
- userId, departmentId, role, shift, attendance[], joiningDate

### Review
- patientId, doctorId, rating, feedback, createdAt

### Notification
- userId, message, type, isRead, createdAt

---

## API Routes

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
```

### Patients
```
POST   /api/patients
GET    /api/patients
GET    /api/patients/:id
PUT    /api/patients/:id
DELETE /api/patients/:id
```

### Doctors
```
POST   /api/doctors
GET    /api/doctors
GET    /api/doctors/:id
PUT    /api/doctors/:id
DELETE /api/doctors/:id
```

### Appointments
```
POST   /api/appointments
GET    /api/appointments
GET    /api/appointments/:id
PUT    /api/appointments/:id
DELETE /api/appointments/:id
```

### Bills
```
POST   /api/bills
GET    /api/bills
GET    /api/bills/:id
PUT    /api/bills/:id
DELETE /api/bills/:id
```

### Departments
```
POST   /api/departments
GET    /api/departments
GET    /api/departments/:id
PUT    /api/departments/:id
DELETE /api/departments/:id
```

### Admissions
```
POST   /api/admissions
GET    /api/admissions
GET    /api/admissions/:id
PUT    /api/admissions/:id
```

### Beds
```
POST   /api/beds
GET    /api/beds
GET    /api/beds/available
GET    /api/beds/:id
PUT    /api/beds/:id
DELETE /api/beds/:id
```

### EMR
```
POST   /api/emrs
GET    /api/emrs
GET    /api/emrs/:id
GET    /api/emrs/patient/:patientId
PUT    /api/emrs/:id
DELETE /api/emrs/:id
```

### Lab
```
POST   /api/labs
GET    /api/labs
GET    /api/labs/:id
GET    /api/labs/patient/:patientId
PUT    /api/labs/:id
DELETE /api/labs/:id
```

### Pharmacy
```
POST   /api/pharmacy
GET    /api/pharmacy
GET    /api/pharmacy/lowstock
GET    /api/pharmacy/:id
PUT    /api/pharmacy/:id
DELETE /api/pharmacy/:id
```

### Staff
```
POST   /api/staff
GET    /api/staff
GET    /api/staff/:id
PUT    /api/staff/:id
DELETE /api/staff/:id
```

### Reviews
```
POST   /api/reviews
GET    /api/reviews
GET    /api/reviews/:id
GET    /api/reviews/doctor/:doctorId
DELETE /api/reviews/:id
```

### Notifications
```
POST   /api/notifications
GET    /api/notifications/user/:userId
PUT    /api/notifications/:id/read
DELETE /api/notifications/:id
```

---

## Phase Progress

### Phase 1 - Planning ✅
- Tech stack finalized
- Folder structure built
- Database schemas designed
- API routes planned
- README documented

### Phase 2 - Backend ✅
- MongoDB Atlas connected
- 14 Mongoose models
- 14 Controllers
- 14 Route files
- JWT Authentication
- Bcrypt password hashing
- Auth Middleware
- RBAC Middleware
- ~65 REST API endpoints
- Tested in Postman
- Pushed to GitHub

### Phase 3 - Frontend ⬜ (In Progress)
- React + Vite initialized
- All packages installed
- Folder structure created

---

## Project Statistics
- Models: 14
- Controllers: 14
- Route files: 14
- API Endpoints: ~65
- User Roles: 7
- Middlewares: 2