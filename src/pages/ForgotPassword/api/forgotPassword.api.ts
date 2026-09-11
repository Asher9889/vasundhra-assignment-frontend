import { apiRequest, apiEndPoints } from "@/config"
import type { AxiosApiResponse } from "@/types/api-response.type"

interface ForgotPasswordResponse {
  message: string
}

const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  const { url, method } = apiEndPoints.auth.forgotPassword
  const response = await apiRequest<AxiosApiResponse<ForgotPasswordResponse>>({
    url,
    method,
    data: { email },
  })
  return response.data
}

export { forgotPassword }