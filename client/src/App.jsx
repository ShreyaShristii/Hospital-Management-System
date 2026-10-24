import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import PrivateRoute from './routes/PrivateRoute'
import RoleRoute from './routes/RoleRoute'
import UnauthorizedPage from './pages/UnauthorizedPage'
import PatientsPage from './pages/PatientsPage'
import DoctorsPage from './pages/DoctorsPage'
import StaffManagementPage from './pages/admin/StaffManagementPage'
import AppointmentsPage from './pages/AppointmentsPage'
import BillsPage from './pages/BillsPage'
import EMRPage from './pages/EMRPage'
import LabPage from './pages/LabPage'
import PharmacyPage from './pages/PharmacyPage'
import BedsPage from './pages/BedsPage'
import AdmissionsPage from './pages/AdmissionsPage'
import DepartmentsPage from './pages/DepartmentsPage'
import ProfilePage from './pages/ProfilePage'
import PatientProfilePage from './pages/PatientProfilePage'
import DoctorProfilePage from './pages/DoctorProfilePage'
import StaffProfilePage from './pages/StaffProfilePage'
import ReviewsPage from './pages/ReviewsPage'
import NotificationsPage from './pages/NotificationsPage'
import NotFoundPage from './pages/NotFoundPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Dashboard — all authenticated roles */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />

        {/* Appointments — all roles, each sees their own filtered view */}
        <Route path="/appointments" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['patient', 'doctor', 'receptionist', 'admin']}>
              <AppointmentsPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* Patients — admin, receptionist, and doctor */}
        <Route path="/patients" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['admin', 'receptionist', 'doctor']}>
              <PatientsPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* Doctors — admin and receptionist only */}
        <Route path="/doctors" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['admin', 'receptionist']}>
              <DoctorsPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* Staff management — admin only */}
        <Route path="/staff" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['admin']}>
              <StaffManagementPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* Bills — all roles, each sees their own filtered view */}
        <Route path="/bills" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['patient', 'doctor', 'receptionist', 'admin']}>
              <BillsPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* EMR — all roles, each sees their own filtered view */}
        <Route path="/emr" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['patient', 'doctor', 'receptionist', 'admin']}>
              <EMRPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* Lab — all roles, each sees their own filtered view */}
        <Route path="/lab" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['patient', 'doctor', 'nurse', 'admin', 'lab_staff']}>
              <LabPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* Pharmacy — all roles, each sees their own filtered view */}
        <Route path="/pharmacy" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['nurse', 'doctor', 'pharmacist', 'admin']}>
              <PharmacyPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        

        {/* Beds — admin and receptionist only */}
        <Route path="/beds" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['admin', 'receptionist']}>
              <BedsPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* Departments — admin only */}
        <Route path="/departments" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['admin']}>
              <DepartmentsPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* Admissions — receptionist and admin only */}
        <Route path="/admissions" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['admin', 'receptionist', 'nurse']}>
              <AdmissionsPage />
            </RoleRoute>
          </PrivateRoute>
        } />

        {/* Profile Pages */}
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />

        <Route path="/patient-profile" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['patient']}>
              <PatientProfilePage />
            </RoleRoute>
          </PrivateRoute>
        } />

        <Route path="/doctor-profile" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['doctor']}>
              <DoctorProfilePage />
            </RoleRoute>
          </PrivateRoute>
        } />

        <Route path="/staff-profile" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['receptionist', 'nurse', 'lab_staff', 'pharmacist']}>
              <StaffProfilePage />
            </RoleRoute>
          </PrivateRoute>
        } />

        <Route path="/reviews" element={
          <PrivateRoute>
            <ReviewsPage />
          </PrivateRoute>
        } />

        <Route path="/notifications" element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App