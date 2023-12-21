
import ProcessApi from "../API/DBAPI";
import React, { useState} from 'react';
import { useNavigate } from "react-router-dom";

function DocumentByHash({isAuthenticated}) {
  const [hash, setHash] = useState("");
  
  const navigate = useNavigate();
  const [error, setError] = useState(undefined);
  const createFile = async (event) => {
    if (event) {
      event.preventDefault();
    }
  
    if (hash === "") {
      return setError("You must enter your hash.");
    }
   
   
  
    try {
      let response = await ProcessApi.GetByHash({
        hash
        
      });
      if (response.data && response.data.success === false) {
        return setError(response.data.message);
      } else if (response.data ) {
        
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while creating your account.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 class="text-2xl font-bold mb-4">Get Document By Hash</h2>
    <form onSubmit={createFile} class="flex flex-col">
      
      <label htmlFor="hash">Hash:</label>
      <input
        type="text"
        id="hash"
        name="hash"
        value={hash}
        onChange={(event) =>
          setHash(event.target.value)
        }
        required
        class="mb-4 rounded border border-gray-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-auto"
        type="submit">
        Retrieve
      </button>
    </form>
  </div>
      
  );
}

export default DocumentByHash;