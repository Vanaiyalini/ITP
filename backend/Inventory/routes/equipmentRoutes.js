import express from 'express';
import { addequipment, getEquipments, getEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/add', upload.single('image'), addequipment);



router.post('/add', addequipment);
router.get('/', getEquipments);
router.get('/:id', getEquipment);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

export default router;