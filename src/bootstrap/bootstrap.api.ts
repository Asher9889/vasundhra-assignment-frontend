import { apiEndPoints, api } from "@/config";
import type { IUser } from "@/constants/user/user.types";
import type { AxiosApiResponse } from "@/types/api-response.type";


const getMe = async () => {
  const { url, method } = apiEndPoints.auth.me;
  const response = await api.request<AxiosApiResponse<IUser>>({
    url: url,
    method: method,
  });
  return response.data;
};

export const authService = {
  getMe,
};