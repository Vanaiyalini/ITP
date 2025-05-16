import express from 'express';
import { 
    addLostItem, 
    getLostItems, 
    getLostItem, 
    updateLostItem, 
    deleteLostItem 
} from '../controllers/lostController.js';

const router = express.Router();

// Base route: /api/lostitems

router.route('/')
    .get(getLostItems)        // GET /api/lostitems - Get all lost items
    .post(addLostItem);       // POST /api/lostitems - Add new lost item

router.route('/:id')
    .get(getLostItem)         // GET /api/lostitems/:id - Get single lost item
    .put(updateLostItem)      // PUT /api/lostitems/:id - Update lost item
    .delete(deleteLostItem);  // DELETE /api/lostitems/:id - Delete lost item

export default router;