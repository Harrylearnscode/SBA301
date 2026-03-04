import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Xóa token ở client
    navigate('/');
  };

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex-shrink-0 flex items-center flex-col justify-center text-[#b30000]">
            <h1 className="text-2xl font-serif font-bold uppercase tracking-widest">Quà Tết Việt</h1>
            <span className="text-[10px] tracking-[0.2em]">TINH HOA 2026</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 text-sm font-semibold uppercase hover:text-[#b30000] transition">Trang Chủ</Link>
            <Link to="/customer/shop" className="text-gray-600 text-sm font-semibold uppercase hover:text-[#b30000] transition">Bộ Sưu Tập</Link>
            <Link to="/customer/customProduct" className="text-gray-600 text-sm font-semibold uppercase hover:text-[#b30000] transition">Thiết Kế</Link>
            <Link to="/customer/quote" className="text-gray-600 text-sm font-semibold uppercase hover:text-[#b30000] transition">Doanh Nghiệp</Link>
          </nav>

          <div className="flex items-center space-x-6 text-gray-700">
            {isAuthenticated ? (
              <>
                <Link to="/customer/cart" className="relative hover:text-[#b30000] transition">
                  <ShoppingBag size={22} />
                  <span className="absolute -top-1.5 -right-2 bg-[#b30000] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span>
                </Link>
                <Link to="/customer/profile" className="hover:text-[#b30000] transition">
                  <User size={22} />
                </Link>
                <button onClick={handleLogout} className="hover:text-[#b30000] transition" title="Đăng xuất">
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <Link to="/auth" className="bg-[#b30000] text-white px-5 py-2 text-sm font-bold rounded uppercase tracking-wider hover:bg-red-800 transition">
                Đăng Nhập
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}