import React, { useState, useEffect } from 'react';
import { Clock, User, Phone, Send, CheckCircle, UserPlus, Calendar, DollarSign, Package, Image as ImageIcon } from 'lucide-react';
import QuoteService from '../../api/service/quote.service';

export default function QuoteManager() {
  const [quotes, setQuotes] = useState<any[]>([]);
  // Lưu trữ dữ liệu nhập liệu cho từng quote: { [quoteId]: { validUntil, prices: { [quoteProductId]: price } } }
  const [pricingInputs, setPricingInputs] = useState<any>({});

  const [quoteToSubmit, setQuoteToSubmit] = useState<number | null>(null);

  const fetchQuotes = async () => {
    try {
      const res = await QuoteService.getAllQuotes();
      if (res.success) {
        setQuotes(res.data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách báo giá:", error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // 1. Gán yêu cầu cho bản thân
  const handleAssign = async (quoteId: number) => {
    try {
      const res = await QuoteService.assignToMe(quoteId);
      if (res.success) {
        alert("Đã nhận yêu cầu thành công!");
        fetchQuotes();
      }
    } catch (error) {
      alert("Không thể nhận yêu cầu này.");
    }
  };

  // 2. Xử lý thay đổi giá đề xuất cho từng sản phẩm
  const handlePriceChange = (quoteId: number, quoteProductId: number, value: string) => {
    setPricingInputs((prev: any) => ({
      ...prev,
      [quoteId]: {
        ...prev[quoteId],
        prices: {
          ...(prev[quoteId]?.prices || {}),
          [quoteProductId]: Number(value)
        }
      }
    }));
  };

  // 3. Xử lý thay đổi ngày hết hạn
  const handleDateChange = (quoteId: number, value: string) => {
    setPricingInputs((prev: any) => ({
      ...prev,
      [quoteId]: {
        ...prev[quoteId],
        validUntil: value
      }
    }));
  };

  // 4. Gửi báo giá cuối cùng
  const handleSubmitPricing = async (quoteId: number) => {
    const inputData = pricingInputs[quoteId];
    if (!inputData?.validUntil) {
      alert("Vui lòng chọn thời hạn báo giá!");
      return;
    }

    // Tạo mảng itemPrices từ state
    const itemPrices = Object.entries(inputData.prices || {}).map(([id, price]) => ({
      quoteProductId: Number(id),
      quotedPrice: Number(price)
    }));

    if (itemPrices.length === 0) {
      alert("Vui lòng nhập giá đề xuất cho ít nhất một sản phẩm!");
      return;
    }

    try {
      const payload = {
        validUntil: new Date(inputData.validUntil).toISOString(),
        itemPrices: itemPrices
      };

      const res = await QuoteService.providePricing(quoteId, payload);
      if (res.success) {
        alert("Đã gửi báo giá thành công!");
        fetchQuotes();
      }
    } catch (error) {
      alert("Lỗi khi gửi báo giá.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Báo Giá</h2>
        <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border">
          Tổng cộng: {quotes.length} yêu cầu
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header Quote */}
<div className="p-5 border-b bg-gray-50/50 flex flex-col md:flex-row justify-between gap-4">
  <div className="flex gap-4">
    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
      <User size={24} />
    </div>
    <div>
      <h4 className="font-bold text-gray-900 text-lg uppercase">
        Yêu cầu #{quote.id} - {quote.user?.fullName || quote.user?.username}
      </h4>
      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
        <span className="flex items-center gap-1"><Phone size={14}/> {quote.user?.phone || 'N/A'}</span>
        <span className="flex items-center gap-1"><Clock size={14}/> {new Date(quote.createdAt).toLocaleString('vi-VN')}</span>
      </div>
    </div>
  </div>

  <div className="flex items-center gap-3">
    {/* TRẠNG THÁI QUOTE */}
    <StatusBadge status={quote.status} />

    {/* THÊM: HẠN BÁO GIÁ (VALID UNTIL) CẠNH TRẠNG THÁI */}
    {quote.validUntil ? (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-white text-indigo-700 rounded-full text-[10px] font-bold border border-indigo-200 shadow-sm uppercase tracking-wider">
        <Calendar size={12} className="text-indigo-400" />
        Hạn: {new Date(quote.validUntil).toLocaleDateString('vi-VN')}
      </div>
    ) : (
      <div className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-[10px] font-bold border border-gray-200 uppercase tracking-wider">
        Chưa có hạn
      </div>
    )}

    {/* NÚT ASSIGN HOẶC THÔNG TIN SALES */}
    {!quote.salesStaff ? (
      <button 
        onClick={() => handleAssign(quote.id)}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-md active:scale-95"
      >
        <UserPlus size={16} /> Nhận xử lý
      </button>
    ) : (
      <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-100">
        <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center">
            <User size={10} className="text-indigo-700" />
        </div>
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">
          Sale: {quote.salesStaff.username}
        </span>
      </div>
    )}
  </div>
</div>

            {/* Chi tiết sản phẩm & Form báo giá */}
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Danh sách sản phẩm trong Quote */}
                <div className="lg:col-span-2 space-y-3">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Sản phẩm yêu cầu:</h5>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr className="text-[10px] text-gray-500 font-bold uppercase">
                          <th className="p-3 text-left">Tên sản phẩm</th>
                          <th className="p-3 text-center">Giá gốc</th>
                          <th className="p-3 text-center">Số lượng</th>
                          <th className="p-3 text-right">Giá đề xuất (VNĐ)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {quote.quoteProducts?.map((qp: any) => {
                          const isGift = qp.product?.isGift === true;
                          
                          return (
                            <tr key={qp.id} className="hover:bg-gray-50/50">
                              <td className="p-3">
                                <div className="flex gap-3">
                                  {/* Ảnh sản phẩm (Thu nhỏ) */}
                                  <div className="w-12 h-12 shrink-0 rounded bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                    {qp.product?.imageUrl ? (
                                      <img src={qp.product.imageUrl} alt={qp.product.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <ImageIcon size={16} className="text-gray-400" />
                                    )}
                                  </div>

                                  {/* Thông tin sản phẩm & Các món thành phần */}
                                  <div className="flex-1">
                                    <p className="font-bold text-gray-800 text-sm">{qp.product?.name}</p>
                                    {qp.product?.sku && <p className="text-[10px] text-gray-500">SKU: {qp.product.sku}</p>}
                                    
                                    {/* Khối hiển thị chi tiết các món trong Giỏ Quà */}
                                    {isGift && qp.product?.giftComponents && qp.product.giftComponents.length > 0 && (
                                      <div className="mt-2 bg-rose-50/50 rounded-lg p-2 border border-rose-100 w-full max-w-sm">
                                        <p className="text-[10px] font-bold text-rose-600 uppercase mb-1 flex items-center gap-1">
                                          <Package size={12} /> Thành phần hộp quà:
                                        </p>
                                        <div className="space-y-1">
                                          {qp.product.giftComponents.map((gc: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center text-[11px] border-b border-rose-100/50 last:border-0 pb-1 last:pb-0">
                                              <span className="text-gray-700 font-medium line-clamp-1 pr-2">
                                                - {gc.product?.name}
                                              </span>
                                              <span className="text-gray-500 font-bold shrink-0">
                                                x{gc.quantity}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              {/* Căn chỉnh các cột còn lại lên top để đồng bộ với cột Tên sản phẩm */}
                              <td className="p-3 text-center text-gray-500 align-top pt-4">
                                {qp.product?.basePrice?.toLocaleString()}đ
                              </td>
                              <td className="p-3 text-center font-bold align-top pt-4">
                                x{qp.quantity}
                              </td>
                              <td className="p-3 align-top pt-2">
                                <div className="flex justify-end">
                                  <input 
                                    type="number" 
                                    placeholder="Nhập giá..."
                                    disabled={quote.status !== 'PENDING' && quote.status !== 'PROCESSING'}
                                    className="w-32 border border-gray-200 rounded-lg p-2 text-right text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-600 bg-white"
                                    onChange={(e) => handlePriceChange(quote.id, qp.id, e.target.value)}
                                    defaultValue={qp.quotedPrice}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Form gửi báo giá */}
                <div className="bg-gray-50 rounded-xl p-5 border border-dashed border-gray-300">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Xác nhận báo giá:</h5>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5">Thời hạn báo giá (Valid Until):</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-2.5 text-gray-400" />
                        <input 
                          type="date" 
                          className="w-full border rounded-lg p-2.5 pl-10 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                          onChange={(e) => handleDateChange(quote.id, e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button 
                        // THAY ĐỔI ONCLICK TẠI ĐÂY: Mở Modal thay vì gọi thẳng hàm
                        onClick={() => setQuoteToSubmit(quote.id)}
                        disabled={!quote.salesStaff || (quote.status !== 'PENDING' && quote.status !== 'PROCESSING')}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-lg ${
                          quote.salesStaff 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send size={18} /> Gửi báo giá cho khách
                      </button>
                      {!quote.salesStaff && (
                        <p className="text-[10px] text-center text-amber-600 mt-2 font-medium">
                          * Bạn cần nhận xử lý trước khi gửi báo giá
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
      {/* MODAL CONFIRM: GỬI BÁO GIÁ CHO KHÁCH */}
      {quoteToSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gửi báo giá?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Bạn có chắc chắn muốn chốt mức giá này và gửi cho khách hàng? Khách hàng sẽ nhận được thông báo ngay lập tức.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setQuoteToSubmit(null)} 
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  Kiểm tra lại
                </button>
                <button 
                  onClick={() => {
                    handleSubmitPricing(quoteToSubmit);
                    setQuoteToSubmit(null);
                  }} 
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  Xác nhận Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: "bg-amber-100 text-amber-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}