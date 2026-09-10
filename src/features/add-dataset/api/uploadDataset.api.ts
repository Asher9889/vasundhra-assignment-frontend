import { apiRequest, apiEndPoints } from "@/config"
import type { AxiosApiResponse } from "@/types/api-response.type"
import type { CreateDatasetPayload, CreateDatasetResponse, CSVInvalidRow, ParsedColumn, ParsedCSV } from "../types/add-dataset.types"

interface UploadDatasetResponse {
  fileKey: string
  results: Record<string, string | number>[]
  wrongData: CSVInvalidRow[]
  columns: ParsedColumn[]
  rowCount: number
  validCount: number
  wrongCount: number
}

function cellValue(result: Record<string, string | number>, name: string): string {
  const raw = result[name];
  return raw == null ? "" : String(raw);
}

function toParsedCSV(payload: UploadDatasetResponse): ParsedCSV {
  const rows = payload.results.map((result) => payload.columns.map((column) => cellValue(result, column.name)));
  return {
    fileKey: payload.fileKey,
    columns: payload.columns,
    rows,
    rowCount: payload.rowCount,
    validCount: payload.validCount,
    wrongCount: payload.wrongCount,
    wrongData: payload.wrongData,
  };
}

export async function uploadDataset(file: File): Promise<ParsedCSV> {
  const formData = new FormData();
  formData.append("file", file);
  const { url, method } = apiEndPoints.datasets.upload;
  const response = await apiRequest<AxiosApiResponse<UploadDatasetResponse>>({ url, method, data: formData });
  return toParsedCSV(response.data);
}

export async function createDataset(payload: CreateDatasetPayload): Promise<CreateDatasetResponse> {
  const { url, method } = apiEndPoints.datasets.create;
  const response = await apiRequest<AxiosApiResponse<CreateDatasetResponse>>({ url, method, data: payload });
  return response.data;
}