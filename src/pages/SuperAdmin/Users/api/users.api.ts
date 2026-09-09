import { apiEndPoints, apiRequest } from "@/config"
import type { IUser } from "@/constants/user/user.types"
import type { AxiosApiResponse } from "@/types/api-response.type"
import type {
    TCreateUserPayload,
    TGetUsersQuery,
    TUpdateAccountStatusPayload,
    TUsersListResponse,
} from "../types/users.types"

const getUsers = async (query: TGetUsersQuery = {}): Promise<TUsersListResponse> => {
    const { url, method } = apiEndPoints.users.list
    const response = await apiRequest<AxiosApiResponse<TUsersListResponse>>({ url, method, params: query })
    return response.data
}

const createUser = async (payload: TCreateUserPayload): Promise<IUser> => {
    const { url, method } = apiEndPoints.users.create
    const response = await apiRequest<AxiosApiResponse<IUser>>({ url, method, data: payload })
    return response.data
}

const updateUserStatus = async ({ id, accountStatus }: TUpdateAccountStatusPayload): Promise<IUser> => {
    const { url, method } = apiEndPoints.users.updateStatus(id)
    const response = await apiRequest<AxiosApiResponse<IUser>>({ url, method, data: { accountStatus } })
    return response.data
}

export { createUser, getUsers, updateUserStatus }