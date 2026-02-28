import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center flex-col justify-center text-[#b30000] hover:opacity-80 transition">
                        <h1 className="text-2xl font-serif font-bold uppercase tracking-widest">Quà Tết Việt</h1>
                        <span className="text-[10px] tracking-[0.2em]">TINH HOA 2026</span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="text-gray-600 text-sm font-semibold uppercase hover:text-[#b30000] transition">Trang Chủ</Link>
                        <Link to="/shop" className="text-gray-600 text-sm font-semibold uppercase hover:text-[#b30000] transition">Bộ Sưu Tập</Link>
                        <Link to="/custom" className="text-gray-600 text-sm font-semibold uppercase hover:text-[#b30000] transition">Thiết Kế</Link>
                        <Link to="/quote" className="text-gray-600 text-sm font-semibold uppercase hover:text-[#b30000] transition">Doanh Nghiệp</Link>
                    </nav>

                    {/* Icons (Cart & User) */}
                    <div className="flex items-center space-x-6 text-gray-700">
                        <Link to="/cart" className="relative hover:text-[#b30000] transition">
                            <ShoppingBag size={22} />
                            <span className="absolute -top-1.5 -right-2 bg-[#b30000] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span>
                        </Link>
                        <Link to="/profile" className="hover:text-[#b30000] transition">
                            <User size={22} />
                        </Link>
                    </div>

                </div>
            </div>
        </header>
    );
}