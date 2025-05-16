import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { columns, MedicineButton } from '../../utils/MedicineHelper';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { 
    fontSize: 20, 
    marginBottom: 20, 
    textAlign: 'center',
    textDecoration: 'underline'
  },
  table: { display: "flex", width: "100%", borderStyle: "solid" },
  row: { flexDirection: "row" },
  cell: { 
    borderStyle: "solid", 
    borderWidth: 1, 
    padding: 5, 
    width: "16%",
    fontSize: 10 
  },
  titleCell: {
    borderStyle: "solid", 
    borderWidth: 1, 
    padding: 5, 
    width: "16%",
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0'
  }
});

// PDF Document Component
const MedicinesPDF = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Medicine Inventory Report</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.titleCell}>S.No</Text>
          <Text style={styles.titleCell}>Medicine Name</Text>
          <Text style={styles.titleCell}>Description</Text>
          <Text style={styles.titleCell}>Price</Text>
          <Text style={styles.titleCell}>Quantity</Text>
        </View>
        {data.map((item, index) => (
          <View style={styles.row} key={item._id}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{item.med_name}</Text>
            <Text style={styles.cell}>{item.description}</Text>
            <Text style={styles.cell}>{item.price}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
          </View>
        ))}
      </View>
      <Text style={{ marginTop: 30, fontSize: 10 }}>
        Generated on: {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Function to handle medicine deletion
  const onMedicineDelete = async (id) => {
    const data = medicines.filter((med) => med._id !== id);
    setMedicines(data);
  };

  // Fetch medicines from the API
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('http://localhost:4000/api/medicine');

        if (response.data.success) {
          let sno = 1;
          const formattedData = response.data.medicines.map((med) => ({
            _id: med._id,
            sno: sno++,
            med_name: med.med_name,
            description: med.description,
            price: med.price,
            quantity: med.quantity,
            action: (
              <MedicineButton
                id={med._id}
                onMedicineDelete={onMedicineDelete}
              />
            ),
          }));
          setMedicines(formattedData);
        }
      } catch (error) {
        if (error.response) {
          setError(
            error.response.data.error ||
              'An error occurred while fetching medicines.'
          );
        } else if (error.request) {
          setError('Network error. Please check your connection.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.med_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <>
          <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Medicines</h3>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by Medicine Name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <PDFDownloadLink 
                document={<MedicinesPDF data={filteredMedicines} />} 
                fileName="medicines_report.pdf"
                className="px-4 py-2 bg-black rounded text-white hover:bg-black transition-colors text-center"
              >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
              </PDFDownloadLink>
              <Link
                to="/inventoryDashboard/addmedicine"
                className="px-4 py-2 bg-teal-600 rounded text-white hover:bg-teal-700 transition-colors text-center"
              >
                Add New Medicine
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <DataTable
              columns={columns}
              data={filteredMedicines}
              pagination
              highlightOnHover
              responsive
              noDataComponent={<div className="py-4">No medicines found.</div>}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MedicineList;