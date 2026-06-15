export interface ServiceConfig {
  name: string;
  id: string;
  address: string;
  port: number;
  tags?: string[];
  meta?: Record<string, string>;
}

export interface HealthCheckConfig {
  http?: string;           // HTTP endpoint to check
  interval: string;        // Check interval (e.g., "10s")
  timeout: string;         // Check timeout (e.g., "5s")
  deregisterAfter?: string; // Remove service if unhealthy for this long
}

