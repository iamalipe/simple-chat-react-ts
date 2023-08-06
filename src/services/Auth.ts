import axios, { AxiosInstance } from "axios";

const LOGIN_URL = "/auth/login";
const REGISTER_URL = "/auth/register";

export interface LoginServicePayload {
  email: string;
  password: string;
}
export const loginService = async (
  api: AxiosInstance,
  data: LoginServicePayload
) => {
  try {
    const res = await api.post(LOGIN_URL, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      console.error(error);
    }
  }
};

export interface RegisterServicePayload {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
}
export const registerService = async (
  api: AxiosInstance,
  data: RegisterServicePayload
) => {
  try {
    const res = await api.post(REGISTER_URL, data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data;
    } else {
      console.error(error);
    }
  }
};
