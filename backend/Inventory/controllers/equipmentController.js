import Equipment from "../models/Equipment.js";

// Add a new equipment
const addequipment = async (req, res) => {
  try {
    const { equipmentName, equipmentId, department, quantity, price } = req.body;
    const newEquipment = new Equipment({
      equipmentName,
      equipmentId,
      department,
      quantity,
      price,
    });
    await newEquipment.save();
    return res.status(200).json({ success: true, equipment: newEquipment });
  } catch (error) {
    return res.status(500).json({ success: false, error: "add equipment server error" });
  }
};

// Get all equipments
const getEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find();
    return res.status(200).json({ success: true, equipments });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get equipment server error" });
  }
};

// Get a single equipment by ID
const getEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).json({ success: false, error: "Equipment not found" });
    }
    return res.status(200).json({ success: true, equipment });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get equipment server error" });
  }
};

// Update an equipment by ID
const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { equipmentName, equipmentId, department, quantity, price } = req.body;

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      { equipmentName, equipmentId, department, quantity, price },
      { new: true }
    );

    if (!updatedEquipment) {
      return res.status(404).json({ success: false, error: "Equipment not found" });
    }

    return res.status(200).json({ success: true, equipment: updatedEquipment });
  } catch (error) {
    return res.status(500).json({ success: false, error: "edit equipment server error" });
  }
};

// Delete an equipment by ID
const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, error: "Equipment ID is required" });
    }

    const deletedEquipment = await Equipment.findByIdAndDelete(id);

    if (deletedEquipment) {
      return res.status(200).json({ success: true, message: "Equipment deleted successfully" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error while deleting equipment" });
  }
};

export { addequipment, getEquipments, getEquipment, updateEquipment, deleteEquipment };