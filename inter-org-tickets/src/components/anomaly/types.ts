
export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'performance' | 'security' | 'data-quality' | 'network' | 'system';
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved' | 'acknowledged';
  source: string;
  metadata: Record<string, any>;
  tags?: string[];
  assignedTo?: string;
  resolvedAt?: string;
  escalatedAt?: string;
}

export interface AlertFilter {
  severity: string;
  type: string;
  timeRange: string;
  status: string;
  search?: string;
}

export interface WebhookConfig {
  id: string;
  url: string;
  name: string;
  isActive: boolean;
  secret?: string;
  events: string[];
}

export interface CorrelationData {
  sourceAlert: string;
  targetAlert: string;
  correlation: number;
  confidence: number;
}
