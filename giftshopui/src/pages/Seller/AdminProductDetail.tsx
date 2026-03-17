import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import ProductService from '../../api/service/product.service';
import CategoryService from '../../api/service/category.service';
import Toast from '../../components/ui/Toast';

export default function AdminProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '', sku: '', basePrice: '', categoryId: '', description: '', isGift: false, isActive: true, imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // State quản lý giỏ quà
  const [giftComponents, setGiftComponents] = useState<{ productId: number, quantity: number, productName: string }[]>([]);
  const [tempComponentId, setTempComponentId] = useState<string>('');
  const [tempComponentQty, setTempComponentQty] = useState<number>(1);
  const [allProducts, setAllProducts] = useState<any[]>([]); // Để chọn món thêm vào giỏ

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Chạy song song 3 API để tiết kiệm thời gian
        const [prodRes, catRes, allProdRes] = await Promise.all([
          ProductService.getProductById(id!),
          CategoryService.getAllCategories(),
          ProductService.getAllProducts(false)
        ]);

        if (catRes.success) setCategories(catRes.data);
        if (allProdRes.success) setAllProducts(allProdRes.data);

        if (prodRes.success) {
          const p = prodRes.data;
          setFormData({
            name: p.name,
            sku: p.sku || '',
            basePrice: p.basePrice?.toString() || '0',
            categoryId: p.category ? p.category.id.toString() : (p.categoryId?.toString() || ''),
            description: p.description || '',
            isGift: p.isGift || false,
            isActive: p.isActive,
            imageUrl: p.imageUrl || ''
          });

          if (p.isGift && p.giftComponents) {
            const components = p.giftComponents.map((item: any) => ({
              productId: item.productId || (item.product ? item.product.id : 0),
              quantity: item.quantity,
              productName: item.productName || (item.product ? item.product.name : 'Sản phẩm')
            }));
            setGiftComponents(components);
          }
        } else {
          setToast({ show: true, message: 'Không tìm thấy sản phẩm', type: 'error' });
        }
      } catch (error) {
        setToast({ show: true, message: 'Lỗi tải dữ liệu', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Các hàm xử lý giỏ quà (Giữ nguyên logic cũ)
  const handleAddGiftComponent = () => {
    if (!tempComponentId) return;
    const selectedProduct = allProducts.find(p => p.id === Number(tempComponentId));
    if (!selectedProduct) return;

    const existingIndex = giftComponents.findIndex(c => c.productId === selectedProduct.id);
    if (existingIndex >= 0) {
      const newList = [...giftComponents];
      newList[existingIndex].quantity += tempComponentQty;
      setGiftComponents(newList);
    } else {
      setGiftComponents(prev => [...prev, { productId: selectedProduct.id, quantity: tempComponentQty, productName: selectedProduct.name }]);
    }
    setTempComponentId(''); setTempComponentQty(1);
  };

  const handleRemoveGiftComponent = (productIdToRemove: number) => {
    setGiftComponents(prev => prev.filter(c => c.productId !== productIdToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productPayload = {
        name: formData.name, sku: formData.sku, basePrice: Number(formData.basePrice),
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        description: formData.description, isGift: formData.isGift, isActive: formData.isActive,
        giftComponents: formData.isGift ? giftComponents.map(c => ({ productId: c.productId, quantity: c.quantity })) : []
      };

      const submitData = new FormData();
      submitData.append('product', JSON.stringify(productPayload));
      if (imageFile) submitData.append('image', imageFile);

      const res = await ProductService.updateProduct(Number(id), submitData);
      if (res.success) {
        setToast({ show: true, message: 'Cập nhật thành công!', type: 'success' });
      } else {
        setToast({ show: true, message: res.message || 'Có lỗi xảy ra', type: 'error' });
      }
    } catch (error: any) {
      setToast({ show: true, message: 'Lỗi hệ thống', type: 'error' });
    }
  };

  const handleToggleActive = async () => {
    if (!window.confirm('Bạn có chắc muốn thay đổi trạng thái sản phẩm này?')) return;
    try {
      const res = await ProductService.toggleActiveStatus(id!);
      if (res.success) {
        setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
        setToast({ show: true, message: 'Đã cập nhật trạng thái!', type: 'success' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Không thể thay đổi trạng thái', type: 'error' });
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/products')} className="text-gray-500 hover:text-[#b30000] transition">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm #{id}</h1>
        </div>
        <button 
          onClick={handleToggleActive}
          className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition ${formData.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
        >
          {formData.isActive ? <><Trash2 size={18} /> Ẩn sản phẩm</> : <><CheckCircle size={18} /> Hiện sản phẩm</>}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <select className="w-full border px-3 py-2 rounded focus:outline-none focus:border-[#b30000] bg-white" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                <option value="" disabled>-- Chọn danh mục --</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
            <textarea rows={4} className="w-full border px-3 py-2 rounded focus:outline-none focus:border-[#b30000]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div className="flex items-start gap-6">
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="preview" className="w-24 h-24 object-cover rounded border border-gray-200" />
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cập nhật hình ảnh đại diện</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="w-full border px-3 py-2 rounded text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-[#b30000] hover:file:bg-red-100" />
            </div>
          </div>

          <div className="flex gap-6 mt-2 pb-4 border-b border-gray-100">
            <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
              <input type="checkbox" checked={formData.isGift} onChange={e => setFormData({...formData, isGift: e.target.checked})} className="w-4 h-4 text-[#b30000] rounded focus:ring-[#b30000]" />
              Sản phẩm này là Giỏ Quà (Set)
            </label>
          </div>

          {/* KHU VỰC THÀNH PHẦN GIỎ QUÀ */}
          {formData.isGift && (
            <div className="border border-red-200 rounded-lg p-4 bg-red-50/50 space-y-4">
              <h4 className="font-bold text-sm text-[#b30000] border-b border-red-200 pb-2">Thành phần giỏ quà</h4>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Chọn sản phẩm lẻ</label>
                  <select className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-[#b30000] bg-white text-sm" value={tempComponentId} onChange={(e) => setTempComponentId(e.target.value)}>
                    <option value="" disabled>-- Chọn món để thêm --</option>
                    {allProducts.filter(p => !p.isGift && p.id !== Number(id)).map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {new Intl.NumberFormat('vi-VN').format(p.basePrice)}đ</option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng</label>
                  <input type="number" min="1" className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-[#b30000] text-sm text-center" value={tempComponentQty} onChange={(e) => setTempComponentQty(Number(e.target.value))} />
                </div>
                <button type="button" onClick={handleAddGiftComponent} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition text-sm font-bold h-[38px]">Thêm</button>
              </div>

              {giftComponents.length > 0 && (
                <ul className="space-y-2 mt-2">
                  {giftComponents.map((comp) => (
                    <li key={comp.productId} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-gray-100 text-sm">
                      <div><span className="font-bold text-[#b30000] mr-2">{comp.quantity}x</span><span className="font-medium text-gray-700">{comp.productName}</span></div>
                      <button type="button" onClick={() => handleRemoveGiftComponent(comp.productId)} className="text-gray-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-[#b30000] text-white rounded hover:bg-red-800 transition font-bold shadow-md">
              <Save size={20} /> Lưu thông tin
            </button>
          </div>
        </form>
      </div>

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}