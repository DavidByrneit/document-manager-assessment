
import ProcessApi from "../API/DBAPI";
import React, { useState,useEffect} from 'react';
import { useNavigate } from "react-router-dom";

function CreateDocument({isAuthenticated}) {
  const [url, setURL] = useState("");
  const [file, setFile] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(undefined);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to the login page if not authenticated
      
    }
    
  }, []);
  const createFile = async (event) => {
    if (event) {
      event.preventDefault();
    }
  
    if (url === "") {
      return setError("You must enter your email.");
    }
    if (file === "") {
      return setError("You must enter a username.");
    }
   
  
    try {
      const formData = new FormData();
      formData.append('url', url);
      formData.append('file', file);
      let response = await ProcessApi.CreateFile(formData);
      if (response.data && response.data.success === false) {
        return setError(response.data.message);
      } else {
        
        navigate("/list_documents");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while creating Document.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 class="text-2xl font-bold mb-4">Create Document</h2>
    <form onSubmit={createFile} class="flex flex-col">
      
      <label htmlFor="url">URL:</label>
      <input
        type="text"
        id="url"
        name="url"
        value={url}
        onChange={(event) =>
          setURL(event.target.value)
        }
        required
        class="mb-4 rounded border border-gray-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <label htmlFor="file">File:</label>
      <input
        type="file"
        id="file"
        name="file"
        
        onChange={(event) =>
          setFile(event.target.files[0] )
        }
        required
        min="1"
        class="mb-4 rounded border border-gray-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-auto"
        type="submit">
        Create
      </button>
    </form>
  </div>
      
  );
}

export default CreateDocument;