import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';
import QuoteService from '../../api/service/quote.service';
import Toast from '../../components/ui/Toast';

const QUOTE_STATUS: Record<string, { label: string, color: string }> = {
    PENDING: { label: 'Đang chờ Sale', color: 'bg-yellow-100 text-yellow-700' },
    PROCESSING: { label: 'Đang tư vấn', color: 'bg-blue-100 text-blue-700' },
    QUOTED: { label: 'Đã có báo giá', color: 'bg-green-100 text-green-800' },
    ACCEPTED: { label: 'Đã đồng ý', color: 'bg-emerald-100 text-emerald-700' },
    REJECTED: { label: 'Đã từ chối', color: 'bg-gray-100 text-gray-600' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' }
};

export default function QuoteDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quote, setQuote] = useState<any>(null);
    const [shippingAddress, setShippingAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
    const [replyAction, setReplyAction] = useState<boolean | null>(null);
   
    const fetchQuoteDetail = async () => {
        try {
            setLoading(true);
            const res = await QuoteService.getQuoteById(id!);
            if (res.success) setQuote(res.data);
        } catch (error) {
            setToast({ show: true, message: 'Lỗi tải thông tin báo giá', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuoteDetail();
    }, [id]);

    const confirmReply = async () => {
        if (replyAction === null) return;
        try {
            const res = await QuoteService.replyToQuote(id!, replyAction);
            if (res.success) {
                setToast({ show: true, message: replyAction ? 'Đã chốt giá thành công!' : 'Đã từ chối báo giá', type: 'success' });
                fetchQuoteDetail(); // Refresh lại data
            }
        } catch (error) {
            setToast({ show: true, message: 'Có lỗi xảy ra', type: 'error' });
        } finally {
            setReplyAction(null); // Đóng modal
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Bạn có chắc muốn hủy yêu cầu này?')) return;
        try {
            const res = await QuoteService.cancelQuote(id!);
            if (res.success) {
                setToast({ show: true, message: 'Đã hủy yêu cầu', type: 'success' });
                fetchQuoteDetail();
            }
        } catch (error) {
            setToast({ show: true, message: 'Không thể hủy yêu cầu', type: 'error' });
        }
    };

    const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

    if (loading) return <div className="p-20 text-center text-gray-500">Đang tải dữ liệu...</div>;
    if (!quote) return <div className="p-20 text-center text-red-500">Không tìm thấy yêu cầu báo giá.</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="max-w-4xl mx-auto px-4 pt-8">
                <button onClick={() => navigate('/history')} className="flex items-center gap-2 text-gray-500 hover:text-[#b30000] mb-6 transition">
                    <ArrowLeft size={18} /> Quay lại lịch sử
                </button>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="text-[#b30000]" /> Chi tiết Yêu cầu #{quote.id}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                                <Clock size={14} /> Gửi lúc: {new Date(quote.createdAt).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold text-sm border ${QUOTE_STATUS[quote.status]?.color}`}>
                            {QUOTE_STATUS[quote.status]?.label}
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className="p-6">
                        <h3 className="font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">Danh sách sản phẩm yêu cầu</h3>
                        <div className="space-y-4">
                            {quote.quoteProducts.map((item: any) => (
                                <div key={item.id} className="flex gap-4 items-center p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                                    <img src={item.product?.imageUrl || 'https://placehold.co/100'} alt="product" className="w-16 h-16 object-cover rounded border border-gray-200" />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800">{item.product?.name}</p>
                                        <p className="text-xs text-gray-500">Giá tham khảo: {formatPrice(item.product?.basePrice)}</p>
                                    </div>
                                    <div className="text-center px-4">
                                        <p className="text-xs text-gray-500">SL</p>
                                        <p className="font-bold">x{item.quantity}</p>
                                    </div>
                                    <div className="text-right w-32 border-l border-gray-200 pl-4">
                                        <p className="text-xs text-gray-500">Giá Sale chốt</p>
                                        <p className="font-bold text-[#b30000]">
                                            {quote.status === 'PENDING' || quote.status === 'PROCESSING' ? 'Đang cập nhật...' : formatPrice(item.quotedPrice)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tổng kết & Hành động */}
                    <div className="bg-gray-50 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase">Tổng tiền chốt (Dự kiến):</p>
                            <p className="text-3xl font-bold text-[#b30000]">
                                {quote.totalPrice > 0 ? formatPrice(quote.totalPrice) : 'Chưa có giá'}
                            </p>
                            {quote.validUntil && quote.status === 'QUOTED' && (
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} className="text-red-500" /> Báo giá có hiệu lực đến: {new Date(quote.validUntil).toLocaleDateString('vi-VN')}
                                </p>
                            )}
                            {quote.status === 'QUOTED' && (
                                <div className="mt-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Địa chỉ giao hàng <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="Nhập địa chỉ giao hàng của bạn..."
                                        rows={3}
                                        className="w-full md:w-90 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b30000] focus:border-transparent text-sm"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            {quote.status === 'PENDING' && (
                                <button onClick={handleCancel} className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition">Hủy yêu cầu</button>
                            )}
                            
                            {quote.status === 'QUOTED' && (
                                <>
                                    {/* Mở Modal Từ chối */}
                                    <button onClick={() => setReplyAction(false)} className="flex-1 md:flex-none px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition flex justify-center items-center gap-2"><XCircle size={18} /> Từ chối</button>
                                    
                                    {/* Mở Modal Đồng ý */}
                                    <button onClick={() => setReplyAction(true)} className="flex-1 md:flex-none px-8 py-3 bg-[#b30000] text-white font-bold rounded-lg hover:bg-red-800 shadow-lg shadow-red-200 transition flex justify-center items-center gap-2"><CheckCircle size={18} /> Đồng ý mức giá này</button>
                                </>
                            )}
                            
                            {(quote.status === 'ACCEPTED' || quote.status === 'REJECTED' || quote.status === 'CANCELLED') && (
                                <span className="text-sm text-gray-500 italic">Yêu cầu báo giá đã đóng.</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* MODAL CONFIRM: KHÁCH HÀNG ĐỒNG Ý / TỪ CHỐI */}
            {replyAction !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${replyAction ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                {replyAction ? <CheckCircle size={32} /> : <XCircle size={32} />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {replyAction ? 'Xác nhận chốt giá?' : 'Từ chối báo giá?'}
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">
                                {replyAction 
                                    ? 'Bạn đồng ý với mức giá Sale đã đề xuất? Đơn hàng sẽ được tiến hành ngay sau khi xác nhận.' 
                                    : 'Bạn không hài lòng với mức giá này và muốn từ chối yêu cầu?'}
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setReplyAction(null)} 
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                                >
                                    Quay lại
                                </button>
                                <button 
                                    onClick={confirmReply} 
                                    className={`flex-1 py-3 text-white font-bold rounded-xl transition shadow-lg ${replyAction ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-gray-800 hover:bg-gray-900 shadow-gray-200'}`}
                                >
                                    {replyAction ? 'Đồng ý' : 'Từ chối'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        
        </div>
    );
}