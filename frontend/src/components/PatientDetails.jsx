import React from "react";
import { useUser } from "../context/UserContext";

const PatientDetails = () => {
  const { user } = useUser();

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-black">Patient Details</h3>
      <p className="text-black">Name: {user?.name}</p>
      <p className="text-black">Age: {user?.age}</p>
      <p className="text-black">Gender: {user?.gender}</p>
    </div>
  );
};

export default PatientDetails;
