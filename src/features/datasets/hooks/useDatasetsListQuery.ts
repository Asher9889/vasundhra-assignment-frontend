import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { ApprovalStatus } from "@/constants/dataset/dataset.types"
import { useDatasetsQuery } from "./useDatasetsQuery"

const PAGE_SIZE = 10
const DEFAULT_SORT = "createdAt:desc"

export function useDatasetsListQuery() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get("page") ?? 1))

  const statusParam = searchParams.get("status")
  const status: ApprovalStatus | undefined =
    statusParam === "PENDING" || statusParam === "APPROVED" || statusParam === "REJECTED" ? statusParam : undefined

  const [sortBy, sortOrder] = (searchParams.get("sort") ?? DEFAULT_SORT).split(":") as ["createdAt" | "title" | "domain", "asc" | "desc"]
  const sort = `${sortBy}:${sortOrder}`

  const [searchInput, setSearchInput] = useState(() => searchParams.get("search") ?? "")
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchInput), 300)
    return () => window.clearTimeout(timer)
  }, [searchInput])

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

  const query = useDatasetsQuery({
    page,
    limit: PAGE_SIZE,
    status,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  })

  return {
    ...query,
    page,
    status,
    sort,
    searchInput,
    setSearchInput,
    updateParams,
  }
}