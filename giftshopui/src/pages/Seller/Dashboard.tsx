import React from 'react';
import { ShoppingCart, CheckCircle, FileText, Users } from 'lucide-react';

const STATS = [
  { label: 'Tổng Đơn Hàng', value: '1,250', icon: <ShoppingCart />, color: 'bg-blue-500' },
  { label: 'Doanh Thu', value: '450.000.000đ', icon: <CheckCircle />, color: 'bg-green-500' },
  { label: 'Yêu cầu Báo Giá', value: '45', icon: <FileText />, color: 'bg-orange-500' },
  { label: 'Người Dùng', value: '850', icon: <Users />, color: 'bg-indigo-500' },
];

export default function Dashboard() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tổng quan hệ thống</h1>
        <p className="text-gray-500 mt-1">Chào mừng bạn trở lại, đây là số liệu thống kê mới nhất.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-inner`}>
              {stat.icon}
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black mt-1 text-gray-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 h-64 flex items-center justify-center text-gray-300 italic uppercase font-black tracking-widest">
              Biểu đồ doanh thu
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 h-64 flex items-center justify-center text-gray-300 italic uppercase font-black tracking-widest">
              Hoạt động gần đây
          </div>
      </div>
    </div>
  );
}