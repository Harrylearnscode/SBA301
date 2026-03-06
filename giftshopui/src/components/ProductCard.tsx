import React from 'react';
import { Link } from 'react-router-dom';

export interface Product {
  id: number;
  name: string;
  sku?: string;
  description: string; 
  basePrice: number;    
  imageUrl: string;
  isGift?: boolean;
  isActive?: boolean;
  giftComponents?: any[];
  oldPrice?: number;
  badge?: {
    text: string;
    type: 'discount' | 'vip' | 'hot';
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-100 group">
      
      <Link to={`/product/${product.id}`} className="flex-grow flex flex-col cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img 
            src={product.imageUrl || 'https://placehold.co/400x400/f8fafc/0f172a?text=No+Image'} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <div className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider text-white ${
              product.badge.type === 'vip' ? 'bg-yellow-500' : 'bg-[#b30000]'
            }`}>
              {product.badge.text}
            </div>
          )}
        </div>

        <div className="p-4 text-center flex flex-col flex-grow">
          {/* Subtitle lấy từ description */}
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 line-clamp-1">
            {product.description}
          </p>
          <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Sử dụng basePrice */}
          <div className="mt-auto flex justify-center items-center gap-2">
            <span className="text-[#b30000] font-bold text-base">{formatPrice(product.basePrice)}</span>
            {product.oldPrice && (
              <span className="text-gray-400 text-xs line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-5 pt-2">
        <button 
          onClick={handleAddToCart}
          className="w-full border border-[#b30000] text-[#b30000] py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#b30000] hover:text-white transition-colors"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}