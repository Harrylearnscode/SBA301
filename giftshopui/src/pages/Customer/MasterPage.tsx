import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import type { Product } from '../../components/ProductCard';
import ProductService from '../../api/service/product.service';

export default function MasterPage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoading(true);
                const response = await ProductService.getAllProducts(true);
                if (response.success && Array.isArray(response.data)) {
                    // Ưu tiên lấy các sản phẩm được đánh dấu là Quà tặng (isGift)
                    const gifts = response.data.filter((p: Product) => p.isGift);
                    
                    // Nếu không có đủ 4 quà tặng, lấy thêm các sản phẩm khác cho đủ 4
                    if (gifts.length < 4) {
                        const others = response.data.filter((p: Product) => !p.isGift);
                        setFeaturedProducts([...gifts, ...others].slice(0, 4));
                    } else {
                        setFeaturedProducts(gifts.slice(0, 4));
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm tiêu biểu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <>
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

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b30000]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                <div className="text-center">
                    <Link to="/shop" className="inline-block border border-[#b30000] text-[#b30000] px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-[#b30000] hover:text-white transition-colors">
                        Xem tất cả 99+ mẫu quà
                    </Link>
                </div>
            </section>
        </>
    );
}