
import ProcessApi from "../API/DBAPI";
import React, { useState} from 'react';
import { useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [name, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(undefined);
  const createUser = async (event) => {
    if (event) {
      event.preventDefault();
    }
  
    if (email === "") {
      return setError("You must enter your email.");
    }
    if (name === "") {
      return setError("You must enter a username.");
    }
    if (password === "") {
      return setError("You must enter a password.");
    }
  
    try {
      let response = await ProcessApi.CreateUser({
        email,
        name,
        password
      });
      if (response.data && response.data.success === false) {
        return setError(response.data.message);
      } else if (response.data ) {
        console.log('onRegister called');
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while creating your account.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 class="text-2xl font-bold mb-4">Register User</h2>
    <form onSubmit={createUser} class="flex flex-col">
      
      <label htmlFor="email">Email:</label>
      <input
        type="text"
        id="email"
        name="email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        required
        class="mb-4 rounded border border-gray-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={name}
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
        Register
      </button>
    </form>
  </div>
      
  );
}

export default Register;