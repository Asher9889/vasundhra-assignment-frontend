import type {
  APPROVAL_STATUS,
  CHART_TYPE,
  DATASET_ACTIVE_STATUS,
  DATASET_TEMPLATE,
  DATASET_UPLOAD_PHASE,
  DOMAIN,
} from "./dataset.constants";

type Domain = (typeof DOMAIN)[keyof typeof DOMAIN];
type ChartType = (typeof CHART_TYPE)[keyof typeof CHART_TYPE];
type DatasetTemplate = (typeof DATASET_TEMPLATE)[keyof typeof DATASET_TEMPLATE];
type ApprovalStatus = (typeof APPROVAL_STATUS)[keyof typeof APPROVAL_STATUS];
type DatasetActiveStatus = (typeof DATASET_ACTIVE_STATUS)[keyof typeof DATASET_ACTIVE_STATUS];
type DatasetUploadPhase = (typeof DATASET_UPLOAD_PHASE)[keyof typeof DATASET_UPLOAD_PHASE];
type TimeseriesChartType = { value: (typeof CHART_TYPE)["LINE" | "BAR" | "AREA"]; label: string };

interface SeriesDataPoint {
  label: string;
  value: number;
}

interface LatLonPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  value: number;
  category?: string;
}

interface StateValue {
  state: string;
  value: number;
}

interface ChartData {
  kind: ChartType;
  series?: Array<{ name: string; points: SeriesDataPoint[] }>;
  points?: LatLonPoint[];
  states?: StateValue[];
  unit?: string;
  xLabel?: string;
  yLabel?: string;
}

interface Dataset {
  id: string;
  title: string;
  description?: string;
  domain: Domain;
  chartType: ChartType;
  templateType: DatasetTemplate;
  data: ChartData;
  uploadedBy: string;
  uploadedById?: string;
  status: ApprovalStatus;
  activeStatus: DatasetActiveStatus;
  rejectionReason?: string;
  fileName?: string;
  rowCount: number;
  createdAt: Date;
  
  approvedBy: string| null;
  approvedAt: Date | null;
  publishedAt: Date | null
}

export type {
  ApprovalStatus,
  ChartData,
  ChartType,
  Dataset,
  DatasetActiveStatus,
  DatasetTemplate,
  DatasetUploadPhase,
  Domain,
  LatLonPoint,
  SeriesDataPoint,
  StateValue,
  TimeseriesChartType,
}