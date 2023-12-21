import Axios from "axios";
import { PROCESS_API_SERVER } from "../Config/constant";

const axios = Axios.create({
  baseURL: `${PROCESS_API_SERVER}`,
  
});

axios.interceptors.request.use(
  (config) => {
    return Promise.resolve(config);
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
