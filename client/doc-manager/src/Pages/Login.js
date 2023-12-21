
import ProcessApi from "../API/DBAPI";
import { useNavigate } from "react-router-dom";
import React, { useState,useEffect } from 'react';

function Login({ onLogin }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(undefined);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/list_documents"); // Redirect to the login page if not authenticated
      
    }
    
  }, []);
  const loginUser = async (event) => {
    if (event) {
      event.preventDefault();
    }
    if (username === "") {
      return setError("You must enter a username.");
    }
    if (password === "") {
      return setError("You must enter a password.");
    }
  
    try {
      let response = await ProcessApi.LoginUser({
        username,
        password
      });
      if (response.data && response.data.success === false) {
        return setError(response.data.message);
      } else if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        onLogin();
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while creating your account.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 class="text-2xl font-bold mb-4">Login User</h2>
    <form onSubmit={loginUser} class="flex flex-col">
      <label htmlFor="username">Email:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={(event) =>
          setUserName(event.target.value )
        }
        required
        min="1"
        class="mb-4 rounded border border-gray-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        required
        min="1"
        class="mb-4 rounded border border-gray-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-auto"
        type="submit">
        Login
      </button>
    </form>
  </div>
      
  );
}

export default Login;