import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Image as ImageIcon, 
  Gift, ChevronDown, ChevronUp, User, RefreshCw, X, Trash2 
} from 'lucide-react';
import ProductService from '../../api/service/product.service';
import CategoryService from '../../api/service/category.service';

interface Category {
  id: number;
  name: string;
  subCategories?: Category[];
}

interface GiftComponentProduct {
  id: number;
  name: string;
  sku?: string;
  imageUrl?: string;
  basePrice?: number;
  category?: Category;
  isActive?: boolean;
}

interface GiftComponent {
  id?: number;
  product?: GiftComponentProduct;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  sku?: string;
  basePrice?: number;
  description?: string;
  imageUrl?: string;
  isGift?: boolean;
  isActive?: boolean;
  category?: Category;
  createdBy?: { username: string };
  giftComponents?: GiftComponent[];
}

interface FormGiftComponent {
  productId: number | string;
  quantity: number;
}

interface ProductForm {
  categoryId: number | string;
  name: string;
  sku: string;
  basePrice: number;
  description: string;
  imageUrl: string;
  isGift: boolean;
  isActive: boolean;
  giftComponents: FormGiftComponent[];
}

export default function ProductManager() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Quản lý đóng mở các hàng chi tiết
  const [expandedGift, setExpandedGift] = useState<number | null>(null);
  const [expandedCreator, setExpandedCreator] = useState<number | null>(null);

  // Form State
  const initialForm: ProductForm = {
    categoryId: '',
    name: '',
    sku: '',
    basePrice: 0,
    description: '',
    imageUrl: '',
    isGift: false,
    isActive: true,
    giftComponents: []
  };
  const [formData, setFormData] = useState<ProductForm>(initialForm);

  const fetchProducts = async () => {
    try {
      const res = await ProductService.getAllProducts(false);
      if (res.success) setProducts(res.data);
    } catch (error) { console.error("Lỗi tải sản phẩm:", error); }
  };

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getAllCategories();
      if (res.success) setCategories(res.data);
    } catch (error) { console.error("Lỗi tải danh mục:", error); }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleToggleActive = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái sản phẩm này?")) return;
    try {
      const res = await ProductService.toggleActiveStatus(id);
      if (res.success) fetchProducts();
    } catch (error) { alert("Lỗi khi cập nhật trạng thái!"); }
  };

  // Mở modal để tạo mới hoặc sửa
  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        categoryId: product.category?.id || '',
        name: product.name || '',
        sku: product.sku || '',
        basePrice: product.basePrice || 0,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        isGift: product.isGift || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
        // Map từ object phức tạp sang cấu trúc ID/Quantity để gửi API
        giftComponents: product.giftComponents?.map((gc: GiftComponent) => ({
          productId: gc.product?.id || 0,
          quantity: gc.quantity || 1
        })) || []
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = editingId 
        ? await ProductService.updateProduct(editingId, formData)
        : await ProductService.createProduct(formData);
      
      if (res.success) {
        setShowModal(false);
        fetchProducts();
      } else {
        alert(res.message || "Thao tác thất bại");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi lưu sản phẩm");
    }
  };

  const addGiftComponent = () => {
    setFormData({
      ...formData,
      giftComponents: [...formData.giftComponents, { productId: '', quantity: 1 }]
    });
  };

  const removeGiftComponent = (index: number) => {
    const updated = formData.giftComponents.filter((_, i) => i !== index);
    setFormData({ ...formData, giftComponents: updated });
  };

  const updateGiftComponent = (index: number, field: keyof FormGiftComponent, value: string) => {
    const updated = [...formData.giftComponents];
    updated[index] = { ...updated[index], [field]: Number(value) };
    setFormData({ ...formData, giftComponents: updated });
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight uppercase">Quản lý Sản phẩm</h2>
          <p className="text-sm text-gray-500 font-medium">Theo dõi thông tin hàng hóa, giá bán và cấu tạo quà tặng.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg font-bold text-sm"
        >
          <Plus size={18} /> Thêm sản phẩm mới
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm theo tên hoặc SKU..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
                <th className="p-4 w-16">Ảnh</th>
                <th className="p-4">Thông tin sản phẩm</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Giá tiền</th>
                <th className="p-4 text-center">Gift</th>
                <th className="p-4">Người tạo</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                        {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-300" />}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{product.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono tracking-tighter">SKU: {product.sku || '—'}</div>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{product.category?.name || '—'}</td>
                    <td className="p-4 font-bold text-gray-900">{product.basePrice?.toLocaleString()}đ</td>
                    <td className="p-4 text-center">
                      {product.isGift ? (
                        <button onClick={() => setExpandedGift(expandedGift === product.id ? null : product.id)} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase hover:bg-amber-200 transition">
                          <Gift size={12} /> {expandedGift === product.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="p-4">
                      <button onClick={() => setExpandedCreator(expandedCreator === product.id ? null : product.id)} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase hover:bg-blue-200 transition">
                        <User size={12} /> {product.createdBy?.username || 'Admin'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge active={product.isActive} />
                        <button onClick={() => handleToggleActive(product.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:rotate-180">
                          <RefreshCw size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModal(product)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>

                  {/* THÀNH PHẦN GIFT (EXPAND) */}
                  {product.isGift && expandedGift === product.id && (
                    <tr className="bg-amber-50/20">
                      <td colSpan={8} className="p-0 border-b border-amber-100">
                        <div className="mx-4 my-3 bg-white border border-amber-200 rounded-2xl overflow-hidden shadow-sm">
                          <table className="w-full">
                            <thead className="bg-amber-50/50 text-[10px] text-amber-800 font-black uppercase tracking-widest border-b border-amber-100">
                              <tr>
                                <th className="px-4 py-3 w-16">Ảnh</th>
                                <th className="px-4 py-3">Sản phẩm</th>
                                <th className="px-4 py-3">Danh mục</th>
                                <th className="px-4 py-3 text-center">Số lượng</th>
                                <th className="px-4 py-3 text-right">Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {product.giftComponents?.map((comp) => (
                                <tr key={comp.id} className="text-xs">
                                  <td className="px-4 py-2">
                                    <div className="w-10 h-10 rounded-lg border border-gray-100 overflow-hidden bg-white">
                                      {comp.product?.imageUrl ? <img src={comp.product.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={14} className="m-auto mt-3 text-gray-200" />}
                                    </div>
                                  </td>
                                  <td className="px-4 py-2 font-bold text-gray-800">{comp.product?.name}</td>
                                  <td className="px-4 py-2 text-gray-500 italic font-medium">{comp.product?.category?.name}</td>
                                  <td className="px-4 py-2 text-center font-black text-amber-600">x{comp.quantity}</td>
                                  <td className="px-4 py-2 text-right"><StatusBadge active={comp.product?.isActive} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: THÊM / SỬA */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin cơ bản */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Tên sản phẩm *</label>
                    <input type="text" required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500 border-gray-200 font-medium" 
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Mã SKU</label>
                      <input type="text" className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500 border-gray-200 font-mono" 
                        value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Danh mục *</label>
                      <select required className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500 border-gray-200 bg-white" 
                        value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: Number(e.target.value)})}>
                        <option value="">Chọn danh mục</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Giá bán (basePrice)</label>
                    <input type="number" className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500 border-gray-200 font-bold" 
                      value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Đường dẫn ảnh (URL)</label>
                    <input type="text" className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500 border-gray-200" 
                      value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                  </div>
                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 accent-red-600" checked={formData.isGift} onChange={e => setFormData({...formData, isGift: e.target.checked})} />
                      <span className="text-sm font-bold text-gray-600 group-hover:text-red-600">Sản phẩm quà tặng</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                      <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">Đang hoạt động</span>
                    </label>
                  </div>
                </div>

                {/* Mô tả & Thành phần */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Mô tả sản phẩm</label>
                    <textarea rows={4} className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-500 border-gray-200" 
                      value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>

                  {formData.isGift && (
                    <div className="border rounded-2xl p-4 bg-amber-50/50 border-amber-100">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-2">
                          <Gift size={14} /> Thành phần quà tặng ({formData.giftComponents.length})
                        </label>
                        <button type="button" onClick={addGiftComponent} className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-amber-700 transition flex items-center gap-1">
                          <Plus size={14} /> Thêm món
                        </button>
                      </div>
                      
                      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {formData.giftComponents.map((comp, index) => (
                          <div key={index} className="flex gap-2 items-end bg-white p-3 rounded-xl border border-amber-100 shadow-sm">
                            <div className="flex-1">
                              <label className="text-[9px] font-bold text-gray-400 block mb-1">Sản phẩm</label>
                              <select className="w-full border rounded-lg p-2 text-xs outline-none bg-gray-50" 
                                value={comp.productId} onChange={e => updateGiftComponent(index, 'productId', e.target.value)}>
                                <option value="">Chọn món</option>
                                {products.filter(p => p.id !== editingId).map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="w-20">
                              <label className="text-[9px] font-bold text-gray-400 block mb-1">Số lượng</label>
                              <input type="number" className="w-full border rounded-lg p-2 text-xs text-center outline-none bg-gray-50 font-bold" 
                                value={comp.quantity} onChange={e => updateGiftComponent(index, 'quantity', e.target.value)} />
                            </div>
                            <button type="button" onClick={() => removeGiftComponent(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-10 border-t mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors uppercase tracking-widest text-xs">Hủy bỏ</button>
                <button type="submit" className="px-10 py-3 rounded-xl bg-red-700 text-white font-bold hover:bg-red-800 transition-all shadow-xl shadow-red-100 uppercase tracking-widest text-xs">
                  {editingId ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ active }: { active?: boolean }) {
  return active ? (
    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-100 text-green-700 border border-green-200">Active</span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">Inactive</span>
  );
}