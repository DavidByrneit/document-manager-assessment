import axios from "./DBIndex";

class DBAPI {
  static LoginUser = (data) => {
    return axios.post(`auth-token/`, data);
  };

  static CreateUser = (data) => {
    return axios.post(`api/users/`, data);
  };

  static GetFiles = (data) => {
    console.log(data)
    console.log(localStorage.getItem("token"))
    return axios.get(`api/file_versions/`, {
      params: data,
      headers: {
          'Authorization': `Token ${localStorage.getItem("token")}`
      }
  });
};
  static CreateFile = (data) => {
    return axios.post(`createFile`, data);
  };
  
  static GetByHash = (hash,data) => {
    return axios.get(`GetByHash/${hash}`, data);
  };
  static GetSteps = (step,data) => {
    return axios.get(`getSteps/${step}`, data);
  };

  static GetUsers = (data) => {
    return axios.get(`getUsers`, data);
  };
  static GetUser = (user,data) => {
    return axios.get(`getUser/${user}`, data);
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
