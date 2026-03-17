import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Layers, Box, ShoppingCart, 
  PackageSearch, FileText, LogOut, Users 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/categories', label: 'Quản lý Category', icon: <Layers size={20} /> },
    { path: '/admin/products', label: 'Quản lý Product', icon: <Box size={20} /> },
    { path: '/admin/orders', label: 'Quản lý Đơn hàng', icon: <ShoppingCart size={20} /> },
    { path: '/admin/items', label: 'Quản lý Kho (Items)', icon: <PackageSearch size={20} /> },
    { path: '/admin/quotes', label: 'Quản lý Báo giá (Quotes)', icon: <FileText size={20} /> },
    { path: '/admin/users', label: 'Quản lý Người dùng', icon: <Users size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth'); // Đẩy về trang đăng nhập sau khi thoát
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar bên trái */}
      <aside className="w-64 bg-[#4a0404] text-white flex flex-col sticky top-0 h-screen shadow-2xl z-50">
        <div className="p-6 border-b border-red-900">
          <Link to="/admin" className="text-xl font-bold text-[#facc15] tracking-wider uppercase block">
            Quà Tết Admin
          </Link>
        </div>
        
        <nav className="flex-1 mt-4 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            // Kiểm tra link đang active (Đảm bảo '/admin' không bị sáng khi đang ở '/admin/products')
            const isActive = item.path === '/admin' 
                ? location.pathname === '/admin' 
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                  ? 'bg-[#b30000] text-[#facc15] shadow-lg translate-x-1' 
                  : 'hover:bg-red-900/50 text-gray-300 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-red-900">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:text-red-400 px-4 py-2 w-full transition-colors font-bold"
          >
            <LogOut size={20} /> <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content bên phải (Nơi render các trang con) */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}