import React, { useState, useEffect } from 'react';
import { Plus, Edit, X, Package, Calendar, Hash, Layers } from 'lucide-react';
import ItemService from '../../api/service/item.service';
import ProductService from '../../api/service/product.service';

export default function ItemManager() {
  const [items, setItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    productId: '',
    batchCode: '',
    initialQuantity: 0,
    expiredDate: ''
  });

  const fetchData = async () => {
    try {
      const [itemRes, prodRes] = await Promise.all([
        ItemService.getAllItems(),
        ProductService.getAllProducts(false)
      ]);
      if (itemRes.success) setItems(itemRes.data);
      if (prodRes.success) setProducts(prodRes.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (item: any = null) => {
    if (item) {
      // CHẾ ĐỘ SỬA: Gán ID vào editingId
      setEditingId(item.id);
      setFormData({
        productId: item.productId || 0,
        batchCode: item.batchCode || '',
        initialQuantity: item.initialQuantity || 0,
        expiredDate: item.expiredDate ? item.expiredDate.split('T')[0] : ''
      });
    } else {
      // CHẾ ĐỘ THÊM: Reset editingId về null
      setEditingId(null);
      setFormData({ productId: '', batchCode: '', initialQuantity: 0, expiredDate: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        productId: Number(formData.productId),
        batchCode: formData.batchCode,
        initialQuantity: Number(formData.initialQuantity),
        expiredDate: formData.expiredDate
      };

      let res;
      if (editingId) {
        res = await ItemService.updateItemBatch(editingId, payload);
      } else {
        res = await ItemService.createItemBatch(payload);
      }

      if (res.success) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(res.message || "Thao tác thất bại");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="space-y-6 text-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Kho Vật Phẩm</h2>
          <p className="text-sm text-gray-500">Quản lý lô hàng và hạn dùng.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md font-bold"
        >
          <Plus size={18} /> Nhập kho mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-[11px] font-bold tracking-wider">
              <th className="p-4 border-b">Tên sản phẩm</th>
              <th className="p-4 border-b">Batch Code</th>
              <th className="p-4 border-b text-center">SL Nhập</th>
              <th className="p-4 border-b text-center">SL Hiện tại</th>
              <th className="p-4 border-b">Hạn sử dụng</th>
              <th className="p-4 border-b text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900">{item.productName}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded font-mono text-xs border border-gray-200">
                    {item.batchCode}
                  </span>
                </td>
                <td className="p-4 text-center text-blue-600">{item.initialQuantity}</td>
                <td className="p-4 text-center font-bold text-gray-900">{item.currentQuantity}</td>
                <td className="p-4 text-gray-600">{new Date(item.expiredDate).toLocaleDateString('vi-VN')}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => openModal(item)} 
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight flex items-center gap-2">
                <Package className="text-blue-600" size={24} />
                {editingId !== null ? 'CẬP NHẬT LÔ HÀNG' : 'NHẬP KHO MỚI'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24}/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* CHỈ HIỆN KHI THÊM MỚI (editingId === null) */}
              {editingId === null && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Sản phẩm *</label>
                    <select 
                      required
                      className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white border-gray-200"
                      value={formData.productId}
                      onChange={(e) => setFormData({...formData, productId: e.target.value})}
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Số lượng nhập *</label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-3.5 text-gray-300" size={18} />
                      <input 
                        type="number" required min="1"
                        className="w-full border rounded-lg p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                        value={formData.initialQuantity}
                        onChange={(e) => setFormData({...formData, initialQuantity: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* LUÔN HIỆN KHI CẢ SỬA VÀ THÊM */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Mã lô hàng (Batch Code) *</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3.5 text-gray-300" size={18} />
                  <input 
                    type="text" required
                    placeholder="LOT-XXXX"
                    className="w-full border rounded-lg p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                    value={formData.batchCode}
                    onChange={(e) => setFormData({...formData, batchCode: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Hạn sử dụng *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-gray-300" size={18} />
                  <input 
                    type="date" required
                    className="w-full border rounded-lg p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
                    value={formData.expiredDate}
                    onChange={(e) => setFormData({...formData, expiredDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  {editingId !== null ? 'Cập nhật lô hàng' : 'Xác nhận nhập kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}