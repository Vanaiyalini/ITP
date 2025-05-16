import express from 'express';
import { addMedicine, getMedicine, GetMedicine, updateMedicine, deleteMedicine } from '../controllers/medicineController.js';

const router = express.Router();

// Route to add a new medicine
router.post('/add', addMedicine);

// Route to get all medicines
router.get('/', getMedicine);

// Route to get a single medicine by ID
router.get('/:id', GetMedicine);

// Route to update a medicine by ID
router.put('/:id', updateMedicine);

// Route to delete a medicine by ID
router.delete('/:id', deleteMedicine);

export default router;