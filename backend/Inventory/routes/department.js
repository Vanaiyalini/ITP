import express from 'express';
import { addDepartment, getDepartment ,GetDepartment, updateDepartment,deleteDepartment} from '../controllers/departmentController.js';

const router = express.Router();

router.post('/add', addDepartment);
router.get('/', getDepartment);
router.get('/:id', GetDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;