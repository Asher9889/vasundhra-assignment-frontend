export const DOMAIN = {
  CLIMATE: "CLIMATE",
  ENERGY: "ENERGY",
  POWER: "POWER",
} as const

export const CHART_TYPE = {
  LINE: "LINE",
  BAR: "BAR",
  AREA: "AREA",
  INDIA_MAP: "INDIA_MAP",
  STATE_HEATMAP: "STATE_HEATMAP",
} as const

export const DATASET_TEMPLATE = {
  LAT_LONG: "LAT_LONG",
  STATE_WISE: "STATE_WISE",
  TIME_SERIES: "TIME_SERIES",
} as const

export const APPROVAL_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const

export const DATASET_ACTIVE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const

export const DATASET_UPLOAD_PHASE = {
  IDLE: "IDLE",
  UPLOADING: "UPLOADING",
  VALID: "VALID",
  INVALID: "INVALID",
} as const