import type { ACCOUNT_STATUS, USER_ROLE } from "./user.constant";

type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE]
type TAccountStatus = (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS]

interface IUser {
    id: string,
    email: string,
    role: TUserRole,
    accountStatus: TAccountStatus,
    createdAt: string,
    updatedAt: string
}

interface AdminUser {
    id: string,
    email: string,
    name?: string,
    role: TUserRole,
    status: TAccountStatus,
    createdAt: string,
    lastLogin?: string
}

export type { AdminUser, IUser, TAccountStatus, TUserRole };
