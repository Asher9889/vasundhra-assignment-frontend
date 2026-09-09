import { AUTH_STATUS } from "./auth.constants";


type AuthStatus = typeof AUTH_STATUS[keyof typeof AUTH_STATUS];

export type { AuthStatus };