import React from "react";
import { useUser } from "../context/UserContext";

const AdminDetails = () => {
  const { user } = useUser();

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-black">Admin Details</h3>
      <p className="text-black">Name: {user?.name}</p>
      <p className="text-black">type: {user?.type}</p>
    </div>
  );
};

export default AdminDetails;
