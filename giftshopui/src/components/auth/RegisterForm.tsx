import React, { useState } from 'react';
import AuthService from '../../api/service/AuthService'; // Import AuthService

interface RegisterFormProps {
  onSwitch: () => void;
}

export default function RegisterForm({ onSwitch }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    username: '', email: '', fullName: '', phone: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp');
    }

    try {
      // GỌI API ĐĂNG KÝ TỪ AUTOSERVICE
      const data = await AuthService.register({
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        password: formData.password
      });
      
      if (data.success) {
        setSuccess(true);
        setTimeout(onSwitch, 2000);
      } else {
        setError(data.message || 'Đăng ký thất bại');
      }
    } catch (err: any) {
      // Bắt lỗi từ api.helper trả về
      setError(err.message || 'Lỗi kết nối đến máy chủ');
    }
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="text-green-600 font-bold text-lg mb-2">Đăng ký thành công!</div>
        <div className="text-sm text-gray-500">Đang chuyển hướng sang trang đăng nhập...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <div className="text-red-600 text-sm text-center bg-red-50 py-2 rounded border border-red-200">{error}</div>}
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase">Tên đăng nhập</label>
          <input type="text" required onChange={e => setFormData({...formData, username: e.target.value})} className="w-full mt-1 border px-3 py-2 text-sm focus:border-[#b30000] focus:outline-none"/>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase">Họ và Tên</label>
          <input type="text" required onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full mt-1 border px-3 py-2 text-sm focus:border-[#b30000] focus:outline-none"/>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase">Email</label>
          <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} className="w-full mt-1 border px-3 py-2 text-sm focus:border-[#b30000] focus:outline-none"/>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase">Số điện thoại</label>
          <input type="text" required onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full mt-1 border px-3 py-2 text-sm focus:border-[#b30000] focus:outline-none"/>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-700 uppercase">Mật khẩu</label>
        <input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} className="w-full mt-1 border px-3 py-2 text-sm focus:border-[#b30000] focus:outline-none"/>
      </div>
      <div>
        <label className="text-xs font-bold text-gray-700 uppercase">Xác nhận mật khẩu</label>
        <input type="password" required onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full mt-1 border px-3 py-2 text-sm focus:border-[#b30000] focus:outline-none"/>
      </div>

      <button type="submit" className="bg-[#b30000] text-white font-bold uppercase py-3 mt-2 hover:bg-red-800 transition">
        Đăng Ký Ngay
      </button>

      <div className="text-center text-sm mt-3">
        <span className="text-gray-500">Đã có tài khoản? </span>
        <button type="button" onClick={onSwitch} className="text-[#b30000] font-bold hover:underline">Đăng nhập tại đây</button>
      </div>
    </form>
  );
}