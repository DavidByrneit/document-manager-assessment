import ProcessApi from "../API/DBAPI";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function DocumentView({ isAuthenticated }) {
  const { id } = useParams();
  const [document, setDocument] = useState(undefined);
  const [otherDocuments, setOtherDocuments] = useState([]);
  const[content_type, setContentType] = useState(null);
  const [versions, setVersions] = useState([]);
  const [url, setURL] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to the login page if not authenticated
      
    }else{
    // Call your API here with the id
    ProcessApi.GetDocumentByHash(id)
      .then(document => {
        setDocument(document);
        setContentType(document.headers.get('Content-Type'));
        console.log(document);
        // Do something with the document
      })
      .catch(error => {
        // Handle the error
      });

    // Fetch other documents
    ProcessApi.GetOtherDocumentsVersionNumbers(id)
      .then(docs => {
        setURL(docs.data.url);
        const versionsArray = [];
        for(let i = docs.data.version_number; i >= 1; i--) {
          versionsArray.push(i);
        }
    setVersions(versionsArray);
        console.log(docs.data);
      })
      .catch(error => {
        // Handle the error
      });}
  }, []);

  const handleDocumentChange = (e) => {
    ProcessApi.GetFile(url , e.target.value)
      .then(document => {
        console.log(document.data.hash_value);
        ProcessApi.GetDocumentByHash(document.data.hash_value)
      .then(document => {
        setOtherDocuments(document);
        setContentType(document.headers.get('Content-Type'));
      })
      .catch(error => {
        // Handle the error
      });
      })
      .catch(error => {
        // Handle the error
      });
    
  }

  return (
    <div className="flex flex-row justify-between h-full">
      <div className="flex flex-col items-center justify-center w-1/2">
        <h2 class="text-2xl font-bold mb-4">Current Document</h2>
        {
          content_type === 'text/plain' &&
          <pre>{document.data}</pre>
        }
        
      </div>
      <div className="flex flex-col items-center justify-center w-1/2">
        <h2 class="text-2xl font-bold mb-4">Other Documents</h2>
        <select onChange={handleDocumentChange}>
        {versions.map((version, index) => (
          <option key={index} value={version}>Version {version}</option>
        ))}
      </select>
      {
          content_type === 'text/plain' &&
          <pre>{otherDocuments.data}</pre>
        }
      </div>
    </div>
  );
}

export default DocumentView;