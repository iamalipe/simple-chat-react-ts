import Axios from "axios";
import { useGlobalState } from "../state";
import {
  LoginServicePayload,
  RegisterServicePayload,
  loginService,
  registerService,
} from "../services";

const API_URL = "http://localhost:3000";

const useAPI = () => {
  // const auth = useSelector((state) => state.auth);
  const { state, setState } = useGlobalState();
  // const dispatch = useDispatch();
  const controller = new AbortController();

  const axiosInstance = Axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${state.token}`,
    },
    signal: controller.signal,
  });

  const axiosInstanceWithoutToken = Axios.create({
    baseURL: API_URL,
    signal: controller.signal,
  });

  axiosInstance.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      if (error.code === "ERR_CANCELED") return Promise.reject(error);
      if (error.response.status === 401) {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        setState((prev) => ({ ...prev, token: null, currentUser: null }));
      }
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      const dataX = {
        message: error.response.data.msg || error.message,
        status: error.response.status,
      };
      return Promise.reject(dataX);
    }
  );

  const cancel = () => {
    controller.abort();
  };

  const api = {
    auth: {
      login: (data: LoginServicePayload) =>
        loginService(axiosInstanceWithoutToken, data),
      register: (data: RegisterServicePayload) =>
        registerService(axiosInstanceWithoutToken, data),
    },
  };

  return { api, cancel, axiosInstance, axiosInstanceWithoutToken };
};

export default useAPI;
