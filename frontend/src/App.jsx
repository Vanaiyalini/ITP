// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import React from 'react';
// import './App.css';
// import Availability from './Booking/availability';
// import Booking from './Booking/booking';
// import BookingTable from './Booking/bookingTable';
// import Bookingdetails from './Booking/bookingDetails';
// import Home from './user/home';
// import Login from './user/login';
// import { UserProvider } from "./context/UserContext.jsx";

// import AdminDashboard from './user/AdminDashboard';
// import AdminProfile from './user/AdminProfile';

// import MakePayment from './Payments/MakePayment';
// import PayementDetails from './Payments/PayementDetails';
// import Editpayment from './Payments/Editpayment';
// import Mypayments from './Payments/Mypayments';
// import Contact from './ContactUs/Contact';
// import UpdateMessage from './ContactUs/UpdateMessage';
// import Myrequests from './ContactUs/Myrequests';
// import Tickets from './ContactUs/Tickets';

// import InventoryDashboard from './user/inventoryDashboard';
// import PrivateRoutes from './Inventory/utils/privateRoutes';

// import InventorySummary from './Inventory/components/InventorySummary';
// import DepartmentList from './Inventory/components/department/DepartmentList';
// import AddDepartment from './Inventory/components/department/AddDepartment';
// import EditDepartment from './Inventory/components/department/EditDepartment';
// import List from './Inventory/components/Equipments/List';
// import Add from './Inventory/components/Equipments/Add';
// import EditEquipment from './Inventory/components/Equipments/EditEquipment';

// import MedicineList from './Inventory/components/Medicine/MedicineList';
// import AddMedicine from './Inventory/components/Medicine/AddMedicine';
// import EditMedicine from './Inventory/components/Medicine/EditMedicine';

// import LostItemList from './Inventory/components/Lost/LostItemList';
// import AddLostItem from './Inventory/components/Lost/AddLostItem';
// import EditLostItem from './Inventory/components/Lost/EditLostItem';

// import Profile from './user/Profile';
// import ScheduleAdd from './Booking/ScheduleAdd';

// import PatientDashboard from "./pages/PatientDashboard";
// import PatientRecords from "./pages/PatientRecords";
// import AdminRecords from "./pages/AdminRecords";
// import DoctorRecords from "./pages/DoctorRecords";
// import MedicalRecord from "./pages/MedicalRecord";
// import DoctorDashboard from "./pages/DoctorDashboard";
// import AdminDashboardMedical from "./pages/AdminDashboard";
// import AddMedicalReport from "./pages/AddMedicalReport";
// import EditMedicalReport from "./pages/EditMedicalReport";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/availability" element={<Availability />} />
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />

//         <Route path="/booking" element={<Booking />} />
//         <Route path="/bookingTable" element={<BookingTable />} />
//         <Route path="/bookingdetails" element={<Bookingdetails />} />

//         <Route path="/AdminDashboard" element={<AdminDashboard />} />
//         <Route path="/AdminProfile" element={<AdminProfile />} />

//         <Route path="/MakePayment" element={<MakePayment />} />
//         <Route path="/PayementDetails" element={<PayementDetails />} />
//         <Route path="/Editpayment/:id" element={<Editpayment />} />
//         <Route path="/Mypayments" element={<Mypayments />} />

//         <Route path="/Contact" element={<Contact />} />
//         <Route path="/UpdateMessage/:id" element={<UpdateMessage />} />
//         <Route path="/Myrequests" element={<Myrequests />} />
//         <Route path="/Tickets" element={<Tickets />} />
//         <Route path="/ScheduleAdd" element={<ScheduleAdd />} />

//         <Route path="/Profile" element={<Profile />} />

//         {/* Inventory Routes */}
//         <Route path="/InventoryDashboard" element={
//           <PrivateRoutes>
//             <InventoryDashboard />
//           </PrivateRoutes>
//         }>
//           <Route index element={<InventorySummary />} />
//           <Route path="department" element={<DepartmentList />} />
//           <Route path="adddepartment" element={<AddDepartment />} />
//           <Route path="department/:id" element={<EditDepartment />} />
          
//           <Route path="equipments" element={<List />} />
//           <Route path="addequipment" element={<Add />} />
//           <Route path="edit-equipment/:id" element={<EditEquipment />} />
          
//           <Route path="medicine" element={<MedicineList />} />
//           <Route path="addmedicine" element={<AddMedicine />} />
//           <Route path="medicine/:id" element={<EditMedicine />} />
          
//           <Route path="lostitems" element={<LostItemList />} />
//           <Route path="addlostitem" element={<AddLostItem />} />
//           <Route path="lostitems/:id" element={<EditLostItem />} />


//         </Route>

//         {/* Redirect for unmatched routes */}
//         <Route path="*" element={<Navigate to="/" />} />
//         <UserProvider>
//         <Route path="/patient-dashboard" element={<PatientDashboard />} />
//         <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
//         <Route path="/admin-dashboard" element={<AdminDashboardMedical />} />
//         <Route path="/patient-records" element={<PatientRecords />} />
//         <Route path="/admin-records" element={<AdminRecords />} />
//         <Route path="/doctor-records" element={<DoctorRecords />} />
//         <Route path="/medical-record/:id" element={<MedicalRecord />} />
//         <Route path="/add-report" element={<AddMedicalReport />} />
//         </UserProvider>
//         <Route
//           path="/medical-report/edit/:id"
//           element={<EditMedicalReport />}/>


