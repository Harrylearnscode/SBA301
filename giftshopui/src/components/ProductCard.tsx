import React from 'react';
import { Link } from 'react-router-dom';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    oldPrice?: string;
    imageUrl: string;
    badge?: {
        text: string;
        type: 'discount' | 'bestseller';
    };
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col border border-gray-100 group">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                    <div className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                        product.badge.type === 'discount' ? 'bg-red-600 text-white' : 'bg-yellow-400 text-red-900'
                    }`}>
                        {product.badge.text}
                    </div>
                )}
            </div>

            <div className="p-5 text-center flex flex-col flex-grow">
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-4 line-clamp-2 min-h-[32px]">
                    {product.description}
                </p>

                <div className="mt-auto flex justify-center items-center gap-2 mb-4">
                    <span className="text-[#b30000] font-bold text-lg">{product.price}</span>
                    {product.oldPrice && (
                        <span className="text-gray-400 text-sm line-through">{product.oldPrice}</span>
                    )}
                </div>

                {/* Nút xem chi tiết / Thêm vào giỏ */}
                <Link
                    to={`/product/${product.id}`}
                    className="w-full border border-[#b30000] text-[#b30000] py-2 text-sm font-bold uppercase tracking-wider hover:bg-[#b30000] hover:text-white transition-colors"
                >
                    Xem chi tiết
                </Link>
            </div>
        </div>
    );
}