import { ScanResult, ScanSummary, DashboardStats, ReportItem } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getAuthHeader(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('retina_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadAndAnalyzeScan(file: File): Promise<ScanResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/scans`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to analyze OCT scan.');
  }

  return res.json();
}

export async function getScanById(id: number | string): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/scans/${id}`, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Scan not found.');
  return res.json();
}

export async function getUserScans(): Promise<ScanSummary[]> {
  const res = await fetch(`${API_BASE}/scans`, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Failed to fetch scans.');
  return res.json();
}

export async function deleteScan(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/scans/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!res.ok) throw new Error('Failed to delete scan.');
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/scans/dashboard/stats`, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Failed to load dashboard statistics.');
  return res.json();
}

export async function generateReport(scanId: number): Promise<ReportItem> {
  const res = await fetch(`${API_BASE}/reports/${scanId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Failed to generate report.');
  return res.json();
}

export async function getUserReports(): Promise<ReportItem[]> {
  const res = await fetch(`${API_BASE}/reports`, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Failed to fetch reports.');
  return res.json();
}
