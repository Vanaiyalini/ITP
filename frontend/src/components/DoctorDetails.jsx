import React from "react";
import { useUser } from "../context/UserContext";

const DoctorDetails = () => {
  const { user } = useUser();

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-black">Doctor Details</h3>
      <p className="text-black">Name: {user?.name}</p>
      <p className="text-black">Specialization: {user?.specialization}</p>
    </div>
  );
};

export default DoctorDetails;
