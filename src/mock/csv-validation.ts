import { DATASET_TEMPLATE, DATASET_UPLOAD_PHASE } from "@/constants/dataset/dataset.constants"
import type { CSVValidationError, CSVValidationResult } from "@/features/add-dataset/types/add-dataset.types"

export const initialValidationState: CSVValidationResult = {
  state: DATASET_UPLOAD_PHASE.IDLE,
  errors: [],
}

export function mockValidateCsv(fileName?: string): CSVValidationResult {
  return {
    state: DATASET_UPLOAD_PHASE.VALID,
    errors: [],
    fileName,
    rowCount: 128,
  }
}

export const sampleValidationErrors: CSVValidationError[] = [
  { message: "Missing required column: latitude" },
  { message: "Missing required column: longitude" },
  { message: "Value must be numeric in column: capacity_mw (row 14)" },
  { message: "Invalid state name: 'Bharat' in column: state (row 3)" },
  { message: "Invalid date format: '2024-31-02' in column: date (row 9)" },
]

export const rejectionReasons = [
  "Missing or incomplete required columns",
  "Value format does not match expected type",
  "Invalid state or region names",
  "Invalid date formatting",
  "Duplicate or conflicting records",
  "Source data could not be verified",
]

export const columnGuides = [
  {
    templateType: DATASET_TEMPLATE.LAT_LONG,
    columns: [
      { name: "latitude", description: "Decimal latitude, e.g. 28.6139" },
      { name: "longitude", description: "Decimal longitude, e.g. 77.2090" },
      { name: "value", description: "Numeric value for the point" },
    ],
    example: { latitude: "28.6139", longitude: "77.2090", value: "2050" },
  },
  {
    templateType: DATASET_TEMPLATE.STATE_WISE,
    columns: [
      { name: "state", description: "State or union territory name, e.g. Rajasthan" },
      { name: "value", description: "Numeric value for the state" },
    ],
    example: { state: "Rajasthan", value: "18350" },
  },
  {
    templateType: DATASET_TEMPLATE.TIME_SERIES,
    columns: [
      { name: "date", description: "Date or year, e.g. 2024 or 2024-01-01" },
      { name: "value", description: "Numeric value at that point in time" },
    ],
    example: { date: "2024", value: "25.3" },
  },
]