import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import CartService from '../../api/service/cart.service';
import Toast from '../../components/ui/Toast';
import QuoteService from '../../api/service/quote.service';
import OrderService from '../../api/service/order.service';
import ConfirmModal from '../../components/ui/ConfirmModal';

interface ProductComponent {
  id: number;
  product: {
    name: string;
  };
  quantity: number;
}

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    imageUrl: string;
    isGift: boolean;
    giftComponents?: ProductComponent[];
  };
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
  const [itemToDelete, setItemToDelete] = useState<{ id: number, name: string } | null>(null);
  const [isRequestingQuote, setIsRequestingQuote] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await CartService.getMyCart();
      if (res.success) {
        // Backend trả về CartResponse chứa cartItems
        setCartItems(res.data?.cartItems || []);
      } else {
        setError(res.message || 'Không thể tải giỏ hàng');
      }
    } catch (err: any) {
      setError(err || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (cartItemId: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
      // Cập nhật UI ngay lập tức cho mượt
      setCartItems(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
      
      // Gửi API
      const res = await CartService.updateQuantity(cartItemId, newQty);
      if (!res.success) {
        setToast({ show: true, message: res.message || "Lỗi cập nhật số lượng", type: "error" });
        fetchCart(); // Rollback UI nếu lỗi
      }
    } catch (err) {
      setToast({ show: true, message: "Lỗi kết nối máy chủ", type: "error" });
      fetchCart();
    }
  };

  // Hàm này giờ chỉ làm nhiệm vụ mở Modal
  const handleRemoveItem = (cartItemId: number, productName: string) => {
    setItemToDelete({ id: cartItemId, name: productName });
  };

  // HÀM MỚI: Xử lý xóa thực sự khi ấn "Đồng ý" trên Modal
  const confirmRemoveItem = async () => {
    if (!itemToDelete) return;
    
    try {
      const res = await CartService.removeItem(itemToDelete.id);
      if (res.success) {
        setCartItems(prev => prev.filter(item => item.id !== itemToDelete.id));
        setToast({ show: true, message: "Đã xóa sản phẩm khỏi giỏ hàng", type: "success" });
      } else {
        setToast({ show: true, message: res.message || "Không thể xóa sản phẩm", type: "error" });
      }
    } catch (err) {
      setToast({ show: true, message: "Lỗi kết nối máy chủ", type: "error" });
    } finally {
      setItemToDelete(null); // Đóng modal dù thành công hay thất bại
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.basePrice * item.quantity), 0);
  };

  // Xử lý thanh toán (Checkout)
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!shippingAddress.trim()) {
      setToast({ show: true, message: "Vui lòng nhập địa chỉ giao hàng", type: "error" });
      return;
    }
    
    try {
      setIsCheckingOut(true);
      
      // Map dữ liệu sang định dạng CheckoutRequest (Backend chỉ cần address vì lấy giỏ hàng từ DB)
      const payload = {
        shippingAddress: shippingAddress.trim()
      };

      const res = await OrderService.checkout(payload);
      
      if (res.success) {
        setToast({ show: true, message: "Đặt hàng thành công!", type: "success" });
        
        // Xóa giỏ hàng sau khi đặt hàng thành công
        await CartService.clearCart();
        setCartItems([]);
        
        // Chuyển hướng đến trang thanh toán hoặc lịch sử đơn hàng
        setTimeout(() => {
          if (res.data?.payUrl) {
            // Nếu có payUrl, chuyển tới URL thanh toán
            window.location.href = res.data.payUrl;
          } else {
            // Nếu không, chuyển tới lịch sử đơn hàng
            navigate('/order-history');
          }
        }, 1500);
      } else {
        setToast({ show: true, message: res.message || "Đặt hàng thất bại", type: "error" });
      }
    } catch (err: any) {
      setToast({ show: true, message: "Lỗi kết nối máy chủ", type: "error" });
    } finally {
      setIsCheckingOut(false);
    }
  };

  //Xử lý gửi yêu cầu báo giá
  const handleRequestQuote = async () => {
    if (cartItems.length === 0) return;
    
    try {
      setIsRequestingQuote(true);
      
      // Map dữ liệu từ cartItems sang định dạng QuoteRequest mà Backend cần
      const payload = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      const res = await QuoteService.createQuote(payload);
      
      if (res.success) {
        setToast({ show: true, message: "Đã gửi yêu cầu báo giá thành công!", type: "success" });
        
        // Gọi API dọn sạch giỏ hàng vì sản phẩm đã được chuyển sang luồng báo giá
        await CartService.clearCart(); 
        setCartItems([]); // Xóa UI giỏ hàng ngay lập tức
        
        // Tạm thời để user ở lại trang. Sau này có trang Quote sẽ dùng navigate('/quotes')
      } else {
        setToast({ show: true, message: res.message || "Không thể gửi yêu cầu", type: "error" });
      }
    } catch (err) {
      setToast({ show: true, message: "Lỗi kết nối máy chủ", type: "error" });
    } finally {
      setIsRequestingQuote(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#b30000]"></div></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Banner Đỏ */}
      <div className="w-full bg-[#8b0000] py-14 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-serif text-[#facc15] font-bold mb-2">
          Giỏ Hàng Của Bạn
        </h2>
        <p className="text-white/80 italic text-sm">"Gói trọn tinh hoa - Trao gửi tâm tình"</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {error ? (
          <div className="bg-white p-8 rounded shadow text-center text-red-600">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white p-16 rounded shadow text-center">
            <p className="text-gray-500 mb-6">Giỏ hàng của bạn đang trống.</p>
            <Link to="/shop" className="bg-[#b30000] text-white px-8 py-3 rounded uppercase font-bold text-sm tracking-wider hover:bg-red-800 transition">
              Khám Phá Quà Tết
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CỘT TRÁI: Danh sách sản phẩm */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-sm rounded-sm p-6 border-t-4 border-[#b30000]">
                <h3 className="text-lg font-bold text-[#b30000] border-b border-gray-200 pb-4 mb-4">
                  Sản phẩm đã chọn ({cartItems.length})
                </h3>

                {/* Tiêu đề cột (Chỉ hiện trên desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
                  <div className="col-span-5">Sản Phẩm</div>
                  <div className="col-span-2 text-center">Đơn Giá</div>
                  <div className="col-span-2 text-center">Số Lượng</div>
                  <div className="col-span-2 text-right">Thành Tiền</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Danh sách items */}
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 border-b border-gray-100 last:border-0">
                      
                      {/* Cột 1: Hình ảnh & Tên */}
                      <div className="col-span-5 flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 border border-gray-200 overflow-hidden">
                           <img src={item.product.imageUrl || 'https://placehold.co/100x100/f8fafc/0f172a?text=Gift'} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <Link to={`/product/${item.product.id}`} className="font-bold text-sm text-[#b30000] hover:underline line-clamp-2">
                            {item.product.name}
                          </Link>
                          {item.product.isGift && item.product.giftComponents && item.product.giftComponents.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                                {item.product.giftComponents.map(comp => (
                                    <span key={comp.id} className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                                        {comp.product.name} (x{comp.quantity})
                                    </span>
                                ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.product.description}</p>
                        </div>
                      </div>

                      {/* Cột 2: Đơn giá */}
                      <div className="col-span-2 text-center text-sm font-semibold text-gray-700 hidden md:block">
                        {formatPrice(item.product.basePrice)}
                      </div>

                      {/* Cột 3: Số lượng */}
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-gray-300 rounded h-8 w-24">
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} className="w-8 h-full flex justify-center items-center hover:bg-gray-100 text-gray-600 transition">-</button>
                          <input type="text" value={item.quantity} readOnly className="w-8 h-full text-center text-xs border-x border-gray-300 font-bold focus:outline-none" />
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} className="w-8 h-full flex justify-center items-center hover:bg-gray-100 text-gray-600 transition">+</button>
                        </div>
                      </div>

                      {/* Cột 4: Thành tiền */}
                      <div className="col-span-2 text-right font-bold text-[#b30000] text-sm">
                        {formatPrice(item.product.basePrice * item.quantity)}
                      </div>

                      {/* Cột 5: Nút xóa */}
                      <div className="col-span-1 flex justify-end">
                        <button 
                          onClick={() => handleRemoveItem(item.id, item.product.name)} 
                          className="text-gray-400 hover:text-red-600 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-4">
                  <Link to="/shop" className="inline-flex items-center text-sm font-bold text-gray-600 hover:text-[#b30000] transition">
                    <ArrowLeft size={16} className="mr-2" /> Tiếp tục mua sắm
                  </Link>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: Thông tin đơn hàng (Summary) */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-sm rounded-sm p-6 border-t-4 border-[#facc15] sticky top-24">
                <h3 className="text-lg font-bold text-[#b30000] border-b border-gray-200 pb-4 mb-6">
                  Thông tin đơn hàng
                </h3>
                
                <div className="space-y-4 text-sm mb-6 pb-6 border-b border-gray-200 text-gray-600">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span className="font-bold text-gray-900">{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-900">TỔNG CỘNG:</span>
                  <span className="text-xl font-bold text-[#b30000]">{formatPrice(calculateTotal())}</span>
                </div>
                <p className="text-right text-[10px] text-gray-400 mb-6 italic">(Đã bao gồm VAT)</p>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Địa chỉ giao hàng(Yêu cầu với thanh toán ngay) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Nhập địa chỉ giao hàng của bạn..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] focus:border-transparent text-sm"
                    required
                  />
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartItems.length === 0}
                  className="w-full bg-[#8b0000] text-white py-4 rounded font-bold uppercase tracking-wider hover:bg-red-900 transition flex justify-center items-center gap-2 shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? "ĐANG XỬ LÝ..." : "THANH TOÁN NGAY"}
                </button>

                <div className="relative flex items-center py-5">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-bold tracking-widest">Hoặc</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button 
                  onClick={handleRequestQuote}
                  disabled={isRequestingQuote || cartItems.length === 0}
                  className="w-full bg-gray-900 text-[#facc15] py-4 rounded font-bold uppercase tracking-wider hover:bg-black transition flex justify-center items-center gap-2 shadow-lg shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRequestingQuote ? "ĐANG GỬI..." : "YÊU CẦU BÁO GIÁ SỈ"}
                </button>
                
              </div>
            </div>

          </div>
        )}
      </div>

      {/* COMPONENT THÔNG BÁO TOAST */}
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

      <ConfirmModal 
        show={!!itemToDelete}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn bỏ "${itemToDelete?.name}" ra khỏi giỏ hàng không?`}
        confirmText="Đồng ý xóa"
        cancelText="Giữ lại"
        onConfirm={confirmRemoveItem}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}