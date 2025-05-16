import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { columns, DepartmentButton } from '../../utils/DepartmentHelper';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: { 
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: { 
    fontSize: 20, 
    marginBottom: 20, 
    textAlign: 'center',
    textDecoration: 'underline',
    fontWeight: 'bold'
  },
  table: { 
    display: "flex", 
    width: "100%", 
    borderStyle: "solid",
    borderWidth: 1
  },
  row: { 
    flexDirection: "row" 
  },
  cell: { 
    borderStyle: "solid", 
    borderWidth: 1, 
    padding: 5, 
    width: "50%",
    fontSize: 12 
  },
  headerCell: {
    borderStyle: "solid", 
    borderWidth: 1, 
    padding: 5, 
    width: "50%",
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0'
  }
});

// PDF Document Component
const DepartmentsPDF = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Department Management Report</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.headerCell}>S.No</Text>
          <Text style={styles.headerCell}>Department Name</Text>
        </View>
        {data.map((item, index) => (
          <View style={styles.row} key={item._id}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{item.dep_name}</Text>
          </View>
        ))}
      </View>
      <Text style={{ 
        marginTop: 30, 
        fontSize: 10,
        textAlign: 'right'
      }}>
        Generated on: {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const onDepartmentDelete = async(id) => {
    const data = departments.filter(dep => dep._id !== id)
    setDepartments(data)
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:4000/api/department');
  
        if (response.data.success) {
          let sno = 1;
          const formattedData = response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: (
              <DepartmentButton
                id={dep._id}
                onDepartmentDelete={onDepartmentDelete}
              />
            ),
          }));
          setDepartments(formattedData);
        }
      } catch (error) {
        if (error.response) {
          setError(
            error.response.data.error ||
            'An error occurred while fetching departments.'
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
  
    fetchDepartments();
  }, []);

  // Filter departments based on search term
  const filteredDepartments = departments.filter((department) =>
    department.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h3 className="text-2xl font-bold">Manage Departments</h3>
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
                placeholder="Search by Department Name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <PDFDownloadLink 
                document={<DepartmentsPDF data={filteredDepartments} />} 
                fileName="departments_report.pdf"
                className="px-4 py-2 bg-black rounded text-white hover:bg-gray-800 transition-colors text-center"
              >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
              </PDFDownloadLink>
              <Link
                to="/inventoryDashboard/adddepartment"
                className="px-4 py-2 bg-teal-600 rounded text-white hover:bg-teal-700 transition-colors text-center"
              >
                Add New Department
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <DataTable
              columns={columns}
              data={filteredDepartments}
              pagination
              highlightOnHover
              responsive
              noDataComponent={<div className="py-4">No departments found.</div>}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DepartmentManagement;