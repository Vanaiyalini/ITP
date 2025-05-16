import { useNavigate } from "react-router-dom";
import axios from "axios";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
  },
  {
    name: "Item Name",
    selector: (row) => row.item_name,
  },
  {
    name: "Description",
    selector: (row) => row.description,
  },
  {
    name: "Location",
    selector: (row) => row.location,
  },
  {
    name: "Date Lost",
    selector: (row) => row.date_lost,
    cell: row => new Date(row.date_lost).toLocaleDateString(),
  },
  {
    name: "Status",
    selector: (row) => row.status,
    cell: row => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        row.status === 'lost' ? 'bg-yellow-100 text-yellow-800' :
        row.status === 'found' ? 'bg-green-100 text-green-800' :
        'bg-blue-100 text-blue-800'
      }`}>
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </span>
    ),
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
];

export const LostItemButton = ({ id, onLostItemDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete this lost item record?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:4000/api/lostitems/${id}`);

      if (response.data.success) {
        onLostItemDelete(id);
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.error || 'An error occurred while deleting the lost item.');
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
        onClick={() => navigate(`/inventoryDashboard/lostitems/${id}`)}
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