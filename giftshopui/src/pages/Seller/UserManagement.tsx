import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, Eye, X, User, 
  Mail, Phone, Calendar, Shield, Building2, Briefcase, 
  DollarSign, CheckCircle, AlertCircle, Lock, Landmark 
} from 'lucide-react';
import UserService from '../../api/service/user.service';

export default function UserManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [userDetail, setUserDetail] = useState<any | null>(null);

  // Form State
  const initialForm = {
    username: '', 
    password: '', 
    email: '', 
    fullName: '', 
    phone: '',
    dateOfBirth: '', 
    role: 'CUSTOMER', 
    isActive: true,
    corporateProfile: null 
  };
  const [formData, setFormData] = useState<any>(initialForm);

  const fetchUsers = async () => {
    try {
      const res = await UserService.getAllUsers();
      if (res.success) setUsers(res.data);
    } catch (error) { console.error("Lỗi tải người dùng:", error); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleViewDetail = async (id: number) => {
    if (expandedUserId === id) {
      setExpandedUserId(null);
      return;
    }
    try {
      const res = await UserService.getUserById(id);
      if (res.success) {
        setUserDetail(res.data);
        setExpandedUserId(id);
      }
    } catch (error) { alert("Không thể lấy thông tin chi tiết"); }
  };

  const openModal = async (user = null) => {
  if (user) {
    const res = await UserService.getUserById(user.id);
    if (res.success) {
      setEditingUser(res.data);
      // Mapping sạch: Loại bỏ id, createdAt, updatedAt...
      setFormData({
        username: res.data.username || '',
        email: res.data.email || '',
        fullName: res.data.fullName || '',
        phone: res.data.phone || '',
        role: res.data.role || 'CUSTOMER',
        isActive: res.data.isActive ?? true,
        password: '', // Luôn để trống khi sửa
        dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.split('T')[0] : '',
        corporateProfile: res.data.corporateProfile ? {
          companyName: res.data.corporateProfile.companyName || '',
          taxId: res.data.corporateProfile.taxId || '',
          addressReg: res.data.corporateProfile.addressReg || '',
          creditLimit: res.data.corporateProfile.creditLimit || 0,
          currentDebt: res.data.corporateProfile.currentDebt || 0
        } : null
      });
    }
  } else {
    setEditingUser(null);
    setFormData(initialForm);
  }
  setIsModalOpen(true);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      // Chuẩn bị payload: Nếu password trống thì không gửi password (để tránh ghi đè password cũ bằng rỗng)
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      if (editingUser) {
        res = await UserService.updateUser(editingUser.id, payload);
      } else {
        res = await UserService.createUser(payload);
      }
      
      if (res.success) {
        setIsModalOpen(false);
        fetchUsers();
      } else { alert(res.message); }
    } catch (error) { alert("Thao tác thất bại"); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        const res = await UserService.deleteUser(id);
        if (res.success) fetchUsers();
      } catch (error) { alert("Lỗi khi xóa"); }
    }
  };

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Quản lý Người dùng</h2>
          <p className="text-sm text-gray-500">Xem, tạo mới và cập nhật thông tin tài khoản.</p>
        </div>
        <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md transition-all">
          <Plus size={20} /> Tạo người dùng mới
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" placeholder="Tìm theo username hoặc tên..." 
          className="flex-1 outline-none text-sm"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold tracking-wider">
              <th className="p-4 border-b">Username</th>
              <th className="p-4 border-b text-center">Trạng thái</th>
              <th className="p-4 border-b">Vai trò (Role)</th>
              <th className="p-4 border-b text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <React.Fragment key={user.id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    {user.username}
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge active={user.isActive} />
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold text-gray-600 border px-2 py-0.5 rounded bg-gray-50">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleViewDetail(user.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Xem chi tiết"><Eye size={18} /></button>
                      <button onClick={() => openModal(user)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Sửa"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Xóa"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>

                {/* DETAIL EXPAND */}
                {expandedUserId === user.id && userDetail && (
                  <tr className="bg-gray-50/50">
                    <td colSpan={4} className="p-6">
                      <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="font-bold text-blue-800 text-xs uppercase flex items-center gap-2 border-b pb-2"><User size={14}/> Thông tin cá nhân</h4>
                          <div className="grid grid-cols-2 gap-y-3 text-sm">
                            <div><p className="text-gray-400 text-[10px] uppercase font-bold">Họ tên</p><p className="font-medium">{userDetail.fullName || '—'}</p></div>
                            <div><p className="text-gray-400 text-[10px] uppercase font-bold">Email</p><p className="font-medium">{userDetail.email || '—'}</p></div>
                            <div><p className="text-gray-400 text-[10px] uppercase font-bold">SĐT</p><p className="font-medium">{userDetail.phone || '—'}</p></div>
                            <div><p className="text-gray-400 text-[10px] uppercase font-bold">Ngày sinh</p><p className="font-medium">{userDetail.dateOfBirth ? new Date(userDetail.dateOfBirth).toLocaleDateString('vi-VN') : '—'}</p></div>
                          </div>
                        </div>

                        <div className="space-y-4 border-l pl-8">
                          <h4 className="font-bold text-blue-800 text-xs uppercase flex items-center gap-2 border-b pb-2"><Building2 size={14}/> Hồ sơ doanh nghiệp</h4>
                          {userDetail.corporateProfile ? (
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                              <div className="col-span-2"><p className="text-gray-400 text-[10px] uppercase font-bold">Tên công ty</p><p className="font-bold text-gray-800">{userDetail.corporateProfile.companyName}</p></div>
                              <div><p className="text-gray-400 text-[10px] uppercase font-bold">Mã số thuế</p><p className="font-medium">{userDetail.corporateProfile.taxId}</p></div>
                              <div><p className="text-gray-400 text-[10px] uppercase font-bold">Hạn mức tín dụng</p><p className="font-bold text-green-600">{userDetail.corporateProfile.creditLimit?.toLocaleString()}đ</p></div>
                              <div><p className="text-gray-400 text-[10px] uppercase font-bold">Nợ hiện tại</p><p className="font-bold text-red-600">{userDetail.corporateProfile.currentDebt?.toLocaleString()}đ</p></div>
                              <div className="col-span-2"><p className="text-gray-400 text-[10px] uppercase font-bold">Địa chỉ đăng ký</p><p className="font-medium">{userDetail.corporateProfile.addressReg}</p></div>
                            </div>
                          ) : (
                            <p className="text-gray-400 italic text-sm py-4">Không có dữ liệu doanh nghiệp.</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 p-6 border-b flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
                {editingUser ? 'Cập nhật tài khoản' : 'Tạo tài khoản mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400 hover:text-red-500" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* THÔNG TIN CÁ NHÂN */}
              <div className="space-y-4">
                <h5 className="font-bold text-blue-600 text-sm border-b pb-2 flex items-center gap-2"><User size={18}/> THÔNG TIN CÁ NHÂN</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Username *</label>
                    <input type="text" required disabled={!!editingUser} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" 
                           value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                      <Lock size={10}/> Mật khẩu {editingUser && '(Để trống nếu không đổi)'}
                    </label>
                    <input type="password" required={!editingUser} className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                           value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email *</label>
                    <input type="email" required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                           value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Họ và tên</label>
                    <input type="text" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                           value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Số điện thoại</label>
                    <input type="text" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                           value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ngày sinh</label>
                    <input type="date" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                           value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Vai trò (Role)</label>
                    <select className="w-full border rounded-lg p-2.5 bg-white font-bold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="SALES">SALES</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" id="isActive" className="w-4 h-4" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                    <label htmlFor="isActive" className="text-xs font-bold text-gray-600 cursor-pointer uppercase">Hoạt động</label>
                  </div>
                </div>
              </div>

              {/* HỒ SƠ DOANH NGHIỆP */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h5 className="font-bold text-blue-600 text-sm flex items-center gap-2"><Building2 size={18}/> HỒ SƠ DOANH NGHIỆP</h5>
                    <button type="button" onClick={() => setFormData({...formData, corporateProfile: formData.corporateProfile ? null : { companyName: '', taxId: '', addressReg: '', creditLimit: 0, currentDebt: 0, logoUrl: '' }})} 
                            className={`text-[9px] font-black px-2 py-1 rounded-full uppercase transition-colors ${formData.corporateProfile ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {formData.corporateProfile ? 'Gỡ hồ sơ' : 'Thêm hồ sơ'}
                    </button>
                </div>
                
                {formData.corporateProfile ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tên công ty *</label>
                      <input type="text" required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                             value={formData.corporateProfile.companyName} onChange={e => setFormData({...formData, corporateProfile: {...formData.corporateProfile, companyName: e.target.value}})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mã số thuế</label>
                      <input type="text" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                             value={formData.corporateProfile.taxId} onChange={e => setFormData({...formData, corporateProfile: {...formData.corporateProfile, taxId: e.target.value}})} />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><Landmark size={10}/> Nợ hiện tại (VNĐ)</label>
                      <input type="number" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" 
                             value={formData.corporateProfile.currentDebt} onChange={e => setFormData({...formData, corporateProfile: {...formData.corporateProfile, currentDebt: Number(e.target.value)}})} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><DollarSign size={10}/> Hạn mức tín dụng (VNĐ)</label>
                      <input type="number" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-green-700" 
                             value={formData.corporateProfile.creditLimit} onChange={e => setFormData({...formData, corporateProfile: {...formData.corporateProfile, creditLimit: Number(e.target.value)}})} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Địa chỉ đăng ký</label>
                      <textarea className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" rows={2}
                                value={formData.corporateProfile.addressReg} onChange={e => setFormData({...formData, corporateProfile: {...formData.corporateProfile, addressReg: e.target.value}})} />
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[250px] border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-300 gap-2">
                    <Building2 size={40} className="opacity-20" />
                    <span className="text-xs italic">Người dùng cá nhân</span>
                  </div>
                )}
              </div>

              <div className="col-span-2 flex justify-end gap-3 pt-6 border-t mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-colors">Hủy bỏ</button>
                <button type="submit" className="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95 uppercase tracking-wide">
                  {editingUser ? 'Lưu cập nhật' : 'Xác nhận tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[9px] font-black uppercase border border-green-200 shadow-sm">
      <CheckCircle size={10}/> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-[9px] font-black uppercase border border-red-100 shadow-sm">
      <AlertCircle size={10}/> Inactive
    </span>
  );
}