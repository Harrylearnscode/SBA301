import React from 'react';
import { Search, ShoppingBag, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-white sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center flex-col justify-center text-[#b30000]">
                        <h1 className="text-2xl font-serif font-bold uppercase tracking-widest">Quà Tết Việt</h1>
                        <span className="text-[10px] tracking-[0.2em]">TINH HOA 2026</span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <a href="#" className="text-[#b30000] text-sm font-semibold uppercase hover:text-red-700 transition">Trang Chủ</a>
                        <a href="#" className="text-gray-600 text-sm font-semibold uppercase hover:text-[#b30000] transition">Bộ Sưu Tập</a>
                        <a href="#" className="text-gray-600 text-sm font-semibold uppercase hover:text-[#b30000] transition">Thiết Kế</a>
                        <a href="#" className="text-gray-600 text-sm font-semibold uppercase hover:text-[#b30000] transition">Doanh Nghiệp</a>
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center space-x-5 text-gray-700">
                        <button className="hover:text-[#b30000] transition"><Search size={20} /></button>
                        <div className="relative">
                            <button className="hover:text-[#b30000] transition"><ShoppingBag size={20} /></button>
                            <span className="absolute -top-1.5 -right-2 bg-[#b30000] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span>
                        </div>
                        <button className="hover:text-[#b30000] transition"><User size={20} /></button>
                    </div>
                </div>
            </div>
        </header>
    );
}