//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import './App.css';
import Availability from './Booking/availability';
import Booking from './Booking/Booking';
import BookingTable from './Booking/bookingTable';
import Bookingdetails from './Booking/bookingDetails';
import Home from './user/home';
import Login from './user/Login';
import { UserProvider } from "./context/UserContext";

import AdminDashboard from './user/AdminDashboard';
import AdminProfile from './user/AdminProfile';

import UserDetails from './user/UserDetails';
import MakePayment from './Payments/MakePayment';
import PayementDetails from './Payments/PayementDetails';
import Editpayment from './Payments/Editpayment';
import AdminPay from './Payments/AdminPay';
import Mypayments from './Payments/Mypayments';
import Contact from './ContactUs/Contact';
import UpdateMessage from './ContactUs/UpdateMessage';
import Myrequests from './ContactUs/Myrequests';
import Tickets from './ContactUs/Tickets';
import Admincheck from './ContactUs/Admincheck';

import InventoryDashboard from './user/inventoryDashboard';
import PrivateRoutes from './Inventory/utils/privateRoutes';

import InventorySummary from './Inventory/components/InventorySummary';
import DepartmentList from './Inventory/components/department/DepartmentList';
import AddDepartment from './Inventory/components/department/AddDepartment';
import EditDepartment from './Inventory/components/department/EditDepartment';
import List from './Inventory/components/Equipments/List';
import Add from './Inventory/components/Equipments/Add';
import EditEquipment from './Inventory/components/Equipments/EditEquipment';

import MedicineList from './Inventory/components/Medicine/MedicineList';
import AddMedicine from './Inventory/components/Medicine/AddMedicine';
import EditMedicine from './Inventory/components/Medicine/EditMedicine';

import LostItemList from './Inventory/components/Lost/LostItemList';
import AddLostItem from './Inventory/components/Lost/AddLostItem';
import EditLostItem from './Inventory/components/Lost/EditLostItem';

import Profile from './user/Profile';
import ScheduleAdd from './Booking/ScheduleAdd';


import PatientDashboard from "./pages/PatientDashboard";
import PatientRecords from "./pages/PatientRecords";
import AdminRecords from "./pages/AdminRecords";
import DoctorRecords from "./pages/DoctorRecords";
import MedicalRecord from "./pages/MedicalRecord";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboardMedical from "./pages/AdminDashboard";
import AddMedicalReport from "./pages/AddMedicalReport";
import EditMedicalReport from "./pages/EditMedicalReport";



function App() {
  return (
    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/availability" element={<Availability />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/booking" element={<Booking />} />
        <Route path="/bookingTable" element={<BookingTable />} />
        <Route path="/bookingdetails" element={<Bookingdetails />} />

        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminProfile" element={<AdminProfile />} />

        <Route path="/MakePayment" element={<MakePayment />} />
        <Route path="/PayementDetails" element={<PayementDetails />} />
        <Route path="/Editpayment/:id" element={<Editpayment />} />
        <Route path="/AdminPay/:id" element={<AdminPay />} />
        <Route path="/Mypayments" element={<Mypayments />} />

        <Route path="/Contact" element={<Contact />} />
        <Route path="/UpdateMessage/:id" element={<UpdateMessage />} />
        <Route path="/Myrequests" element={<Myrequests />} />
        <Route path="/Tickets" element={<Tickets />} />
        <Route path="/ScheduleAdd" element={<ScheduleAdd />} />
        <Route path="/Admincheck" element={<Admincheck />} />

        <Route path="/Profile" element={<Profile />} />
        <Route path="/UserDetails" element={<UserDetails />} />
        

        {/* Inventory Routes */}
        <Route path="/InventoryDashboard" element={
          <PrivateRoutes>
            <InventoryDashboard />
          </PrivateRoutes>
        }>
          <Route index element={<InventorySummary />} />
          <Route path="department" element={<DepartmentList />} />
          <Route path="adddepartment" element={<AddDepartment />} />
          <Route path="department/:id" element={<EditDepartment />} />
          
          <Route path="equipments" element={<List />} />
          <Route path="addequipment" element={<Add />} />
          <Route path="edit-equipment/:id" element={<EditEquipment />} />
          
          <Route path="medicine" element={<MedicineList />} />
          <Route path="addmedicine" element={<AddMedicine />} />
          <Route path="medicine/:id" element={<EditMedicine />} />
          
          <Route path="lostitems" element={<LostItemList />} />
          <Route path="addlostitem" element={<AddLostItem />} />
          <Route path="lostitems/:id" element={<EditLostItem />} />
        </Route>

        {/* Redirect for unmatched routes */}
        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboardMedical />} />
          <Route path="/patient-records" element={<PatientRecords />} />
          <Route path="/admin-records" element={<AdminRecords />} />
          <Route path="/doctor-records" element={<DoctorRecords />} />
          <Route path="/medical-record/:id" element={<MedicalRecord />} />
          <Route path="/add-report" element={<AddMedicalReport />} />
          <Route path="/medical-report/edit/:id" element={<EditMedicalReport />} />
      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;
