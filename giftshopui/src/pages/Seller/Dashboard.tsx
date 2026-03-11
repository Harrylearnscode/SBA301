import { useState } from 'react';
import { 
  LayoutDashboard, Layers, Box, ShoppingCart, 
  PackageSearch, FileText, LogOut, CheckCircle
} from 'lucide-react';
import CategoryManager from './CategoryManagement';
import ProductManager from './ProductManagement';
import OrderManager from './OrderManagement';
import ItemManager from './ItemManagement';
import QuoteManager from './QuoteManagement';

// --- MOCK DATA (Dùng để hiển thị ví dụ) ---
const STATS = [
  { label: 'Tổng Đơn Hàng', value: '1,250', icon: <ShoppingCart />, color: 'bg-blue-500' },
  { label: 'Doanh Thu', value: '450.000.000đ', icon: <CheckCircle />, color: 'bg-green-500' },
  { label: 'Yêu cầu Báo Giá', value: '45', icon: <FileText />, color: 'bg-orange-500' },
  { label: 'Sản Phẩm', value: '120', icon: <Box />, color: 'bg-red-600' },
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
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar bên trái */}
      <aside className="w-64 bg-[#4a0404] text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-red-900">
          <h2 className="text-xl font-bold text-[#facc15] tracking-wider uppercase">Quà Tết Admin</h2>
        </div>
        <nav className="flex-1 mt-4 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id ? 'bg-[#b30000] text-[#facc15] shadow-lg' : 'hover:bg-red-900/50 text-gray-300'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-red-900">
          <button className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-2 w-full">
            <LogOut size={20} /> <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content bên phải */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'dashboard' && <DashboardStats />}
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'orders' && <OrderManager />}
        {activeTab === 'items' && <ItemManager />}
        {activeTab === 'quotes' && <QuoteManager />}
      </main>
    </div>
  );
}

// --- SUB-PAGE: DASHBOARD ---
function DashboardStats() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Tổng quan hệ thống</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-lg flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}