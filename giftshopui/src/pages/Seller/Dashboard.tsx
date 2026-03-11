import { useState } from 'react';
import { 
  LayoutDashboard, Layers, Box, ShoppingCart, 
  PackageSearch, FileText, LogOut, CheckCircle, Users // Thêm icon Users
} from 'lucide-react';
import CategoryManager from './CategoryManagement';
import ProductManager from './ProductManagement';
import OrderManager from './OrderManagement';
import ItemManager from './ItemManagement';
import QuoteManager from './QuoteManagement';
import UserManager from './UserManagement'; // Import component vừa tạo

// --- MOCK DATA ---
const STATS = [
  { label: 'Tổng Đơn Hàng', value: '1,250', icon: <ShoppingCart />, color: 'bg-blue-500' },
  { label: 'Doanh Thu', value: '450.000.000đ', icon: <CheckCircle />, color: 'bg-green-500' },
  { label: 'Yêu cầu Báo Giá', value: '45', icon: <FileText />, color: 'bg-orange-500' },
  { label: 'Người Dùng', value: '850', icon: <Users />, color: 'bg-indigo-500' }, // Cập nhật stat ví dụ
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'categories', label: 'Quản lý Category', icon: <Layers size={20} /> },
    { id: 'products', label: 'Quản lý Product', icon: <Box size={20} /> },
    { id: 'orders', label: 'Quản lý Đơn hàng', icon: <ShoppingCart size={20} /> },
    { id: 'items', label: 'Quản lý Kho (Items)', icon: <PackageSearch size={20} /> },
    { id: 'quotes', label: 'Quản lý Báo giá (Quotes)', icon: <FileText size={20} /> },
    { id: 'users', label: 'Quản lý Người dùng', icon: <Users size={20} /> }, // Thêm vào Menu
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar bên trái */}
      <aside className="w-64 bg-[#4a0404] text-white flex flex-col sticky top-0 h-screen shadow-2xl z-50">
        <div className="p-6 border-b border-red-900">
          <h2 className="text-xl font-bold text-[#facc15] tracking-wider uppercase">Quà Tết Admin</h2>
        </div>
        <nav className="flex-1 mt-4 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                ? 'bg-[#b30000] text-[#facc15] shadow-lg translate-x-1' 
                : 'hover:bg-red-900/50 text-gray-300 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-red-900">
          <button className="flex items-center gap-3 text-gray-400 hover:text-red-400 px-4 py-2 w-full transition-colors font-bold">
            <LogOut size={20} /> <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content bên phải */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardStats />}
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'products' && <ProductManager />}
            {activeTab === 'orders' && <OrderManager />}
            {activeTab === 'items' && <ItemManager />}
            {activeTab === 'quotes' && <QuoteManager />}
            {activeTab === 'users' && <UserManager />} {/* Render UserManager ở đây */}
        </div>
      </main>
    </div>
  );
}

// --- SUB-PAGE: DASHBOARD ---
function DashboardStats() {
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

      {/* Có thể thêm biểu đồ hoặc danh sách hoạt động gần đây ở đây */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 h-64 flex items-center justify-center text-gray-300 italic">
              Biểu đồ doanh thu (Placeholder)
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 h-64 flex items-center justify-center text-gray-300 italic">
              Hoạt động gần đây (Placeholder)
          </div>
      </div>
    </div>
  );
}