export type Condition = 'NORMAL' | 'DME' | 'DRUSEN' | 'CNV';
export type Priority = 'HIGH' | 'REVIEW' | 'LOW';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Probabilities {
  NORMAL: number;
  DME: number;
  DRUSEN: number;
  CNV: number;
}

export interface ScanResult {
  id: number;
  originalFilename: string;
  prediction: Condition;
  confidence: number;
  priority: Priority;
  modelName: string;
  description: string;
  attentionFinding: string;
  heatmapImage: string;
  overlayImage: string;
  originalImage: string;
  probabilities: Probabilities;
  hasReport?: boolean;
  reportNumber?: string;
  createdAt: string;
}

export interface ScanSummary {
  id: number;
  originalFilename: string;
  prediction: Condition;
  confidence: number;
  priority: Priority;
  modelName: string;
  createdAt: string;
}

export interface DashboardStats {
  totalScans: number;
  highPriorityScans: number;
  normalScans: number;
  reportsGenerated: number;
  conditionDistribution: Record<Condition, number>;
  recentScans: ScanSummary[];
}

export interface ReportItem {
  id: number;
  reportNumber: string;
  scanId: number;
  clinicalSummary: string;
  status: string;
  scanData: ScanResult;
  createdAt: string;
}
