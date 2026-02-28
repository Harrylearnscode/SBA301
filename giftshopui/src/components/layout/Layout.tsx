import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Component TopBanner (Hiển thị thanh thông báo đỏ trên cùng)
const TopBanner = () => (
    <div className="bg-[#b30000] text-white text-xs md:text-sm py-2 text-center flex items-center justify-center gap-2 font-medium tracking-wide z-50 relative">
        <span className="text-yellow-400">🎁</span> LÌ XÌ ĐẦU NĂM - GIẢM NGAY 20% CHO ĐƠN HÀNG ĐẶT TRƯỚC 20/01
    </div>
);

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            <TopBanner />
            <Header />

            {/* Vùng chứa Content của các trang (MasterPage, Shop, Cart...) sẽ hiển thị ở đây */}
            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}