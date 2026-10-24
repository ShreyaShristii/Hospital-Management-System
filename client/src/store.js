import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import patientReducer from './features/patients/patientSlice'
import doctorReducer from './features/doctors/doctorSlice'
import appointmentReducer from './features/appointments/appointmentSlice'
import billReducer from './features/bills/billSlice'
import staffReducer from './features/staff/staffSlice'
import departmentReducer from './features/departments/departmentSlice'
import emrReducer from './features/emr/emrSlice'
import labReducer from './features/lab/labSlice'  
import pharmacyReducer from './features/pharmacy/pharmacySlice'
import admissionReducer from './features/admissions/admissionSlice'
import bedReducer from './features/beds/bedSlice'
import reviewReducer from './features/reviews/reviewSlice'
import notificationReducer from './features/notifications/notificationSlice'


const store = configureStore({
  devTools: import.meta.env.DEV ? {
    actionSanitizer: (action) => {
      if (!action.type.startsWith('auth/') || !action.meta?.arg) return action
      const arg = { ...action.meta.arg }
      for (const field of ['password', 'currentPassword', 'newPassword']) {
        if (field in arg) arg[field] = '[REDACTED]'
      }
      return { ...action, meta: { ...action.meta, arg } }
    },
  } : false,
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    doctors: doctorReducer,
    appointments: appointmentReducer,
    bills: billReducer,
    staff: staffReducer,
    departments: departmentReducer,
    emr: emrReducer,
    lab: labReducer,
    pharmacy: pharmacyReducer,
    admissions: admissionReducer,
    beds: bedReducer,
    reviews: reviewReducer,
    notifications: notificationReducer,
  },
})

export default store