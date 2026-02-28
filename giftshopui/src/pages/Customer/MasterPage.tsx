import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import type { Product } from '../../components/ProductCard';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
// Mock data (Sau này bạn sẽ fetch từ API)
const FEATURED_PRODUCTS: Product[] = [
    {
        id: '1', name: 'Xuân Như Ý', description: 'RƯỢU VANG + HẠT MACCA + MỨT',
        price: '1.250.000đ', oldPrice: '1.500.000đ',
        imageUrl: 'https://placehold.co/400x400/fdf2f8/e11d48?text=Gift+1',
        badge: { text: '-20%', type: 'discount' }
    },
    {
        id: '2', name: 'Phú Quý Mãn Đường', description: 'SƠN MÀI GOLD + YẾN SÀO + CHIVAS',
        price: '2.800.000đ',
        imageUrl: 'https://placehold.co/400x400/fefce8/ca8a04?text=Gift+2',
        badge: { text: 'BEST SELLER', type: 'bestseller' }
    },
    {
        id: '3', name: 'Tết An Yên', description: 'HỘP GỖ THÔNG + TRÀ SHAN TUYẾT',
        price: '950.000đ', imageUrl: 'https://placehold.co/400x400/fef2f2/dc2626?text=Gift+3'
    },
    {
        id: '4', name: 'Lộc Tấn Vinh Hoa', description: 'GIỎ DA + BÁNH NHẬP + RƯỢU NGON',
        price: '1.850.000đ', imageUrl: 'https://placehold.co/400x400/fff1f2/be123c?text=Gift+4'
    }
];

export default function MasterPage() {
    return (
        <>
            <Header />
            {/* Hero Section */}
            <section className="relative bg-[#b30000] h-[500px] md:h-[600px] flex items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                <div className="relative z-20 max-w-3xl px-4 flex flex-col items-center">
          <span className="border border-white/40 text-white/90 text-xs tracking-widest px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            ✦ BỘ SƯU TẬP BÍNH NGỌ 2026
          </span>
                    <h2 className="text-4xl md:text-6xl text-white font-serif mb-6 leading-tight">
                        Gói Trọn <span className="text-[#facc15]">Tinh Hoa</span> Tết Việt
                    </h2>
                    <p className="text-white/80 text-sm md:text-base mb-10 max-w-lg mx-auto">
                        Những hộp quà thượng hạng kết hợp giữa nghệ thuật sơn mài truyền thống và thiết kế đương đại.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/shop" className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded uppercase text-sm font-bold tracking-wider hover:from-red-700 hover:to-red-800 transition">
                            Khám Phá Ngay
                        </Link>
                    </div>
                </div>
            </section>

            {/* Product Showcase Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12 flex flex-col items-center">
                    <span className="text-[#b30000] text-xs font-bold tracking-[0.2em] uppercase mb-3">Limited Edition</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-gray-900 font-bold mb-4">
                        Quà Tết <span className="text-[#d4af37]">Thịnh Vượng</span>
                    </h2>
                    <div className="w-16 h-0.5 bg-[#b30000]"></div>
                </div>

                {/* Gọi component tái sử dụng ProductCard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
                    {FEATURED_PRODUCTS.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center">
                    <Link to="/shop" className="inline-block border border-[#b30000] text-[#b30000] px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-[#b30000] hover:text-white transition-colors">
                        Xem tất cả 99+ mẫu quà
                    </Link>
                </div>
            </section>
            <Footer />
        </>
    );
}