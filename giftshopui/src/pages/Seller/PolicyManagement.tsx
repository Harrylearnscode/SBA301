import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, ShieldCheck, 
  ArrowRight, Percent, CircleDollarSign, Info 
} from 'lucide-react';
import PolicyService from '../../api/service/policy.service';

export default function PolicyManager() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State theo đúng JSON yêu cầu
  const [formData, setFormData] = useState({
    lowerLimit: 0,
    upperLimit: 0,
    discount: 0
  });

  const fetchPolicies = async () => {
    try {
      const res = await PolicyService.getAllPolicies();
      if (res.success) {
        // Sắp xếp chính sách theo hạn mức dưới tăng dần để dễ theo dõi
        const sorted = res.data.sort((a: any, b: any) => a.lowerLimit - b.lowerLimit);
        setPolicies(sorted);
      }
    } catch (error) {
      console.error("Lỗi tải chính sách:", error);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const openModal = (policy: any = null) => {
    if (policy) {
      setEditingId(policy.id);
      setFormData({
        lowerLimit: policy.lowerLimit,
        upperLimit: policy.upperLimit,
        discount: policy.discount
      });
    } else {
      setEditingId(null);
      setFormData({ lowerLimit: 0, upperLimit: 0, discount: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (editingId) {
        res = await PolicyService.updatePolicy(editingId, formData);
      } else {
        res = await PolicyService.createPolicy(formData);
      }

      if (res.success) {
        setIsModalOpen(false);
        fetchPolicies();
      } else {
        alert(res.message || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chính sách chiết khấu này?")) {
      try {
        const res = await PolicyService.deletePolicy(id);
        if (res.success) fetchPolicies();
      } catch (error) {
        alert("Không thể xóa chính sách này");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> Quản lý Chính sách Chiết khấu
          </h2>
          <p className="text-sm text-gray-500">Thiết lập mức giảm giá dựa trên giá trị đơn hàng của khách hàng.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md font-bold text-sm uppercase tracking-wide"
        >
          <Plus size={18} /> Thêm chính sách
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Lưu ý:</strong> Hệ thống sẽ tự động áp dụng mức chiết khấu cao nhất nếu giá trị đơn hàng nằm trong khoảng 
          từ <b>Hạn mức dưới (Lower)</b> đến <b>Hạn mức trên (Upper)</b>. Đơn vị tính của Hạn mức là VNĐ, Chiết khấu là %.
        </p>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-[10px] font-black tracking-widest border-b">
              <th className="p-5">Khoảng giá trị đơn hàng (VNĐ)</th>
              <th className="p-5 text-center">Mức chiết khấu</th>
              <th className="p-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {policies.length > 0 ? policies.map((policy) => (
              <tr key={policy.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Từ</span>
                      <span className="font-bold text-gray-900">{policy.lowerLimit?.toLocaleString()}đ</span>
                    </div>
                    <ArrowRight className="text-gray-300" size={16} />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Đến</span>
                      <span className="font-bold text-gray-900">{policy.upperLimit?.toLocaleString()}đ</span>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-center">
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-black text-sm border border-green-200">
                    <Percent size={14} /> {policy.discount}%
                  </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openModal(policy)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(policy.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="p-10 text-center text-gray-400 italic">Chưa có chính sách chiết khấu nào được thiết lập.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                {editingId ? 'Cập nhật chính sách' : 'Tạo chính sách mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24}/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                {/* Lower Limit */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Hạn mức dưới (Lower Limit) *</label>
                  <div className="relative">
                    <CircleDollarSign className="absolute left-3 top-3 text-gray-300" size={18} />
                    <input 
                      type="number" required min="0"
                      placeholder="0"
                      className="w-full border rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 font-bold"
                      value={formData.lowerLimit}
                      onChange={(e) => setFormData({...formData, lowerLimit: Number(e.target.value)})}
                    />
                  </div>
                </div>

                {/* Upper Limit */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Hạn mức trên (Upper Limit) *</label>
                  <div className="relative">
                    <CircleDollarSign className="absolute left-3 top-3 text-gray-300" size={18} />
                    <input 
                      type="number" required min="1"
                      placeholder="50,000,000"
                      className="w-full border rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 font-bold"
                      value={formData.upperLimit}
                      onChange={(e) => setFormData({...formData, upperLimit: Number(e.target.value)})}
                    />
                  </div>
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Phần trăm chiết khấu (%) *</label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 text-gray-300" size={18} />
                    <input 
                      type="number" required min="0" max="100"
                      placeholder="5"
                      className="w-full border rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-green-500 border-gray-200 font-black text-green-700 text-lg"
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors uppercase text-xs"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase text-xs tracking-widest"
                >
                  {editingId ? 'Lưu thay đổi' : 'Xác nhận tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}