import { useEffect, useState } from "react"
import { USER_ROLE } from "@/constants/user/user.constant"
import type { TUserRole } from "@/constants/user/user.types"

export interface AuthUser {
  name: string
  email: string
  role: TUserRole
}

const STORAGE_KEY = "vasudha-demo-auth-v1"

const HOME_PATH: Record<TUserRole, string> = {
  [USER_ROLE.SUPER_ADMIN]: "/admin",
  [USER_ROLE.ADMIN]: "/admin/dashboard",
}

function loadUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

let current: AuthUser | null = loadUser()
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

export function  useAuthUser(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(current)
  useEffect(() => {
    const listener = () => setUser(current)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])
  return user
}

export function loginAs(user: AuthUser) {
  current = user
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch {
    // storage unavailable; keep in memory
  }
  emit()
}

export function logout() {
  current = null
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage unavailable
  }
  emit()
}

export function getAuthUser(): AuthUser | null {
  return current
}

export function roleHomePath(role: TUserRole): string {
  return HOME_PATH[role]
}