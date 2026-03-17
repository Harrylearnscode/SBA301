import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import ProductService from '../../api/service/product.service';
import Toast from '../../components/ui/Toast';
import CategoryService from '../../api/service/category.service';

export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  
  // State cho Form
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    basePrice: '',
    categoryId: '',
    description: '',
    isGift: false,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [giftComponents, setGiftComponents] = useState<{ productId: number, quantity: number, productName: string }[]>([]);
  const [tempComponentId, setTempComponentId] = useState<string>('');
  const [tempComponentQty, setTempComponentQty] = useState<number>(1);

  // State cho Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Fetch dữ liệu
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await ProductService.getAllProducts(false); // Lấy tất cả, kể cả Inactive
      if (res.success) {
        setProducts(res.data);
      }
    } catch (error) {
      setToast({ show: true, message: 'Lỗi khi tải danh sách sản phẩm', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getAllCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Mở modal Thêm mới
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', sku: '', basePrice: '', categoryId: '', description: '', isGift: false, isActive: true });
    setImageFile(null);
    setIsModalOpen(true);
    setGiftComponents([]);
  };

  // Mở modal Cập nhật
  const handleOpenEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      sku: product.sku || '',
      basePrice: product.basePrice.toString(),
      categoryId: product.category.id.toString() || '',
      description: product.description || '',
      isGift: product.isGift || false,
      isActive: product.isActive,
    });
    setImageFile(null); // Reset file ảnh, nếu user không chọn ảnh mới thì backend giữ ảnh cũ
    if (product.isGift && product.giftComponents && product.giftComponents.length > 0) {
      const components = product.giftComponents.map((item: any) => ({
        // Lấy ID và Name tùy thuộc vào cấu trúc JSON Backend trả về
        productId: item.productId || (item.product ? item.product.id : 0), 
        quantity: item.quantity,
        productName: item.productName || (item.product ? item.product.name : 'Sản phẩm')
      }));
      setGiftComponents(components);
    } else {
      setGiftComponents([]);
    }

    setIsModalOpen(true);
  };

  const handleAddGiftComponent = () => {
    if (!tempComponentId) return;
    const selectedProduct = products.find(p => p.id === Number(tempComponentId));
    if (!selectedProduct) return;

    // Kiểm tra xem món này đã được chọn trước đó chưa, nếu có thì cộng dồn số lượng
    const existingIndex = giftComponents.findIndex(c => c.productId === selectedProduct.id);
    if (existingIndex >= 0) {
      const newList = [...giftComponents];
      newList[existingIndex].quantity += tempComponentQty;
      setGiftComponents(newList);
    } else {
      setGiftComponents(prev => [...prev, {
        productId: selectedProduct.id,
        quantity: tempComponentQty,
        productName: selectedProduct.name
      }]);
    }
    
    // Reset ô nhập liệu
    setTempComponentId('');
    setTempComponentQty(1);
  };

  // Hàm xóa một món khỏi giỏ quà tạm
  const handleRemoveGiftComponent = (productIdToRemove: number) => {
    setGiftComponents(prev => prev.filter(c => c.productId !== productIdToRemove));
  };

  // Hàm xử lý Submit Form (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Chuẩn bị chuỗi JSON cho RequestPart("product")
      const productPayload = {
        name: formData.name,
        sku: formData.sku,
        basePrice: Number(formData.basePrice),
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        description: formData.description,
        isGift: formData.isGift,
        isActive: formData.isActive,
        giftComponents: formData.isGift ? giftComponents.map(c => ({ productId: c.productId, quantity: c.quantity })) : []
      };

      // 2. Đóng gói vào FormData
      const submitData = new FormData();
      submitData.append('product', JSON.stringify(productPayload));
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      // 3. Gọi API
      let res;
      if (editingId) {
        res = await ProductService.updateProduct(editingId, submitData);
      } else {
        res = await ProductService.createProduct(submitData);
      }

      if (res.success) {
        setToast({ show: true, message: `${editingId ? 'Cập nhật' : 'Thêm'} sản phẩm thành công!`, type: 'success' });
        setIsModalOpen(false);
        fetchProducts(); // Refresh danh sách
      } else {
        setToast({ show: true, message: res.message || 'Có lỗi xảy ra', type: 'error' });
      }
    } catch (error: any) {
      setToast({ show: true, message: error || 'Lỗi hệ thống', type: 'error' });
    }
  };

  // Hàm Toggle Active (Xóa mềm)
  const handleToggleActive = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn thay đổi trạng thái sản phẩm này?')) return;
    try {
      const res = await ProductService.toggleActiveStatus(id);
      if (res.success) {
        setToast({ show: true, message: 'Đã cập nhật trạng thái!', type: 'success' });
        fetchProducts();
      }
    } catch (error) {
      setToast({ show: true, message: 'Không thể thay đổi trạng thái', type: 'error' });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">Thêm, sửa, xóa và quản lý danh sách sản phẩm.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-[#b30000] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-800 transition"
        >
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase tracking-wider">
                <th className="p-4 font-bold">ID</th>
                <th className="p-4 font-bold">Hình ảnh</th>
                <th className="p-4 font-bold">Tên sản phẩm / SKU</th>
                <th className="p-4 font-bold">Giá bán</th>
                <th className="p-4 font-bold">Trạng thái</th>
                <th className="p-4 font-bold text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10">Đang tải dữ liệu...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">Chưa có sản phẩm nào.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-sm text-gray-600">#{p.id}</td>
                    <td className="p-4">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded object-cover border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-800 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-500 mt-1">SKU: {p.sku}</p>
                    </td>
                    <td className="p-4 font-semibold text-[#b30000]">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.basePrice)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.isActive ? 'Đang bán' : 'Đã ẩn'}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      {/* SỬA NÚT NÀY ĐỂ CHUYỂN TRANG */}
                      <button 
                        onClick={() => window.location.href = `/admin/products/${p.id}`} 
                        className="text-blue-600 hover:text-blue-800 transition bg-blue-50 px-3 py-1 rounded" 
                        title="Xem chi tiết & Cập nhật"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM/SỬA SẢN PHẨM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg text-gray-800">{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                  <input required type="text" className="w-full border px-3 py-2 rounded focus:outline-none focus:border-[#b30000]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input required type="text" className="w-full border px-3 py-2 rounded focus:outline-none focus:border-[#b30000]" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ) *</label>
                  <input required type="number" className="w-full border px-3 py-2 rounded focus:outline-none focus:border-[#b30000]" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục sản phẩm</label>
                  <select 
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:border-[#b30000] bg-white"
                    value={formData.categoryId} 
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  >
                    <option value="" disabled>-- Chọn danh mục --</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
                <textarea rows={3} className="w-full border px-3 py-2 rounded focus:outline-none focus:border-[#b30000]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh đại diện (Tùy chọn khi cập nhật)</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="w-full border px-3 py-2 rounded text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-[#b30000] hover:file:bg-red-100" />
                {imageFile && <p className="text-xs text-green-600 mt-2">Đã chọn: {imageFile.name}</p>}
              </div>

              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.isGift} onChange={e => setFormData({...formData, isGift: e.target.checked})} className="w-4 h-4 text-[#b30000] rounded focus:ring-[#b30000]" />
                  Là giỏ quà (Set)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-[#b30000] rounded focus:ring-[#b30000]" />
                  Đang hoạt động
                </label>
              </div>

              {/* KHU VỰC THÊM THÀNH PHẦN (Chỉ hiện khi tích chọn "Là giỏ quà") */}
              {formData.isGift && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50/50 space-y-4 mt-4">
                  <h4 className="font-bold text-sm text-[#b30000] border-b border-red-200 pb-2">Thành phần giỏ quà</h4>
                  
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Chọn sản phẩm lẻ</label>
                      <select 
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-[#b30000] bg-white text-sm"
                        value={tempComponentId}
                        onChange={(e) => setTempComponentId(e.target.value)}
                      >
                        <option value="" disabled>-- Chọn món để thêm --</option>
                        {/* Chỉ hiện sản phẩm thường (không phải giỏ quà) và loại trừ chính nó (nếu đang Edit) */}
                        {products.filter(p => !p.isGift && p.id !== editingId).map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} - {new Intl.NumberFormat('vi-VN').format(p.basePrice)}đ
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng</label>
                      <input 
                        type="number" min="1" 
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-[#b30000] text-sm text-center"
                        value={tempComponentQty}
                        onChange={(e) => setTempComponentQty(Number(e.target.value))}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={handleAddGiftComponent}
                      className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition text-sm font-bold h-[38px]"
                    >
                      Thêm
                    </button>
                  </div>

                  {/* Danh sách các món đã thêm */}
                  {giftComponents.length > 0 && (
                    <ul className="space-y-2 mt-2">
                      {giftComponents.map((comp) => (
                        <li key={comp.productId} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-gray-100 text-sm">
                          <div>
                            <span className="font-bold text-[#b30000] mr-2">{comp.quantity}x</span> 
                            <span className="font-medium text-gray-700">{comp.productName}</span>
                          </div>
                          <button type="button" onClick={() => handleRemoveGiftComponent(comp.productId)} className="text-gray-400 hover:text-red-600 transition">
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition">Hủy</button>
                <button type="submit" className="px-6 py-2 bg-[#b30000] text-white rounded hover:bg-red-800 transition font-bold shadow-md">
                  {editingId ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}