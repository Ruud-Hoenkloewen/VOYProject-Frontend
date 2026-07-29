/**
 * Tipos e interfaces TypeScript para el sistema de Dashboards (Producer & Artist).
 */

export type UserRole = 'producer' | 'artist' | 'client' | 'admin';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: string;
  color?: string;
  subtext?: string;
}

export interface DashboardEventItem {
  id: string;
  title: string;
  date: string;
  venue: string;
  city?: string;
  ticketsSold?: number;
  totalCapacity?: number;
  revenue?: number;
  status: 'publicado' | 'borrador' | 'finalizado' | 'confirmado';
  image?: string;
}

export interface ProducerDashboardData {
  metrics: DashboardMetric[];
  events: DashboardEventItem[];
  recentSales?: Array<{
    id: string;
    eventTitle: string;
    buyerName: string;
    quantity: number;
    amount: number;
    date: string;
  }>;
}

export interface ArtistDashboardData {
  metrics: DashboardMetric[];
  upcomingEvents: DashboardEventItem[];
  topTracks?: Array<{
    id: string;
    title: string;
    playsCount: number;
    duration: string;
  }>;
}
