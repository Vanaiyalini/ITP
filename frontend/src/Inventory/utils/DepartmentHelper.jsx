import { useNavigate } from "react-router-dom";
import axios from "axios";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
];

export const DepartmentButton = ({ id, onDepartmentDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete?");
    if (!confirmDelete) return; // Exit if the user cancels the deletion
  
    try {
      const response = await axios.delete(`http://localhost:4000/api/department/${id}`);
  
      if (response.data.success) {
        onDepartmentDelete(id); // Call the parent function to update the state
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error || 'An error occurred while deleting the department.');
      } else if (error.request) {
        console.error('Network error. Please check your connection.');
      } else {
        console.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="space-x-2">
      <button
        className="bg-[#284b63] hover:bg-[#1a3647] text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate(`/inventoryDashboard/department/${id}`)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleDelete(id)}
      >
        Delete
      </button>
    </div>
  );
};