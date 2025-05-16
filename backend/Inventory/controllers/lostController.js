import LostItem from "../models/Lost.js";

// Get all lost items
const getLostItems = async (req, res) => {
    try {
        const lostItems = await LostItem.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: lostItems });
    } catch (error) {
        console.error('Error fetching lost items:', error);
        return res.status(500).json({ 
            success: false, 
            error: "Server error while fetching lost items" 
        });
    }
};

// Add a new lost item
const addLostItem = async (req, res) => {
    try {
        const { item_name, description, location, date_lost, status } = req.body;
        
        if (!item_name || !location || !date_lost) {
            return res.status(400).json({ 
                success: false, 
                error: "Item name, location, and date lost are required" 
            });
        }

        const newItem = new LostItem({
            item_name,
            description,
            location,
            date_lost,
            status: status || 'lost'
        });

        await newItem.save();
        return res.status(201).json({ success: true, data: newItem });
    } catch (error) {
        console.error('Error adding lost item:', error);
        return res.status(500).json({ 
            success: false, 
            error: "Server error while adding lost item" 
        });
    }
};

// Get a single lost item by ID
const getLostItem = async (req, res) => {
    try {
        const { id } = req.params;
        const lostItem = await LostItem.findById(id);
        
        if (!lostItem) {
            return res.status(404).json({ 
                success: false, 
                error: "Lost item not found" 
            });
        }
        
        return res.status(200).json({ success: true, data: lostItem });
    } catch (error) {
        console.error('Error fetching lost item:', error);
        return res.status(500).json({ 
            success: false, 
            error: "Server error while fetching lost item" 
        });
    }
};

// Update a lost item by ID
const updateLostItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { item_name, description, location, date_lost, status } = req.body;

        const updatedItem = await LostItem.findByIdAndUpdate(
            id,
            { item_name, description, location, date_lost, status },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ 
                success: false, 
                error: "Lost item not found" 
            });
        }

        return res.status(200).json({ success: true, data: updatedItem });
    } catch (error) {
        console.error('Error updating lost item:', error);
        return res.status(500).json({ 
            success: false, 
            error: "Server error while updating lost item" 
        });
    }
};

// Delete a lost item by ID
const deleteLostItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await LostItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ 
                success: false, 
                error: "Lost item not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: { id: deletedItem._id } 
        });
    } catch (error) {
        console.error('Error deleting lost item:', error);
        return res.status(500).json({ 
            success: false, 
            error: "Server error while deleting lost item" 
        });
    }
};

export { 
    addLostItem, 
    getLostItems, 
    getLostItem, 
    updateLostItem, 
    deleteLostItem 
};