import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string) => {
    login(token);
    navigate('/'); // Chuyển về trang chủ sau khi đăng nhập thành công
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center">
      {/* Red Banner Background */}
      <div className="w-full bg-[#8b0000] py-16 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-serif text-[#facc15] font-bold mb-2 uppercase text-center">
          {isLogin ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Tài Khoản'}
        </h2>
        <p className="text-white/80 italic text-sm">"Gói trọn tinh hoa - Trao gửi tâm tình"</p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-white shadow-2xl rounded-sm p-8 -mt-8 mb-16 relative z-10 border-t-4 border-[#facc15]">
        <h3 className="text-xl font-bold text-[#b30000] text-center mb-6 uppercase">
          {isLogin ? 'Thành Viên' : 'Thành Viên Mới'}
        </h3>
        
        {isLogin ? (
          <LoginForm 
            onSwitch={() => setIsLogin(false)} 
            onSuccess={handleLoginSuccess} 
          />
        ) : (
          <RegisterForm 
            onSwitch={() => setIsLogin(true)} 
          />
        )}
      </div>
    </div>
  );
}