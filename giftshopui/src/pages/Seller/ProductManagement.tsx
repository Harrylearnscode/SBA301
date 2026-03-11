import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Image as ImageIcon, 
  Filter, Gift, ChevronDown, ChevronUp, User, RefreshCw 
} from 'lucide-react';
import ProductService from '../../api/service/product.service';
import CategoryService from '../../api/service/category.service';

export default function ProductManager() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Quản lý đóng mở các hàng chi tiết
  const [expandedGift, setExpandedGift] = useState<number | null>(null);
  const [expandedCreator, setExpandedCreator] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await ProductService.getAllProducts(false);
      if (res.success) setProducts(res.data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getAllCategories();
      if (res.success) setCategories(res.data);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Xử lý bật/tắt trạng thái hoạt động
  const handleToggleActive = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái sản phẩm này?")) return;
    
    try {
      // Gọi API: /products/${id}/toggle-active
      const res = await ProductService.toggleActiveStatus(id);
      if (res.success) {
        setProducts(prev => 
          prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p)
        );
      }
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái!");
      console.error(error);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCreator = (id: number) => {
    setExpandedCreator(expandedCreator === id ? null : id);
    setExpandedGift(null);
  };

  const toggleGift = (id: number) => {
    setExpandedGift(expandedGift === id ? null : id);
    setExpandedCreator(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h2>
          <p className="text-sm text-gray-500">Quản lý thông tin, danh mục và trạng thái sản phẩm.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#b30000] hover:bg-[#8e0000] text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md font-bold text-sm"
        >
          <Plus size={18} /> Thêm sản phẩm mới
        </button>
      </div>

      {/* Bảng sản phẩm chính */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-[11px] font-bold tracking-wider">
                <th className="p-4 border-b w-16">Ảnh</th>
                <th className="p-4 border-b">Thông tin sản phẩm</th>
                <th className="p-4 border-b">Danh mục</th>
                <th className="p-4 border-b text-center">Gift</th>
                <th className="p-4 border-b">Người tạo</th>
                <th className="p-4 border-b">Trạng thái</th>
                <th className="p-4 border-b text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <React.Fragment key={product.id}>
                  {/* HÀNG CHÍNH */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-300" />}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{product.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">SKU: {product.sku || '—'}</div>
                    </td>
                    <td className="p-4 text-gray-600">{product.category?.name || '—'}</td>
                    <td className="p-4 text-center">
                      {product.isGift ? (
                        <button onClick={() => toggleGift(product.id)} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase hover:bg-amber-200 transition">
                          <Gift size={12} /> {expandedGift === product.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleCreator(product.id)} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase hover:bg-blue-200 transition">
                        <User size={12} /> {product.createdBy?.username || 'Admin'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge active={product.isActive} />
                        <button 
                          onClick={() => handleToggleActive(product.id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all active:scale-90"
                          title="Thay đổi trạng thái"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Sửa thông tin">
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>

                  {/* CHI TIẾT NGƯỜI TẠO (EXPAND) */}
                  {expandedCreator === product.id && product.createdBy && (
                    <tr className="bg-blue-50/30">
                      <td colSpan={7} className="p-0 border-b border-blue-100">
                        <div className="mx-4 my-3 p-4 bg-white border border-blue-200 rounded-xl shadow-sm flex items-start gap-5">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><User size={24} /></div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 flex-1">
                            <div><p className="text-[10px] text-blue-500 font-bold">HỌ TÊN</p><p className="font-bold text-gray-800">{product.createdBy.fullName}</p></div>
                            <div><p className="text-[10px] text-blue-500 font-bold">EMAIL</p><p className="">{product.createdBy.email}</p></div>
                            <div><p className="text-[10px] text-blue-500 font-bold">SĐT</p><p className="">{product.createdBy.phone}</p></div>
                            <div><p className="text-[10px] text-blue-500 font-bold">NGÀY TẠO</p><p className="">{new Date(product.createdBy.createdAt).toLocaleDateString('vi-VN')}</p></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* THÀNH PHẦN GIFT (EXPAND) */}
                  {product.isGift && expandedGift === product.id && (
                    <tr className="bg-amber-50/30">
                      <td colSpan={7} className="p-0 border-b border-amber-100">
                        <div className="mx-4 my-3 bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm">
                          <table className="w-full">
                            <thead className="bg-amber-50 text-[10px] text-amber-800 font-bold uppercase">
                              <tr>
                                <th className="px-4 py-2 w-16">Ảnh</th>
                                <th className="px-4 py-2">Sản phẩm</th>
                                <th className="px-4 py-2 text-center">Giá gốc</th>
                                <th className="px-4 py-2 text-right">Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {product.giftComponents?.map((comp: any) => (
                                <tr key={comp.id} className="text-xs">
                                  <td className="px-4 py-2">
                                    <div className="w-10 h-10 rounded border border-gray-100 overflow-hidden bg-white">
                                      {comp.product?.imageUrl ? <img src={comp.product.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={14} className="m-auto mt-3 text-gray-200" />}
                                    </div>
                                  </td>
                                  <td className="px-4 py-2">
                                    <p className="font-bold text-gray-800">{comp.product?.name}</p>
                                    <p className="text-[9px] text-gray-400 uppercase">{comp.product?.sku}</p>
                                  </td>
                                  <td className="px-4 py-2 text-center">{comp.product?.basePrice?.toLocaleString()}đ</td>
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
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-100 text-green-700 border border-green-200">Active</span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">Inactive</span>
  );
}