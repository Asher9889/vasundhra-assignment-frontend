import type { IUser, TAccountStatus, TUserRole } from "@/constants/user/user.types"
import type { createUserSchema } from "../schema/users.schema"
import z from "zod"

type TUserSortBy = "createdAt" | "email"
type TUserSortOrder = "asc" | "desc"

type TCreateUserSchema = z.infer<typeof createUserSchema>

interface TGetUsersQuery {
    page?: number
    limit?: number
    search?: string
    role?: TUserRole
    accountStatus?: TAccountStatus
    sortBy?: TUserSortBy
    sortOrder?: TUserSortOrder
}

interface TUsersListResponse {
    users: IUser[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

interface TCreateUserPayload {
    email: string
    password: string
    role: TUserRole
    accountStatus?: TAccountStatus
}

interface TUpdateAccountStatusPayload {
    id: string
    accountStatus: TAccountStatus
}

export type {
    TCreateUserPayload,
    TCreateUserSchema,
    TGetUsersQuery,
    TUpdateAccountStatusPayload,
    TUserSortBy,
    TUserSortOrder,
    TUsersListResponse,
}