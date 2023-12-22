import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProcessApi from "../API/DBAPI";
import { useNavigate } from "react-router-dom";

function ListDocuments({isAuthenticated}) {
  const [filter, setFilter] = useState({
    files_name_Filter: ''
  });


const [files, setFiles] = useState([]);
const [filteredFiles, setFilteredFiles] = useState(files);

const [error, setError] = useState(undefined);
const navigate = useNavigate();
const fetchData = () => {
  ProcessApi.GetFiles()
    .then(response => {
      setFiles(response.data)
      setFilteredFiles(response.data)
    })
    .catch(error => {
      console.log({ error })
      // Handle error
    })
}
useEffect(() => {
  if (!isAuthenticated) {
    navigate("/login"); // Redirect to the login page if not authenticated
    
  }
  fetchData();
}, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = files.filter((file) => {
      const name = file.file_name.toLowerCase();
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== name[i]) {
          return false;
        }
      }
      return true;
    });
    setFilteredFiles(filtered);
  };
  
  return (
    <>
    {isAuthenticated ? (
    <div class="items-center justify-center h-full pb-20 ">
  
  <div class="flex items-center justify-between">
  <form class="flex items-center">
    <label for="processName" class="block font-medium text-gray-700 mb-1 p-2">File Name:</label>
    <input type="text" id="processName" name="processName" value={filter.file_name} onChange={handleFilterChange} onKeyUp={handleInputChange} class="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-20" />
  </form>
  
</div>

<div class="mx-2 h-full overflow-y-auto">

<table className="w-full mx-auto border-collapse border border-gray-400 my-2 p-4">
  <thead className="bg-gray-200">
    <tr>
      <th className="p-2 border border-gray-400 bg-green-700 text-white">FILE NAME</th>
      <th className="p-2 border border-gray-400 bg-green-700 text-white">VERSION NUMBER</th>
      <th className="p-2 border border-gray-400 bg-green-700 text-white">URL</th>
      <th className="p-2 border border-gray-400 bg-green-700 text-white">ACTIONS</th>
    </tr>
  </thead>
  <tbody>
    {filteredFiles.map((file) => (
    <tr key={file.id} className="bg-white border-b">
      <td className="text-center p-2 border border-gray-400 text-sm text-gray-600">{file.file_name}</td>
      <td className="text-center p-2 border border-gray-400 text-sm text-gray-600">{file.version_number}</td>
      <td className="text-center p-2 border border-gray-400 text-sm text-gray-600">{file.url}</td>
      <td className="text-center p-2 border border-gray-400 text-sm text-gray-600">
        <Link to={`view/${file.hash_value}`} className="text-blue-500">View</Link>
      </td>
    </tr>
    ))}
  </tbody>
</table>
</div>
    </div>
    ) : (<div></div>)} </>
  );
}

export default ListDocuments;
