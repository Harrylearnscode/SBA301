import axiosInstance from "../axios.config";

export interface DashboardStats {
  totalCategories: number;
  totalProducts: number;
  totalItems: number;
  totalQuotes: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface RevenueChartPoint {
  date: string;
  total: number;
}

export interface RecentActivity {
  id: string;
  type: 'ORDER' | 'QUOTE' | 'PRODUCT';
  description: string;
  timestamp: string;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  revenueChart: RevenueChartPoint[];
  recentActivities: RecentActivity[];
}

class DashboardService {
  async getAnalytics(): Promise<DashboardData> {
    const response = await axiosInstance.get('/dashboard/analytics');
    return response.data.data;
  }
}

export default new DashboardService();
