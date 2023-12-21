import React from 'react';
import { useNavigate } from "react-router-dom";

function Logout({onLogout}) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Navigate to the login page or any other page you want to redirect to after logout
    onLogout();
    navigate("/");
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
  <h1 className="text-3xl font-bold mb-4">Are you sure you want to logout</h1>
  <button
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
  );
}


export default Logout;