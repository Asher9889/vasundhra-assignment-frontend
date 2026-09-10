import { useEffect, useState } from "react"
import { mockDatasets } from "@/mock/datasets"
import type { Dataset } from "@/constants/dataset/dataset.types"

const STORAGE_KEY = "vasudha-demo-datasets-v1"

function loadInitial(): Dataset[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Dataset[]
  } catch {
    // ignore corrupted storage
  }
  return mockDatasets
}

function persist(next: Dataset[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable; keep in memory
  }
}

let current: Dataset[] = loadInitial()
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

export function useMockDatasets(): Dataset[] {
  const [value, setValue] = useState(current)
  useEffect(() => {
    const listener = () => setValue(current)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])
  return value
}

export function updateMockDatasets(updater: (datasets: Dataset[]) => Dataset[]) {
  current = updater(current)
  persist(current)
  emit()
}

export function addMockDataset(dataset: Dataset) {
  updateMockDatasets((cur) => [dataset, ...cur])
}

export function getMockDatasets(): Dataset[] {
  return current
}