const express = require('express');
const router = express.Router();
const {
  addEMR, getAllEMRs, getEMRById, updateEMR, deleteEMR
} = require('../controllers/emrController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.post('/',     authorize('doctor'), addEMR);
router.get('/',      authorize('doctor', 'patient', 'admin', 'nurse', 'pharmacist', 'lab_staff'), getAllEMRs);
router.get('/:id',   authorize('doctor', 'patient', 'admin', 'nurse', 'pharmacist', 'lab_staff'), getEMRById);
router.put('/:id',   authorize('doctor'), updateEMR);
router.delete('/:id', authorize('admin'), deleteEMR);

module.exports = router;