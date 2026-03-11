import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Truck, Award, RefreshCw, FileText, Minus, Plus, CheckCircle } from 'lucide-react';
import ProductService from '../../api/service/product.service';
import ProductCard from '../../components/ProductCard';
import type { Product } from '../../components/ProductCard';
import CartService from '../../api/service/cart.service';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '../../components/ui/Toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  // State quản lý số lượng thêm vào giỏ
  const [quantity, setQuantity] = useState<number>(1);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate(); 
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Gọi API lấy dữ liệu sản phẩm và sản phẩm tương tự
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi đổi sản phẩm

        // Gọi song song 2 API cho nhanh
        const [productRes, similarRes] = await Promise.all([
          ProductService.getProductById(id),
          ProductService.getSimilarProducts(id, 4) // Chỉ lấy 4 sản phẩm
        ]);

        if (productRes.success) {
          setProduct(productRes.data);
        } else {
          setError(productRes.message || 'Không tìm thấy sản phẩm');
        }

        if (similarRes.success) {
          setSimilarProducts(similarRes.data);
        }

      } catch (err: any) {
        setError(err.message || 'Lỗi kết nối máy chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (!product) return;

    try {
      const res = await CartService.addToCart(product.id, quantity);
      if (res.success) {
        // Gọi component Toast hiển thị thành công
        setToast({ show: true, message: `Đã thêm ${quantity} sản phẩm vào giỏ hàng.`, type: 'success' });
      } else {
        // Gọi component Toast hiển thị lỗi từ server
        setToast({ show: true, message: res.message || "Có lỗi xảy ra khi thêm vào giỏ", type: 'error' });
      }
    } catch (err: any) {
      setToast({ show: true, message: err || "Lỗi kết nối máy chủ", type: 'error' });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'decrease' && quantity > 1) setQuantity(prev => prev - 1);
    if (type === 'increase') setQuantity(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b30000]"></div>
      </div>
    );
  }

  if (error || !product) {
    return <div className="min-h-screen flex justify-center items-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#b30000]">Trang chủ</Link> / 
          <Link to="/shop" className="hover:text-[#b30000]"> Bộ sưu tập Tết</Link> / 
          <span className="text-gray-900 font-medium"> {product.name}</span>
        </div>

        {/* CHI TIẾT SẢN PHẨM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          
          {/* Cột trái: Hình ảnh */}
          <div className="bg-gray-50 aspect-square rounded flex items-center justify-center p-4">
            <img 
              src={product.imageUrl || 'https://placehold.co/600x600/f8fafc/0f172a?text=No+Image'} 
              alt={product.name} 
              className="w-full h-full object-cover shadow-sm mix-blend-multiply"
            />
          </div>

          {/* Cột phải: Thông tin */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
              <span>Mã SP: <strong className="text-gray-700">{product.sku || `TET2026-${product.id}`}</strong></span>
              <span>|</span>
              <span>Tình trạng: <strong className="text-green-600">Còn hàng</strong></span>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-[#b30000]">{formatPrice(product.basePrice)}</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
              {product.description || 'Hộp quà cao cấp, thiết kế hoa mẫu đơn sang trọng. Món quà ý nghĩa thay lời chúc năm mới an khang, thịnh vượng.'}
            </p>

            {/* Box Thành phần hộp quà */}
            {product.giftComponents && product.giftComponents.length > 0 && (
              <div className="border border-red-100 bg-red-50/30 rounded-lg p-5 mb-8">
                <h3 className="text-[#b30000] font-bold mb-3">Thành phần hộp quà:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {product.giftComponents.map((component: any) => {
                    // Lấy số lượng từ component.quantity
                    const qty = component.quantity || 1;
                    const formattedQty = qty < 10 ? `0${qty}` : qty;
                    
                    // Lấy tên sản phẩm từ component.product.name
                    const productName = component.product?.name || 'Sản phẩm không xác định';
                    
                    return (
                      // Sử dụng component.id làm key cho chuẩn React
                      <li key={component.id} className="flex items-center gap-2">
                        <span className="text-[#b30000]">✔</span> 
                        {formattedQty} {productName}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Khu vực Action (Số lượng + Nút mua) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Bộ đếm số lượng */}
              <div className="flex items-center border border-gray-300 rounded h-12 w-32">
                <button onClick={() => handleQuantityChange('decrease')} className="w-10 h-full flex justify-center items-center hover:bg-gray-100 text-gray-600 transition"><Minus size={16} /></button>
                <input type="text" value={quantity} readOnly className="w-12 h-full text-center border-x border-gray-300 font-bold focus:outline-none" />
                <button onClick={() => handleQuantityChange('increase')} className="w-10 h-full flex justify-center items-center hover:bg-gray-100 text-gray-600 transition"><Plus size={16} /></button>
              </div>

              {/* Hai nút hành động chính */}
              <button className="flex-1 bg-[#b30000] text-white h-12 font-bold uppercase tracking-wider hover:bg-red-800 transition shadow-lg shadow-red-900/20">
                Mua Ngay
              </button>
              <button onClick={handleAddToCart} className="flex-1 border-2 border-[#b30000] text-[#b30000] h-12 font-bold uppercase tracking-wider hover:bg-red-50 transition">
                Thêm Vào Giỏ
              </button>
            </div>

            {/* Cam kết dịch vụ */}
            <div className="grid grid-cols-4 gap-2 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-center text-center gap-2 text-gray-500 hover:text-[#b30000] transition cursor-default">
                <Truck size={24} strokeWidth={1.5} />
                <span className="text-[10px] uppercase font-semibold">Giao hàng 2H</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 text-gray-500 hover:text-[#b30000] transition cursor-default">
                <Award size={24} strokeWidth={1.5} />
                <span className="text-[10px] uppercase font-semibold">Hàng chính hãng</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 text-gray-500 hover:text-[#b30000] transition cursor-default">
                <RefreshCw size={24} strokeWidth={1.5} />
                <span className="text-[10px] uppercase font-semibold">Đổi trả 7 ngày</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 text-gray-500 hover:text-[#b30000] transition cursor-default">
                <FileText size={24} strokeWidth={1.5} />
                <span className="text-[10px] uppercase font-semibold">Xuất hóa đơn VAT</span>
              </div>
            </div>

          </div>
        </div>

        {/* SẢN PHẨM TƯƠNG TỰ */}
        {similarProducts.length > 0 && (
          <div className="pt-12 border-t border-gray-200">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-serif text-[#b30000] font-bold">Sản Phẩm Tương Tự</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {similarProducts.map((simProduct) => (
                <ProductCard key={simProduct.id} product={simProduct} />
              ))}
            </div>
          </div>
        )}

      </div>
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}