import axios from "./DBIndex";

class DBAPI {
  static LoginUser = (data) => {
    return axios.post(`auth-token/`, data);
  };

  static CreateUser = (data) => {
    return axios.post(`api/users/`, data);
  };

  
static GetFiles = (data) => {
  return axios.get(`api/file_versions/`, {
    headers: {
        'Authorization': `Token ${localStorage.getItem("token")}`
    }
});
};
static CreateFile = (data) => {

    // Send the file data to the server
    return axios.post(`documents/${data.get('url')}`, data, {
      headers: {
        'Authorization': `Token ${localStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  };
  
  static GetByHash = (data) => {
    return axios.get(`file_version/${data.hash}`, {
      headers: {
          'Authorization': `Token ${localStorage.getItem("token")}`
      }
  });
  };
  static GetDocumentByHash = (id,data) => {
    return axios.get(`file_version/${id}`, {
      headers: {
          'Authorization': `Token ${localStorage.getItem("token")}`
      }
  });
  };

  static GetDocumentByHash = (id,data) => {
    return axios.get(`file_version/${id}`, {
      headers: {
          'Authorization': `Token ${localStorage.getItem("token")}`
      }
  });
  };
  static GetOtherDocumentsVersionNumbers = (id,data) => {
    return axios.get(`file_version_latest/${id}`, {
      headers: {
          'Authorization': `Token ${localStorage.getItem("token")}`
      }
  });
  };
  
  static GetFile = (url,revision) => {
    let requestUrl = `documents/${url}`;
    if (revision) {
        requestUrl += `?revision=${revision}`;
    }
    // Send the file data to the server
    return axios.get(requestUrl,{
      headers: {
        'Authorization': `Token ${localStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  };
  

}
export default DBAPI;
