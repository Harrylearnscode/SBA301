import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Calendar, ChevronDown, Clock, 
  Phone, Package, Tag, RefreshCw, Eye, X, Truck
} from 'lucide-react';
import OrderService from '../../api/service/order.service';

export default function OrderManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await OrderService.getAllOrders();
      if (res.success) {
        // Sắp xếp theo orderDate thực tế từ JSON
        const sorted = res.data.sort((a: any, b: any) => 
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        setOrders(sorted);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderStatusChange = async (id: string | number, newStatus: string) => {
    try {
      const res = await OrderService.updateOrderStatus(id, { status: newStatus });
      if (res.success) {
        setOrders((prev: any[]) => prev.map((order: any) => 
          order.id === id ? { ...order, status: newStatus, updateDate: new Date().toISOString() } : order
        ));
      }
    } catch (error) {
      alert("Lỗi cập nhật trạng thái đơn hàng");
    }
  };

  const handlePaymentStatusChange = async (id: string | number, newStatus: string) => {
    try {
      // Gửi đúng request: { "payment": "PAID" }
      const res = await OrderService.updatePaymentStatus(id, { payment: newStatus });
      if (res.success) {
        setOrders((prev: any[]) => prev.map((order: any) => 
          order.id === id ? { ...order, payment: newStatus } : order
        ));
        // Nếu cần cập nhật lại paidTime từ server thì fetch lại
        if (newStatus === 'PAID') fetchOrders();
      }
    } catch (error) {
      alert("Lỗi cập nhật thanh toán");
    }
  };

  // Logic workflow: chỉ cho phép chuyển đến trạng thái tiếp theo
  const getAvailableStatuses = (currentStatus: string) => {
    const statusFlow: Record<string, string[]> = {
      'PENDING': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['SHIPPED', 'CANCELLED'],
      'SHIPPED': ['DELIVERED', 'CANCELLED'],
      'DELIVERED': ['CANCELLED'],
      'CANCELLED': []
    };
    return statusFlow[currentStatus] || [];
  };

  // Xem chi tiết đơn hàng
  const handleViewDetails = async (orderId: string | number) => {
    try {
      setDetailsLoading(true);
      
      // Thử gọi API admin trước
      try {
        const res = await OrderService.getOrderByIdAdmin(orderId);
        if (res.success) {
          setSelectedOrderDetails(res.data);
          return;
        }
      } catch (adminError) {
        console.log("Admin endpoint không hoạt động, fallback sang local data");
      }

      // Fallback: Lấy từ dữ liệu local đã fetch
      const orderData = orders.find((o: any) => o.id === orderId);
      if (orderData) {
        setSelectedOrderDetails(orderData);
      } else {
        alert("Không tìm thấy đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi tải chi tiết đơn hàng:", error);
      alert("Lỗi tải chi tiết đơn hàng");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetailsModal = () => {
    setSelectedOrderDetails(null);
  };

  // Helper định dạng ngày giờ
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "---";
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getOrderStatusStyle = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PROCESSING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PENDING': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DEPOSIT': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'UNPAID': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'REFUNDED': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="space-y-6 px-2 py-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2 uppercase">
            <ShoppingBag className="text-blue-600" size={28} /> Quản lý Đơn hàng
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Hệ thống kiểm soát đơn & thanh toán</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b">
                <th className="p-5">Đơn hàng & SĐT</th>
                <th className="p-5">Lịch sử thời gian</th>
                <th className="p-5">Chi tiết món</th>
                <th className="p-5">Thanh toán</th>
                <th className="p-5 text-right">Trạng thái vận chuyển</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-black animate-pulse">ĐANG TẢI...</td></tr>
              ) : orders.map((order) => {
                const userPhone = order.customerPhone || "N/A";
                const userName = order.customerName || "Khách vãng lai";

                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* ID & Phone & Name */}
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-gray-900 text-sm">#ORD-{order.id}</span>
                        <span className="text-gray-700 text-[11px] font-bold">{userName}</span>
                        <span className="text-blue-600 text-[11px] font-black flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                          <Phone size={10} strokeWidth={3} /> {userPhone}
                        </span>
                      </div>
                    </td>

                    {/* Order & Update Date */}
                    <td className="p-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-gray-600 font-bold text-[11px]">
                          <Calendar size={13} className="text-blue-500" />
                          <span>Đặt: {formatDateTime(order.orderDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] italic">
                          <RefreshCw size={11} className="animate-spin-slow" />
                          <span>Sửa: {formatDateTime(order.updateDate)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Total Item & Discount Applied */}
                    <td className="p-5">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 font-black text-gray-800 text-xs">
                            <Package size={14} className="text-amber-500" />
                            <span>{order.totalItem} món</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-rose-600 font-black text-[10px] bg-rose-50 px-2 py-0.5 rounded-md w-fit border border-rose-100">
                            <Tag size={12} />
                            <span>-{order.discountApplied?.toLocaleString()}%</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase transition-colors"
                        >
                          <Eye size={12} />
                          Xem chi tiết
                        </button>
                      </div>
                    </td>

                    {/* Payment Status & Paid Time */}
                    <td className="p-5">
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <select 
                            value={order.payment}
                            onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                            className={`appearance-none w-full pl-2 pr-7 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-tight outline-none cursor-pointer shadow-sm transition-all ${getPaymentStatusStyle(order.payment)}`}
                          >
                            <option value="UNPAID">Chưa thanh toán</option>
                            <option value="DEPOSIT">Đã đặt cọc</option>
                            <option value="PAID">Đã thanh toán</option>
                            <option value="REFUNDED">Đã hoàn tiền</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-2.5 opacity-40 pointer-events-none" />
                        </div>
                        {order.paidTime && (
                          <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase italic">
                             <Clock size={10} /> Trả lúc: {formatDateTime(order.paidTime)}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Total Price & Order Status */}
                    <td className="p-5 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-sm font-black text-blue-800 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                            {order.totalPrice?.toLocaleString()}đ
                        </span>
                        <div className="relative min-w-[140px]">
                          <select 
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            className={`appearance-none w-full pl-3 pr-8 py-2 rounded-xl border text-[11px] font-black uppercase outline-none cursor-pointer transition-all shadow-sm ${getOrderStatusStyle(order.status)}`}
                          >
                            <option value={order.status}>{order.status === 'PENDING' ? 'Chờ xác nhận' : order.status === 'PROCESSING' ? 'Đang chuẩn bị' : order.status === 'SHIPPED' ? 'Đang giao hàng' : order.status === 'DELIVERED' ? 'Đã hoàn thành' : 'Đã hủy đơn'}</option>
                            {getAvailableStatuses(order.status).map(status => (
                              <option key={status} value={status}>
                                {status === 'PROCESSING' ? 'Đang chuẩn bị' : status === 'SHIPPED' ? 'Đang giao hàng' : status === 'DELIVERED' ? 'Đã hoàn thành' : 'Đã hủy đơn'}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-3 opacity-40 pointer-events-none" />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Chi tiết đơn hàng */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            {/* Header Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center border-b">
              <div>
                <h3 className="text-2xl font-black">Chi tiết đơn hàng #{selectedOrderDetails.id}</h3>
                <p className="text-blue-100 text-sm">Tổng cộng: {selectedOrderDetails.totalItem} sản phẩm</p>
              </div>
              <button
                onClick={closeDetailsModal}
                className="hover:bg-blue-800 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Loading State */}
            {detailsLoading && (
              <div className="p-20 text-center text-gray-400 font-black animate-pulse">
                ĐANG TẢI...
              </div>
            )}

            {/* Content */}
            {!detailsLoading && selectedOrderDetails.orderDetails && (
              <div className="p-6 space-y-6">
                {/* Thông tin khách hàng & giao hàng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">Thông tin khách hàng</h4>
                      <p className="text-sm font-bold text-gray-800">
                        {selectedOrderDetails.customerName || "N/A"}
                      </p>
                      <p className="text-xs text-blue-600 font-black">
                        {selectedOrderDetails.customerPhone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                    <div className="bg-amber-500 text-white p-2 rounded-lg shrink-0">
                      <Truck size={18} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-wider mb-1">Địa chỉ giao hàng</h4>
                      <p className="text-sm font-bold text-gray-800 leading-relaxed">
                        {selectedOrderDetails.shippingAddress || "Chưa cung cấp địa chỉ"}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedOrderDetails.orderDetails.map((detail: any, idx: number) => {
                  const product = detail.product;
                  const isGift = product?.isGift === true;

                  return (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Sản phẩm chính hoặc Quà tặng */}
                      <div className="bg-gray-50 p-4">
                        <div className="flex gap-4">
                          {/* Hình ảnh */}
                          {product?.imageUrl && (
                            <div className="w-24 h-24 shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Thông tin sản phẩm */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className="font-black text-gray-900 text-sm">
                                  {product?.name}
                                </h4>
                                {product?.sku && (
                                  <p className="text-[11px] text-gray-500 font-bold">
                                    SKU: {product.sku}
                                  </p>
                                )}
                                {isGift && (
                                  <span className="inline-block mt-2 px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-black rounded-md border border-rose-200">
                                    🎁 Quà tặng
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                {product?.basePrice && (
                                  <p className="font-black text-blue-700 text-sm">
                                    {product.basePrice?.toLocaleString()}đ
                                  </p>
                                )}
                                {detail.quantity && (
                                  <p className="text-[11px] text-gray-500 font-bold">
                                    x{detail.quantity}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nếu là Quà tặng, hiển thị các sản phẩm bên trong */}
                      {isGift && product?.giftComponents && product.giftComponents.length > 0 && (
                        <div className="border-t border-gray-200 p-4 bg-white">
                          <h5 className="font-black text-gray-800 text-xs uppercase mb-3 flex items-center gap-2">
                            <span className="text-rose-600">Sản phẩm trong quà tặng:</span>
                          </h5>
                          <div className="space-y-2">
                            {product.giftComponents.map((giftComponent: any, gIdx: number) => {
                              const giftItem = giftComponent.product;
                              return (
                                <div key={gIdx} className="flex gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                  {giftItem?.imageUrl && (
                                    <img
                                      src={giftItem.imageUrl}
                                      alt={giftItem.name}
                                      className="w-12 h-12 rounded object-cover shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-800 text-[11px] truncate">
                                      {giftItem?.name}
                                    </p>
                                    {giftItem?.sku && (
                                      <p className="text-[10px] text-gray-500">SKU: {giftItem.sku}</p>
                                    )}
                                    {giftItem?.basePrice && (
                                      <p className="font-black text-blue-600 text-[10px]">
                                        {giftItem.basePrice?.toLocaleString()}đ
                                      </p>
                                    )}
                                    {giftComponent?.quantity && (
                                      <p className="text-[10px] text-gray-600 font-bold">
                                        Số lượng: x{giftComponent.quantity}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex gap-2 justify-end">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-bold text-sm transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}