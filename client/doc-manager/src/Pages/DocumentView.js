import ProcessApi from "../API/DBAPI";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';

function DocumentView({ isAuthenticated }) {
  const { id } = useParams();
  
  const [document, setDocument] = useState(undefined);
  const [otherDocuments, setOtherDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const[content_type, setContentType] = useState(null);
  useEffect(() => {
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

    // // Fetch other documents
    // ProcessApi.GetOtherDocuments()
    //   .then(docs => {
    //     setOtherDocuments(docs.data);
    //   })
    //   .catch(error => {
    //     // Handle the error
    //   });
  }, []);

  const handleDocumentChange = (e) => {
    const selectedDoc = otherDocuments.find(doc => doc.id === e.target.value);
    setSelectedDocument(selectedDoc);
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
          {otherDocuments.map(doc => (
            <option value={doc.id}>{doc.name}</option>
          ))}
        </select>
        {selectedDocument && selectedDocument.file && 
          <object data={selectedDocument.file} type="application/pdf" width="100%" height="100%">
            <embed src={selectedDocument.file} type="application/pdf" />
          </object>
        }
      </div>
    </div>
  );
}

export default DocumentView;