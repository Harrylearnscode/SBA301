import React, { useState, useEffect } from 'react';
import { Package, FileText, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import OrderService from '../../api/service/order.service';
import QuoteService from '../../api/service/quote.service';
import { useNavigate } from 'react-router-dom';

// --- BỘ TỪ ĐIỂN DỊCH TRẠNG THÁI VÀ MÀU SẮC ---
const ORDER_STATUS: Record<string, { label: string, color: string }> = {
    PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
    PROCESSING: { label: 'Đang chuẩn bị', color: 'bg-blue-100 text-blue-700' },
    SHIPPED: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700' },
    DELIVERED: { label: 'Thành công', color: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' }
};

const QUOTE_STATUS: Record<string, { label: string, color: string }> = {
    PENDING: { label: 'Đang chờ Sale', color: 'bg-yellow-100 text-yellow-700' },
    PROCESSING: { label: 'Đang tư vấn', color: 'bg-blue-100 text-blue-700' },
    QUOTED: { label: 'Đã có báo giá', color: 'bg-green-100 text-green-800 border border-green-300' },
    ACCEPTED: { label: 'Đã đồng ý', color: 'bg-emerald-100 text-emerald-700' },
    REJECTED: { label: 'Đã từ chối', color: 'bg-gray-100 text-gray-600' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' }
};

export default function HistoryPage() {
    const [activeTab, setActiveTab] = useState<'orders' | 'quotes'>('orders');
    
    const [orders, setOrders] = useState<any[]>([]);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch song song cả 2 dữ liệu cho nhanh
                const [orderRes, quoteRes] = await Promise.all([
                    OrderService.getMyOrders(),
                    QuoteService.getMyQuotes()
                ]);

                if (orderRes.success) setOrders(orderRes.data);
                if (quoteRes.success) setQuotes(quoteRes.data);
            } catch (error) {
                console.error("Lỗi tải lịch sử:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Banner */}
            <div className="bg-[#4a0404] py-12 text-center">
                <h1 className="text-3xl font-serif text-[#facc15] font-bold uppercase tracking-widest">Lịch sử giao dịch</h1>
                <p className="text-white/80 mt-2 text-sm italic">Quản lý các đơn hàng và yêu cầu báo giá của bạn</p>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
                {/* TABS CONTROLLER */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`pb-4 px-4 font-bold uppercase text-sm flex items-center gap-2 transition-all ${activeTab === 'orders' ? 'text-[#b30000] border-b-2 border-[#b30000]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Package size={18} /> Đơn hàng của tôi ({orders.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('quotes')}
                        className={`pb-4 px-4 font-bold uppercase text-sm flex items-center gap-2 transition-all ${activeTab === 'quotes' ? 'text-[#b30000] border-b-2 border-[#b30000]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <FileText size={18} /> Yêu cầu báo giá ({quotes.length})
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500"><div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-[#b30000] rounded-full mb-4"></div><p>Đang tải dữ liệu...</p></div>
                ) : (
                    <div className="animate-in fade-in duration-500">
                        
                        {/* TAB ĐƠN HÀNG */}
                        {activeTab === 'orders' && (
                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <div className="bg-white p-12 text-center rounded-lg shadow-sm"><Package className="mx-auto text-gray-300 mb-4" size={48} /><p className="text-gray-500">Bạn chưa có đơn hàng nào.</p></div>
                                ) : (
                                    orders.map(order => (
                                        <div key={order.id} onClick={() => navigate(`/order/${order.id}`)} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition cursor-pointer group">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-bold text-lg text-gray-800">Đơn #{order.id}</span>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${ORDER_STATUS[order.status]?.color || 'bg-gray-100'}`}>
                                                        {ORDER_STATUS[order.status]?.label || order.status}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500 space-y-1">
                                                    <p className="flex items-center gap-1"><Clock size={14}/> Đặt lúc: {formatDate(order.orderDate)}</p>
                                                    <p>Số lượng: {order.totalItem} sản phẩm</p>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between">
                                                <p className="font-bold text-[#b30000] text-lg">{formatPrice(order.totalPrice)}</p>
                                                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center mt-0 sm:mt-2 group-hover:translate-x-1 transition-transform">
                                                    Xem chi tiết <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* TAB BÁO GIÁ */}
                        {activeTab === 'quotes' && (
                            <div className="space-y-4">
                                {quotes.length === 0 ? (
                                    <div className="bg-white p-12 text-center rounded-lg shadow-sm"><FileText className="mx-auto text-gray-300 mb-4" size={48} /><p className="text-gray-500">Bạn chưa gửi yêu cầu báo giá nào.</p></div>
                                ) : (
                                    quotes.map(quote => (
                                        <div key={quote.id} onClick={() => navigate(`/quote/${quote.id}`)} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition cursor-pointer group">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-bold text-lg text-gray-800">Yêu cầu #{quote.id}</span>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${QUOTE_STATUS[quote.status]?.color || 'bg-gray-100'}`}>
                                                        {QUOTE_STATUS[quote.status]?.label || quote.status}
                                                    </span>
                                                    {quote.status === 'QUOTED' && (
                                                        <span className="flex items-center gap-1 text-xs text-[#b30000] font-bold animate-pulse"><AlertCircle size={14}/> Cần bạn phản hồi</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 space-y-1">
                                                    <p className="flex items-center gap-1"><Clock size={14}/> Gửi lúc: {formatDate(quote.createdAt)}</p>
                                                    <p>Gồm: {quote.quoteProducts?.length || 0} loại sản phẩm</p>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between">
                                                {/* Chỉ hiện tổng tiền nếu Sale đã báo giá, nếu chưa hiện chữ "Đang chờ" */}
                                                <p className="font-bold text-[#b30000] text-lg">
                                                    {quote.totalPrice > 0 ? formatPrice(quote.totalPrice) : <span className="text-gray-400 italic text-sm">Chưa có giá</span>}
                                                </p>
                                                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center mt-0 sm:mt-2 group-hover:translate-x-1 transition-transform">
                                                    {quote.status === 'QUOTED' ? 'Xem giá & Chốt' : 'Xem chi tiết'} <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}