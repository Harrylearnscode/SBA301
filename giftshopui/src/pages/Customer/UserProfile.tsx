import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Calendar, Building, MapPin, CreditCard, ShieldCheck, X, Save } from 'lucide-react';
import UserService from '../../api/service/user.service';
import Toast from '../../components/ui/Toast'; // Dùng lại Toast bạn đã tạo ở bước trước

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State quản lý Modal và Dữ liệu Form
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
  });
  
  // State hiển thị thông báo
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await UserService.getMyProfile();
      if (res.success) {
        setProfile(res.data);
      } else {
        setError(res.message || 'Không thể tải thông tin cá nhân');
      }
    } catch (err: any) {
      setError(err || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Khi bấm "Chỉnh sửa", copy dữ liệu hiện tại vào formData để hiện lên Form
  const handleOpenEdit = () => {
    setFormData({
      fullName: profile.fullName || '',
      phone: profile.phone || '',
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '', // Format YYYY-MM-DD cho input date
    });
    setIsEditing(true);
  };

  // Cập nhật giá trị khi gõ vào Input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hàm Submit lưu dữ liệu
  const handleSaveProfile = async () => {
    try {
      // Gọi API cập nhật
      const res = await UserService.updateMyProfile(formData);
      if (res.success) {
        setToast({ show: true, message: "Cập nhật hồ sơ thành công!", type: 'success' });
        setIsEditing(false); // Đóng modal
        setProfile(res.data); // Cập nhật lại UI ngay lập tức với dữ liệu mới
      } else {
        setToast({ show: true, message: res.message || "Không thể cập nhật hồ sơ", type: 'error' });
      }
    } catch (err: any) {
      setToast({ show: true, message: err || "Lỗi hệ thống", type: 'error' });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#b30000]"></div></div>;
  }

  if (error || !profile) {
    return <div className="min-h-screen flex justify-center items-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-3xl font-serif text-[#b30000] font-bold mb-8 text-center">Hồ Sơ Của Tôi</h2>

        <div className="bg-white shadow rounded-lg overflow-hidden border-t-4 border-[#b30000]">
          {/* Header Profile */}
          <div className="bg-red-50/30 px-6 py-8 flex items-center gap-6 border-b border-gray-100">
            <div className="w-24 h-24 bg-[#b30000] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{profile.fullName || profile.username}</h3>
              <p className="text-sm text-gray-500 mt-1">@{profile.username}</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                <ShieldCheck size={14} />
                Tài khoản đang hoạt động
              </div>
            </div>
          </div>

          {/* Body Profile */}
          <div className="p-6 md:p-8">
            <h4 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Thông tin cá nhân</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-full text-gray-500"><UserIcon size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Họ và tên</p>
                  <p className="text-gray-900 font-medium mt-1">{profile.fullName || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-full text-gray-500"><Mail size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                  <p className="text-gray-900 font-medium mt-1">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-full text-gray-500"><Phone size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Số điện thoại</p>
                  <p className="text-gray-900 font-medium mt-1">{profile.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-full text-gray-500"><Calendar size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Ngày sinh</p>
                  <p className="text-gray-900 font-medium mt-1">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>

            {/* Thông tin Doanh Nghiệp (Nếu có) */}
            {profile.corporateProfile && (
              <>
                <h4 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2 pt-4">Thông tin Doanh Nghiệp</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="text-[#b30000] mt-1"><Building size={20} /></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Tên công ty</p>
                      <p className="text-gray-900 font-medium mt-1">{profile.corporateProfile.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-[#b30000] mt-1"><CreditCard size={20} /></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Mã số thuế</p>
                      <p className="text-gray-900 font-medium mt-1">{profile.corporateProfile.taxId}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 md:col-span-2">
                    <div className="text-[#b30000] mt-1"><MapPin size={20} /></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Địa chỉ kinh doanh</p>
                      <p className="text-gray-900 font-medium mt-1">{profile.corporateProfile.addressReg}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-10 flex justify-end">
              <button 
                onClick={handleOpenEdit}
                className="bg-[#b30000] text-white px-8 py-3 rounded uppercase font-bold text-sm tracking-wider hover:bg-red-800 transition shadow-lg"
              >
                Chỉnh sửa hồ sơ
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL CHỈNH SỬA HỒ SƠ */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
              <h3 className="font-bold text-[#b30000] text-lg">Cập nhật hồ sơ</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Form) */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#b30000] focus:border-transparent outline-none"
                  placeholder="Nhập họ và tên..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#b30000] focus:border-transparent outline-none"
                  placeholder="Nhập số điện thoại..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <input 
                  type="date" 
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#b30000] focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSaveProfile} 
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-[#b30000] rounded hover:bg-red-800 transition shadow-lg"
              >
                <Save size={16} />
                Lưu thay đổi
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* TOAST THÔNG BÁO */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}