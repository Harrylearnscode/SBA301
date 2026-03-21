import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Calendar, ChevronDown, Clock, 
  Phone, Package, Tag, RefreshCw
} from 'lucide-react';
import OrderService from '../../api/service/order.service';

export default function OrderManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        setOrders(prev => prev.map(order => 
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
        setOrders(prev => prev.map(order => 
          order.id === id ? { ...order, payment: newStatus } : order
        ));
        // Nếu cần cập nhật lại paidTime từ server thì fetch lại
        if (newStatus === 'PAID') fetchOrders();
      }
    } catch (error) {
      alert("Lỗi cập nhật thanh toán");
    }
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
                // Lấy SĐT từ detail đầu tiên (theo JSON của bạn)
                const userPhone = order.orderDetails?.[0]?.product?.createdBy?.phone || "N/A";

                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* ID & Phone */}
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-gray-900 text-sm">#ORD-{order.id}</span>
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
                            <option value="PENDING">Chờ xác nhận</option>
                            <option value="PROCESSING">Đang chuẩn bị</option>
                            <option value="SHIPPED">Đang giao hàng</option>
                            <option value="DELIVERED">Đã hoàn thành</option>
                            <option value="CANCELLED">Đã hủy đơn</option>
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
    </div>
  );
}