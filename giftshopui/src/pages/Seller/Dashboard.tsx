import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  FileText, 
  Users, 
  Layers, 
  Package, 
  Box, 
  Loader2,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import type { DashboardData } from '../../api/service/dashboard.service';
import DashboardService from '../../api/service/dashboard.service';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const result = await DashboardService.getAnalytics();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-500 font-medium">Đang tổng hợp dữ liệu hệ thống...</p>
        </div>
      </div>
    );
  }

  const STATS_CONFIG = [
    { label: 'Danh mục', value: data.stats.totalCategories, icon: <Layers />, color: 'bg-purple-500' },
    { label: 'Sản phẩm', value: data.stats.totalProducts, icon: <Package />, color: 'bg-blue-500' },
    { label: 'Số lượng Item', value: data.stats.totalItems, icon: <Box />, color: 'bg-cyan-500' },
    { label: 'Báo giá', value: data.stats.totalQuotes, icon: <FileText />, color: 'bg-orange-500' },
    { label: 'Người dùng', value: data.stats.totalUsers, icon: <Users />, color: 'bg-indigo-500' },
    { label: 'Đơn hàng', value: data.stats.totalOrders, icon: <ShoppingCart />, color: 'bg-green-500' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-gray-500 mt-2 text-lg">Chào mừng quay lại! Dưới đây là tình hình kinh doanh của bạn hôm nay.</p>
        </div>
        <div className="hidden md:block">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">Hệ thống trực tuyến</span>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {STATS_CONFIG.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-xl transition-all duration-300 group cursor-default">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 24 })}
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black mt-2 text-gray-900">
              {stat.value.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Phân tích doanh thu</h2>
                <p className="text-sm text-gray-400 font-medium">Biến động doanh thu 7 ngày gần nhất</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tổng doanh thu</p>
              <p className="text-xl font-black text-blue-600">{data.stats.totalRevenue.toLocaleString()} đ</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueChart}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '1rem',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '1rem'
                  }}
                  formatter={(value: any) => [new Intl.NumberFormat('vi-VN').format(value) + ' đ', 'Doanh thu']}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Hoạt động gần đây</h2>
              <p className="text-sm text-gray-400 font-medium">Luồng sự kiện mới nhất</p>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {data.recentActivities.length > 0 ? (
              data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4 group cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 ${
                      activity.type === 'ORDER' ? 'bg-green-50 border-green-100 text-green-600' : 
                      activity.type === 'QUOTE' ? 'bg-orange-50 border-orange-100 text-orange-600' : 
                      'bg-blue-50 border-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'ORDER' ? <ShoppingCart size={18} /> : <FileText size={18} />}
                    </div>
                    <div className="w-0.5 flex-1 bg-gray-100 my-2 group-last:hidden"></div>
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-50 group-last:border-none">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-black text-gray-400 tracking-tighter uppercase">{activity.id}</span>
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase">
                        <Clock size={10} /> {activity.timestamp}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-700 leading-tight group-hover:text-blue-600 transition-colors">
                      {activity.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                       <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                         ['COMPLETED', 'PAID', 'SUCCESS'].includes(activity.status) ? 'bg-green-100 text-green-700' :
                         ['PENDING', 'PROCESSING'].includes(activity.status) ? 'bg-blue-100 text-blue-700' :
                         'bg-gray-100 text-gray-700'
                       }`}>
                         {activity.status}
                       </span>
                       <ArrowUpRight size={12} className="text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 py-10">
                <Activity size={48} strokeWidth={1} />
                <p className="mt-4 italic font-medium">Chưa có hoạt động nào</p>
              </div>
            )}
          </div>
          
          <button className="mt-8 w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-2xl text-xs uppercase tracking-widest transition-colors">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>
    </div>
  );
}
