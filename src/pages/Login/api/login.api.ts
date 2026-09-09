import { apiRequest, apiEndPoints } from "@/config"
import type { IUser } from "@/constants/user/user.types"
import type { AxiosApiResponse } from "@/types/api-response.type"

const login = async (email: string, password: string): Promise<void> => {
  const { url, method } = apiEndPoints.auth.login
  await apiRequest({ url, method, data: { email, password } })
}

const getMe = async (): Promise<IUser> => {
  const { url, method } = apiEndPoints.auth.me
  const response = await apiRequest<AxiosApiResponse<IUser>>({
    url,
    method,
  })
  return response.data
}

export { getMe, login }