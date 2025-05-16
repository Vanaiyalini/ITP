import Medicine from "../models/Medicine.js";

// Get all medicines
const getMedicine = async (req, res) => {
    try {
        console.log('Fetching medicines...');
        const medicines = await Medicine.find();
        console.log('Medicines fetched:', medicines);
        return res.status(200).json({ success: true, medicines });
    } catch (error) {
        console.error('Error fetching medicines:', error);
        return res.status(500).json({ success: false, error: "get medicine server error" });
    }
};

// Add a new medicine
const addMedicine = async (req, res) => {
    try {
        const { med_name, description, price, quantity } = req.body;
        const newMed = new Medicine({
            med_name,
            description,
            price,
            quantity
        });
        await newMed.save();
        return res.status(200).json({ success: true, Medicine: newMed });
    } catch (error) {
        return res.status(500).json({ success: false, error: "add medicine server error" });
    }
};

// Get a single medicine by ID
const GetMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.findById(id); // Corrected: Use `id` directly
        if (!medicine) {
            return res.status(404).json({ success: false, error: "Medicine not found" });
        }
        return res.status(200).json({ success: true, medicine }); // Corrected: Return `medicine`
    } catch (error) {
        console.error('Error fetching medicine:', error);
        return res.status(500).json({ success: false, error: "get medicine server error" });
    }
};

// Update a medicine by ID
const updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const { med_name, description, price, quantity } = req.body;

        // Corrected: Use `findByIdAndUpdate` with the correct parameters
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            id,
            { med_name, description, price, quantity },
            { new: true } // Return the updated document
        );

        if (!updatedMedicine) {
            return res.status(404).json({ success: false, error: "Medicine not found" });
        }

        return res.status(200).json({ success: true, medicine: updatedMedicine });
    } catch (error) {
        console.error('Error updating medicine:', error);
        return res.status(500).json({ success: false, error: "edit medicine server error" });
    }
};

// Delete a medicine by ID
const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the ID is valid
        if (!id) {
            return res.status(400).json({ success: false, error: "Medicine ID is required" });
        }

        // Delete the medicine by ID
        const deletedMedicine = await Medicine.findByIdAndDelete(id);

        if (deletedMedicine) {
            return res.status(200).json({ success: true, message: "Medicine deleted successfully" });
        }

    } catch (error) {
        console.error('Error deleting medicine:', error);
        return res.status(500).json({ success: false, error: "Server error while deleting medicine" });
    }
};

export { addMedicine, getMedicine, GetMedicine, updateMedicine, deleteMedicine };