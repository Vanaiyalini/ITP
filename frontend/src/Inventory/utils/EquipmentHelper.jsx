import { useNavigate } from "react-router-dom";
import axios from "axios";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    sortable: true,
    width: "80px"
  },
  {
    name: "Equipment Name",
    selector: (row) => row.equipmentName,
    sortable: true
  },
  {
    name: "Equipment ID",
    selector: (row) => row.equipmentId,
    sortable: true
  },
  {
    name: "Department",
    selector: (row) => row.department,
    sortable: true
  },
  {
    name: "Price",
    selector: (row) => `$${row.price?.toFixed(2)}`,
    sortable: true,
    right: true
  },
  {
    name: "Quantity",
    selector: (row) => row.quantity,
    sortable: true,
    right: true
  },
  {
    name: "Actions",
    selector: (row) => row.action,
    width: "180px"
  }
];

export const EquipmentButton = ({ id, onEquipmentDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this equipment?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:4000/api/equipment/${id}`);
      if (response.data.success) {
        onEquipmentDelete(id);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete equipment');
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm"
        onClick={() => navigate(`/inventoryDashboard/edit-equipment/${id}`)}
      >
        Edit
      </button>
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded text-sm"
        onClick={() => handleDelete(id)}
      >
        Delete
      </button>
    </div>
  );
};