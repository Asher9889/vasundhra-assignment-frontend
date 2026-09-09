import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ACCOUNT_STATUS, USER_ROLE } from "@/constants/user/user.constant"
import type { TAccountStatus, TUserRole } from "@/constants/user/user.types"
import { useGetUsers } from "./useUsers"
import type { TUserSortBy, TUserSortOrder } from "../types/users.types"

const PAGE_SIZE = 10
const DEFAULT_SORT = "createdAt:desc"

export function useUsersQuery() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get("page") ?? 1))

  const role: TUserRole = searchParams.get("role") === USER_ROLE.SUPER_ADMIN ? USER_ROLE.SUPER_ADMIN : USER_ROLE.ADMIN

  const statusParam = searchParams.get("accountStatus")
  const accountStatus: TAccountStatus | undefined =
    statusParam === ACCOUNT_STATUS.ACTIVE || statusParam === ACCOUNT_STATUS.INACTIVE ? statusParam : undefined

  const [sortBy, sortOrder] = (searchParams.get("sort") ?? DEFAULT_SORT).split(":") as [TUserSortBy, TUserSortOrder]
  const sort = `${sortBy}:${sortOrder}`

  const [searchInput, setSearchInput] = useState(() => searchParams.get("search") ?? "")
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchInput), 300)
    return () => window.clearTimeout(timer)
  }, [searchInput])

  // Mirrors the settled search value back into the URL.
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        const changed = debouncedSearch ? next.get("search") !== debouncedSearch : next.has("search")

        if (changed) {
          next.delete("page")
          if (debouncedSearch) next.set("search", debouncedSearch)
          else next.delete("search")
        }
        return next
      },
      { replace: true }
    )
  }, [debouncedSearch, setSearchParams])

  function updateParams(patch: Record<string, string | null>) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        let nonPageChanged = false

        for (const [key, value] of Object.entries(patch)) {
          if (value) {
            if (next.get(key) !== value) nonPageChanged ||= key !== "page"
            next.set(key, value)
          } else {
            if (next.has(key)) nonPageChanged ||= key !== "page"
            next.delete(key)
          }
        }

        if (nonPageChanged) next.delete("page")
        return next
      },
      { replace: true }
    )
  }

  const query = useGetUsers({
    page,
    limit: PAGE_SIZE,
    role,
    accountStatus,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  })

  return {
    ...query,
    users: query.data?.users ?? [],
    pagination: query.data?.pagination,
    page,
    role,
    accountStatus,
    sort,
    searchInput,
    setSearchInput,
    updateParams,
  }
}