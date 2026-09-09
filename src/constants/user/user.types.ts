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

export type { IUser, TUserRole, TAccountStatus };
