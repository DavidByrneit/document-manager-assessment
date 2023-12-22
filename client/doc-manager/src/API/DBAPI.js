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
  

  

  static EditUser = (data) => {
    return   axios.post(`editUser`, data)
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.error(err);
    });
  };
  static CreateProcessSetup = (data) => {
    const config = {
      headers: {
          "Content-Type": "multipart/form-data",
      },
  };
    return axios.post(`createProcessList`, data);
  };
  
  static CreateWorkOrder = (data) => {
    return axios.post(`createWorkorder`, data);
  };
  static GetWorkOrders = (data) => {
    return axios.get(`getWorkorders`, data);
  };

  
  static ListSteps = (data) => {
    return axios.get(`getSteps`, data);
  };
  static ListVideoRecords = (data) => {
    return axios.post(`getVideoRecords`, data);
  };
  static getVideo = (data) => {
    return axios.post(`getVideo`, data);
  };
  static ListModels = (data) => {
    return axios.get(`getModels`, data);
  };
  static UpdateModel = (id,data) => {
    return   axios.put(`editUserPref/${id}`, data)
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.error(err);
    });
  };




  
  static UpdateProcess = (data) => {
    return axios.post(`${process}/update`, data, { headers: { Authorization: `${data.token}` } } );
  };
  static DestroyProcess = (data) => {
    return axios.post(`${process}/destroy`, data, { headers: { Authorization: `${data.token}` } } );
  };
//models API
static CreateModel = (data) => {
  return axios.post(`${model}/`, data);
};

static ListModel = (data) => {
  return axios.get(`${model}/`, data);
};
static RetrieveModel = (data) => {
  return axios.post(`${model}/retrieve`, data);
};


static DestroyModel = (data) => {
  return axios.post(`${model}/destroy`, data, { headers: { Authorization: `${data.token}` } } );
};
//step
static CreateStep = (data) => {
  return axios.post(`${step}/`, data);
};

static ListStep = (data) => {
  return axios.get(`${step}/`, data);
};


static UpdateStep = (data) => {
  return axios.post(`${step}/update`, data, { headers: { Authorization: `${data.token}` } } );
};
static DestroyStep = (data) => {
  return axios.post(`${step}/destroy`, data, { headers: { Authorization: `${data.token}` } } );
};
//workOrder



static RetrieveWorkOrder = (data) => {
  return axios.post(`${workOrder}/retrieve`, data);
};

static UpdateWorkOrder = (data) => {
  return axios.post(`${workOrder}/update`, data, { headers: { Authorization: `${data.token}` } } );
};
static DestroyWorkOrder = (data) => {
  return axios.post(`${workOrder}/destroy`, data, { headers: { Authorization: `${data.token}` } } );
};
}

let process = "process";
let model = "model";
let step = "step";
let workOrder = "workOrder";
export default DBAPI;
