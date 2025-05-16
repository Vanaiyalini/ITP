import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { columns, EquipmentButton } from '../../utils/EquipmentHelper';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Enhanced PDF Styles
const styles = StyleSheet.create({
  page: { 
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: { 
    fontSize: 18, 
    marginBottom: 20, 
    textAlign: 'center',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  table: { 
    display: "table", 
    width: "100%", 
    borderStyle: "solid",
    borderWidth: 1,
    borderCollapse: "collapse"
  },
  tableRow: { 
    flexDirection: "row" 
  },
  tableHeader: {
    borderStyle: "solid", 
    borderWidth: 1, 
    padding: 5, 
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6'
  },
  tableCell: { 
    borderStyle: "solid", 
    borderWidth: 1, 
    padding: 5, 
    fontSize: 10 
  },
  footer: {
    marginTop: 30, 
    fontSize: 10,
    textAlign: 'right'
  }
});

// Updated PDF Document Component to match your columns
const EquipmentPDF = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Equipment Inventory Report</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, {width: '8%'}]}>S.No</Text>
          <Text style={[styles.tableHeader, {width: '22%'}]}>Equipment Name</Text>
          <Text style={[styles.tableHeader, {width: '15%'}]}>Equipment ID</Text>
          <Text style={[styles.tableHeader, {width: '20%'}]}>Department</Text>
          <Text style={[styles.tableHeader, {width: '15%'}]}>Price</Text>
          <Text style={[styles.tableHeader, {width: '10%'}]}>Quantity</Text>
        </View>
        {data.map((item, index) => (
          <View style={styles.tableRow} key={item._id}>
            <Text style={[styles.tableCell, {width: '8%'}]}>{index + 1}</Text>
            <Text style={[styles.tableCell, {width: '22%'}]}>{item.equipmentName}</Text>
            <Text style={[styles.tableCell, {width: '15%'}]}>{item.equipmentId}</Text>
            <Text style={[styles.tableCell, {width: '20%'}]}>{item.department}</Text>
            <Text style={[styles.tableCell, {width: '15%'}]}>${item.price?.toFixed(2)}</Text>
            <Text style={[styles.tableCell, {width: '10%'}]}>{item.quantity}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.footer}>
        Generated on: {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

const EquipmentList = () => {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const onEquipmentDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this equipment?')) {
            try {
                const response = await axios.delete(`http://localhost:4000/api/equipment/${id}`);
                if (response.data.success) {
                    setEquipments(equipments.filter((equip) => equip._id !== id));
                    setTotalRows(totalRows - 1);
                    alert('Equipment deleted successfully');
                }
            } catch (error) {
                setError(error.response?.data?.error || 'Failed to delete equipment');
            }
        }
    };

    const fetchEquipments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/api/equipment', {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchTerm
                }
            });
            
            if (response.data.success) {
                const formattedData = response.data.equipments.map((equip, index) => ({
                    ...equip,
                    sno: (currentPage - 1) * itemsPerPage + index + 1,
                    action: (
                        <EquipmentButton
                            id={equip._id}
                            onEquipmentDelete={onEquipmentDelete}
                        />
                    ),
                }));
                setEquipments(formattedData);
                setTotalRows(response.data.totalCount || response.data.equipments.length);
            }
        } catch (error) {
            setError(
                error.response?.data?.error ||
                'An error occurred while fetching equipment'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipments();
    }, [currentPage, searchTerm]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="p-4">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Manage Equipment</h3>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search equipment..."
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <PDFDownloadLink 
                        document={<EquipmentPDF data={equipments} />} 
                        fileName="equipment_report.pdf"
                        className="px-4 py-2 bg-black rounded text-white hover:bg-gray-800 transition-colors text-center"
                    >
                        {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                    </PDFDownloadLink>
                    
                    <Link
                        to="/InventoryDashboard/addequipment"
                        className="px-4 py-2 bg-teal-600 rounded text-white hover:bg-teal-700 transition-colors text-center"
                    >
                        Add New Equipment
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <DataTable
                    columns={columns}
                    data={equipments}
                    progressPending={loading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    paginationPerPage={itemsPerPage}
                    paginationDefaultPage={currentPage}
                    onChangePage={handlePageChange}
                    highlightOnHover
                    responsive
                    noDataComponent={
                        <div className="py-8 text-center text-gray-500">
                            {searchTerm ? 'No matching equipment found' : 'No equipment available'}
                        </div>
                    }
                    customStyles={{
                        headCells: {
                            style: {
                                fontWeight: 'bold',
                                backgroundColor: '#f3f4f6',
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default EquipmentList;