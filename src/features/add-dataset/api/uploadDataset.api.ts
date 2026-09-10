import { apiRequest, apiEndPoints } from "@/config"
import type { AxiosApiResponse } from "@/types/api-response.type"
import type { ColumnType, ParsedCSV } from "../types/add-dataset.types"

interface UploadDatasetResponse {
  results: Record<string, string | number>[]
  columns: string[]
  rowCount: number
}

function inferColumnType(values: string[]): ColumnType {
  const nonEmpty = values.filter((value) => value.trim() !== "")
  if (nonEmpty.length === 0) return "STRING";

  const numericCount = nonEmpty.filter((value) => !Number.isNaN(Number(value))).length
  if (numericCount / nonEmpty.length >= 0.8) return "NUMBER";

  const dateCount = nonEmpty.filter((value) => !Number.isNaN(Date.parse(value))).length
  if (dateCount / nonEmpty.length >= 0.8) return "DATE";

  return "STRING";
}

function cellValue(result: Record<string, string | number>, name: string): string {
  const raw = result[name];
  return raw == null ? "" : String(raw);
}

function toParsedCSV(payload: UploadDatasetResponse): ParsedCSV {
  const columns = payload.columns.map((name) => {
    const values = payload.results.map((result) => cellValue(result, name))
    return { name, type: inferColumnType(values) }
  });
  const rows = payload.results.map((result) => payload.columns.map((name) => cellValue(result, name)));
  return { columns, rows, rowCount: payload.rowCount }
}

export async function uploadDataset(file: File): Promise<ParsedCSV> {
  const formData = new FormData();
  formData.append("file", file);
  const { url, method } = apiEndPoints.datasets.upload;
  const response = await apiRequest<AxiosApiResponse<UploadDatasetResponse>>({ url, method, data: formData });
  return toParsedCSV(response.data);
}