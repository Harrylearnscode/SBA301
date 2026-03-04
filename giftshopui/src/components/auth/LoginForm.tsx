import React, { useState } from 'react';
import AuthService from '../../api/service/AuthService';

interface LoginFormProps {
  onSwitch: () => void;
  onSuccess: (token: string) => void;
}

export default function LoginForm({ onSwitch, onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await AuthService.login({ username, password });
      console.log("Login response:", data); // Debug log để xem cấu trúc trả về
      // Lúc này data chính là ResponseObject từ Spring Boot
      if (data.success) {
        onSuccess(data.data.accessToken); 
        console.log("Login successful, token:", data.data.accessToken); // Debug log token
      } else {
        setError(data.message || 'Tài khoản hoặc mật khẩu không đúng');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối đến máy chủ');
    }
};

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      
      <div>
        <label className="text-xs font-bold text-gray-700 uppercase">Tên đăng nhập</label>
        <input 
          type="text" required value={username} onChange={e => setUsername(e.target.value)}
          placeholder="Nhập tên đăng nhập..." 
          className="w-full mt-1 border border-gray-300 px-4 py-2 focus:outline-none focus:border-[#b30000]"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-gray-700 uppercase">Mật khẩu</label>
        <input 
          type="password" required value={password} onChange={e => setPassword(e.target.value)}
          placeholder="••••••••" 
          className="w-full mt-1 border border-gray-300 px-4 py-2 focus:outline-none focus:border-[#b30000]"
        />
      </div>

      <button type="submit" className="bg-[#b30000] text-white font-bold uppercase py-3 mt-4 hover:bg-red-800 transition">
        Đăng Nhập Ngay
      </button>

      <div className="flex justify-between text-sm mt-4">
        <button type="button" className="text-gray-500 hover:text-[#b30000]">Quên mật khẩu?</button>
        <button type="button" onClick={onSwitch} className="text-[#b30000] font-bold">Đăng ký tài khoản</button>
      </div>
    </form>
  );
}