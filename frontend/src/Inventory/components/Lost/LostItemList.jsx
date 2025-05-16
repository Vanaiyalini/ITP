import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { columns, LostItemButton } from '../../utils/LostItemHelper';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  table: { display: "flex", width: "100%", borderStyle: "solid" },
  row: { flexDirection: "row" },
  cell: { 
    borderStyle: "solid", 
    borderWidth: 1, 
    padding: 5, 
    width: "16%",
    fontSize: 10 
  },
  statusCell: {
    borderStyle: "solid", 
    borderWidth: 1, 
    padding: 5, 
    width: "16%",
    fontSize: 10,
    backgroundColor: '#f0f0f0'
  }
});

// PDF Document Component
const LostItemsPDF = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Lost Items Report</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>S.No</Text>
          <Text style={styles.cell}>Item Name</Text>
          <Text style={styles.cell}>Description</Text>
          <Text style={styles.cell}>Location</Text>
          <Text style={styles.cell}>Date Lost</Text>
          <Text style={styles.cell}>Status</Text>
        </View>
        {data.map((item, index) => (
          <View style={styles.row} key={item._id}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{item.item_name}</Text>
            <Text style={styles.cell}>{item.description}</Text>
            <Text style={styles.cell}>{item.location}</Text>
            <Text style={styles.cell}>{item.date_lost}</Text>
            <Text style={styles.statusCell}>{item.status}</Text>
          </View>
        ))}
      </View>
      <Text style={{ marginTop: 30, fontSize: 10 }}>
        Generated on: {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

const LostItemList = () => {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Function to handle lost item deletion
  const onLostItemDelete = async (id) => {
    const data = lostItems.filter((item) => item._id !== id);
    setLostItems(data);
  };

  // Fetch lost items from the API
  useEffect(() => {
    const fetchLostItems = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('http://localhost:4000/api/lostitems');

        if (response.data.success) {
          let sno = 1;
          const formattedData = response.data.data.map((item) => ({
            _id: item._id,
            sno: sno++,
            item_name: item.item_name,
            description: item.description,
            location: item.location,
            date_lost: new Date(item.date_lost).toLocaleDateString(),
            status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            action: (
              <LostItemButton
                id={item._id}
                onLostItemDelete={onLostItemDelete}
              />
            ),
          }));
          setLostItems(formattedData);
        }
      } catch (error) {
        if (error.response) {
          setError(
            error.response.data.error ||
            'An error occurred while fetching lost items.'
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

    fetchLostItems();
  }, []);

  // Filter lost items based on search term
  const filteredLostItems = lostItems.filter((item) =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h3 className="text-2xl font-bold">Manage Lost Items</h3>
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
                placeholder="Search by Item Name, Location or Status"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <PDFDownloadLink 
                document={<LostItemsPDF data={filteredLostItems} />} 
                fileName="lost_items_report.pdf"
                className="px-4 py-2 bg-black rounded text-white hover:bg-black transition-colors text-center"
              >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
              </PDFDownloadLink>
              <Link
                to="/inventoryDashboard/addlostitem"
                className="px-4 py-2 bg-teal-600 rounded text-white hover:bg-teal-700 transition-colors text-center"
              >
                Add New Lost Item
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <DataTable
              columns={columns}
              data={filteredLostItems}
              pagination
              highlightOnHover
              responsive
              noDataComponent={<div className="py-4">No lost items found.</div>}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LostItemList;