import { apiRequest, apiEndPoints } from "@/config"
import type { AxiosApiResponse } from "@/types/api-response.type"

interface ResetPasswordResponse {
  message: string
}

const resetPassword = async (token: string, password: string): Promise<ResetPasswordResponse> => {
  const { url, method } = apiEndPoints.auth.resetPassword
  const response = await apiRequest<AxiosApiResponse<ResetPasswordResponse>>({
    url,
    method,
    data: { token, password },
  })
  return response.data
}

export { resetPassword }