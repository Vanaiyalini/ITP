import Department from "../models/Department.js";

// Get all departments
const getDepartment = async (req, res) => {
    try {
        console.log('Fetching departments...');
        const departments = await Department.find();
        console.log('Departments fetched:', departments);
        return res.status(200).json({ success: true, departments });
    } catch (error) {
        console.error('Error fetching departments:', error);
        return res.status(500).json({ success: false, error: "get department server error" });
    }
};

// Add a new department
const addDepartment = async (req, res) => {
    try {
        const { dep_name, description } = req.body;
        const newDep = new Department({
            dep_name,
            description
        });
        await newDep.save();
        return res.status(200).json({ success: true, Department: newDep });
    } catch (error) {
        return res.status(500).json({ success: false, error: "add department server error" });
    }
};

// Get a single department by ID
const GetDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findById(id); // Corrected: Use `id` directly
        if (!department) {
            return res.status(404).json({ success: false, error: "Department not found" });
        }
        return res.status(200).json({ success: true, department }); // Corrected: Return `department`
    } catch (error) {
        console.error('Error fetching department:', error);
        return res.status(500).json({ success: false, error: "get department server error" });
    }
};

// Update a department by ID
const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { dep_name, description } = req.body;

        // Corrected: Use `findByIdAndUpdate` with the correct parameters
        const updatedDepartment = await Department.findByIdAndUpdate(
            id,
            { dep_name, description },
            { new: true } // Return the updated document
        );

        if (!updatedDepartment) {
            return res.status(404).json({ success: false, error: "Department not found" });
        }

        return res.status(200).json({ success: true, department: updatedDepartment });
    } catch (error) {
        console.error('Error updating department:', error);
        return res.status(500).json({ success: false, error: "edit department server error" });
    }
};


const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the ID is valid
        if (!id) {
            return res.status(400).json({ success: false, error: "Department ID is required" });
        }

        // Delete the department by ID
        const deletedDepartment = await Department.findByIdAndDelete(id);

        if (deletedDepartment) {
            return res.status(200).json({ success: true, message: "Department deleted successfully" });
        }

    } catch (error) {
        console.error('Error deleting department:', error);
        return res.status(500).json({ success: false, error: "Server error while deleting department" });
    }
};
export { addDepartment, getDepartment, GetDepartment, updateDepartment, deleteDepartment };