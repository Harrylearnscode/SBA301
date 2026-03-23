import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Phone, Package, XCircle, Receipt } from 'lucide-react';
import OrderService from '../../api/service/order.service';
import Toast from '../../components/ui/Toast';

// Bộ từ điển trạng thái
const ORDER_STATUS: Record<string, { label: string, color: string }> = {
    PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    PROCESSING: { label: 'Đang chuẩn bị', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    SHIPPED: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    DELIVERED: { label: 'Giao thành công', color: 'bg-green-100 text-green-700 border-green-200' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200' }
};

const PAYMENT_STATUS: Record<string, string> = {
    UNPAID: 'Chưa thanh toán (Thanh toán khi nhận hàng)',
    PAID: 'Đã thanh toán',
    REFUNDED: 'Đã hoàn tiền'
};

export default function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const res = await OrderService.getOrderById(id!); //
            if (res.success) setOrder(res.data);
        } catch (error) {
            setToast({ show: true, message: 'Lỗi tải thông tin đơn hàng', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const handleCancelOrder = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
        try {
            const res = await OrderService.cancelOrder(id!); //
            if (res.success) {
                setToast({ show: true, message: 'Đã hủy đơn hàng thành công', type: 'success' });
                fetchOrderDetail(); // Tải lại để cập nhật trạng thái CANCELLED
            } else {
                setToast({ show: true, message: res.message || 'Không thể hủy đơn hàng', type: 'error' });
            }
        } catch (error) {
            setToast({ show: true, message: 'Lỗi hệ thống khi hủy đơn', type: 'error' });
        }
    };

    const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

    if (loading) return <div className="p-20 text-center text-gray-500">Đang tải dữ liệu...</div>;
    if (!order) return <div className="p-20 text-center text-red-500">Không tìm thấy đơn hàng.</div>;

    // Tính toán lại tổng tiền gốc (trước khi giảm giá) để hiển thị chi tiết
    const subTotal = order.orderDetails?.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity), 0) || 0;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-4xl mx-auto px-4 pt-8">
                {/* Nút quay lại */}
                <button onClick={() => navigate('/history')} className="flex items-center gap-2 text-gray-500 hover:text-[#b30000] mb-6 transition font-medium">
                    <ArrowLeft size={18} /> Quay lại lịch sử
                </button>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Đơn hàng */}
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Receipt className="text-[#b30000]" /> Chi tiết Đơn hàng #{order.id}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                                <Clock size={14} /> Đặt lúc: {new Date(order.orderDate).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold text-sm border ${ORDER_STATUS[order.status]?.color}`}>
                            {ORDER_STATUS[order.status]?.label || order.status}
                        </div>
                    </div>

                    {/* Thông tin Giao hàng & Thanh toán */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-gray-100 bg-gray-50/50">
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Thông tin nhận hàng</h3>
                            <div className="space-y-2 text-gray-700">
                                <p className="flex items-start gap-2"><MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" /> <span>{order.shippingAddress}</span></p>
                                <p className="flex items-center gap-2"><Phone size={18} className="text-gray-400 shrink-0" /> <span>{order.shipperPhoneNumber}</span></p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Thông tin thanh toán</h3>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Trạng thái:</strong> <span className={order.payment === 'PAID' ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold'}>{PAYMENT_STATUS[order.payment] || order.payment}</span></p>
                                <p><strong>Giảm giá áp dụng:</strong> {order.discountApplied > 0 ? `${order.discountApplied}%` : 'Không có'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách Sản phẩm */}
                    <div className="p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Package size={18} /> Sản phẩm đã đặt ({order.totalItem} món)
                        </h3>
                        <div className="space-y-4">
                            {order.orderDetails?.map((item: any) => (
                                <div key={item.id} className="flex gap-4 items-center p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition">
                                    <img src={item.product?.imageUrl || 'https://placehold.co/100'} alt={item.product?.name} className="w-16 h-16 object-cover rounded border border-gray-200" />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800 line-clamp-1">{item.product?.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">Đơn giá: {formatPrice(item.unitPrice)}</p>
                                    </div>
                                    <div className="text-center px-4 bg-gray-50 rounded py-1">
                                        <p className="text-xs text-gray-500">SL</p>
                                        <p className="font-bold text-gray-800">x{item.quantity}</p>
                                    </div>
                                    <div className="text-right w-28 md:w-32 border-l border-gray-100 pl-4">
                                        <p className="font-bold text-[#b30000]">
                                            {formatPrice(item.unitPrice * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tổng kết tiền & Nút Hủy */}
                    <div className="bg-gray-50 p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-200">
                        {order.status === 'PENDING' ? (
                            <button 
                                onClick={handleCancelOrder}
                                className="w-full md:w-auto px-6 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
                            >
                                <XCircle size={18} /> Hủy đơn hàng này
                            </button>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                {/* Chỗ trống giữ layout nếu không có nút hủy */}
                                {order.status === 'CANCELLED' ? 'Đơn hàng đã được hủy.' : 'Đơn hàng đang được xử lý, không thể hủy.'}
                            </div>
                        )}

                        <div className="w-full md:w-auto text-right space-y-2">
                            <div className="flex justify-between md:justify-end gap-8 text-sm text-gray-500">
                                <span>Tạm tính:</span>
                                <span>{formatPrice(subTotal)}</span>
                            </div>
                            {order.discountApplied > 0 && (
                                <div className="flex justify-between md:justify-end gap-8 text-sm text-green-600">
                                    <span>Khuyến mãi ({order.discountApplied}%):</span>
                                    <span>- {formatPrice(subTotal - order.totalPrice)}</span>
                                </div>
                            )}
                            <div className="flex justify-between md:justify-end gap-8 text-lg md:text-xl font-bold pt-2 border-t border-gray-200">
                                <span className="text-gray-800">Tổng thanh toán:</span>
                                <span className="text-[#b30000]">{formatPrice(order.totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
}