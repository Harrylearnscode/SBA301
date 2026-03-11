import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Edit } from 'lucide-react'; // Thêm icon Edit
import CategoryService from '../../api/service/category.service';

export default function CategoryManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    parentId: ''
  });

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getAllCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = () => {
    setEditingId(null);
    setFormData({ name: '', parentId: '' });
    setIsModalOpen(true);
  };

  // --- HÀM XỬ LÝ KHI BẤM NÚT SỬA ---
  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      // Nếu cat có parentId trực tiếp thì dùng, nếu không có thể cần logic tìm từ subCategories
      parentId: cat.parentId ? cat.parentId.toString() : '' 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { 
        name: formData.name, 
        parentId: formData.parentId ? Number(formData.parentId) : null 
      };

      let res;
      if (editingId) {
        res = await CategoryService.updateCategory(editingId, payload);
      } else {
        res = await CategoryService.createCategory(payload);
      }

      if (!res.success) {
        alert(res.message || "Thao tác thất bại!");
        return;
      }
      
      setIsModalOpen(false);
      fetchCategories(); 
    } catch (error: any) {
      console.error("Category submit error:", error);
      alert(error.message || "Thao tác thất bại!");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await CategoryService.deleteCategory(id);
        fetchCategories();
      } catch (error) {
        alert("Không thể xóa danh mục này!");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Danh mục</h2>
        <button 
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 uppercase text-[11px] font-bold tracking-wider">
            <th className="p-4 border-b w-16">STT</th>
            <th className="p-4 border-b">Tên danh mục</th>
            <th className="p-4 border-b">Danh mục con</th>
            <th className="p-4 border-b text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-100">
          {categories.map((cat, index) => (
            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 text-gray-500 font-mono">{index + 1}</td>
              <td className="p-4 font-bold text-gray-800">{cat.name}</td>
              <td className="p-4 text-gray-500 text-xs italic">
                {cat.subCategories && cat.subCategories.length > 0
                  ? cat.subCategories.map((s: any) => s.name).join(', ')
                  : '—'}
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-1">
                  {/* NÚT SỬA MỚI THÊM */}
                  <button 
                    onClick={() => handleEdit(cat)} 
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16}/>
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL FORM (Giữ nguyên cấu trúc, chỉ thay đổi tiêu đề động) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
                {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20}/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tên danh mục *</label>
                <input 
                  type="text" required
                  placeholder="Ví dụ: Đồ gia dụng, Thời trang..."
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none border-gray-200"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Danh mục cha (nếu có)</label>
                <select 
                  className="w-full border rounded-lg p-2.5 outline-none border-gray-200 bg-white"
                  value={formData.parentId}
                  onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                >
                  <option value="">-- Là danh mục cấp cao nhất --</option>
                  {categories
                    .filter(c => c.id !== editingId) // Không cho phép chọn chính mình làm cha
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  }
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >Hủy bỏ</button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg"
                >
                  {editingId ? 'Cập nhật ngay' : 'Tạo danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}