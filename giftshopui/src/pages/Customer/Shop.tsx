import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../../components/ProductCard';
import type {Product} from '../../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../api/service/product.service';
import CartService from '../../api/service/cart.service';
import { useAuth } from '../../contexts/AuthContext'; 
import Toast from '../../components/ui/Toast';

const PRICE_FILTERS = [
  { id: 'under_500', label: 'Dưới 500.000đ', min: 0, max: 500000 },
  { id: '500_1000', label: '500k - 1.000.000đ', min: 500000, max: 1000000 },
  { id: '1000_3000', label: '1.000.000đ - 3.000.000đ', min: 1000000, max: 3000000 },
  { id: 'over_3000', label: 'Trên 3.000.000đ', min: 3000000, max: 999999999 },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Gọi API lấy dữ liệu khi trang được load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await ProductService.getAllProducts(true);
        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.message || 'Lỗi khi tải danh sách sản phẩm');
        }
      } catch (err: any) {
        setError(err.message || 'Không thể kết nối đến máy chủ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePriceChange = (id: string) => {
    setSelectedPriceRanges(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Logic lọc sản phẩm theo giá (Dùng basePrice thay vì price)
  const filteredProducts = useMemo(() => {
    if (selectedPriceRanges.length === 0) return products;

    return products.filter(product => {
      return selectedPriceRanges.some(filterId => {
        const range = PRICE_FILTERS.find(f => f.id === filterId);
        if (!range) return false;
        return product.basePrice > range.min && product.basePrice <= range.max;
      });
    });
  }, [selectedPriceRanges, products]);

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    try {
      // Mặc định ở trang Shop sẽ thêm 1 sản phẩm vào giỏ
      const res = await CartService.addToCart(productId, 1);
      if (res.success) {
        setToast({ show: true, message: "Đã thêm 1 sản phẩm vào giỏ hàng.", type: 'success' });
      } else {
        setToast({ show: true, message: res.message || "Không thể thêm vào giỏ", type: 'error' });
      }
    } catch (err: any) {
      setToast({ show: true, message: "Lỗi kết nối máy chủ", type: 'error' });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div className="text-sm text-gray-500">
            <span className="hover:text-[#b30000] cursor-pointer">Trang chủ</span> / <span className="text-gray-900 font-medium">Cửa hàng</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          
          {/* SIDEBAR BỘ LỌC */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div>
              <h3 className="font-serif font-bold text-lg border-b border-gray-200 pb-2 mb-4">Mức Giá</h3>
              <div className="space-y-3">
                {PRICE_FILTERS.map(filter => (
                  <label key={filter.id} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 text-[#b30000] border-gray-300 rounded-sm focus:ring-[#b30000]"
                      checked={selectedPriceRanges.includes(filter.id)}
                      onChange={() => handlePriceChange(filter.id)}
                    />
                    <span className="text-sm text-gray-600 group-hover:text-[#b30000] transition-colors">
                      {filter.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* GRID SẢN PHẨM */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#b30000]"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-10">{error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                Không tìm thấy sản phẩm nào phù hợp.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      {/* COMPONENT TOAST */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}