import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AuthService from '../api/service/AuthService';

interface DecodedToken {
  sub: string; // Tương ứng với username
  role: { authority: string }[]; // Cấu trúc Spring Security trả về cho mảng Authorities
  exp: number; // Thời gian hết hạn
}

interface AuthContextType {
  token: string | null;
  username: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Hàm xử lý giải mã token
  const processToken = (jwtToken: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(jwtToken);
      // Kiểm tra token hết hạn chưa
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
      setUsername(decoded.sub);
      // Trích xuất Role (ví dụ: "ROLE_CUSTOMER" hoặc "ROLE_ADMIN")
      if (decoded.role && decoded.role.length > 0) {
        setRole(decoded.role[0].authority);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      logout(); // Nếu token lỗi hoặc hết hạn thì force logout luôn
    }
  };

  // Chạy 1 lần khi load app để khôi phục state từ localStorage
  useEffect(() => {
    if (token) {
      processToken(token);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    processToken(newToken);
  };

  const logout = async () => {
    try {
      // Chỉ gọi API logout nếu đang có token hợp lệ
      if (token) {
        await AuthService.logout(); 
      }
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
      // Dù API có lỗi mạng, ta vẫn tiến hành xóa dữ liệu ở Client
    } finally {
      // Xóa toàn bộ dữ liệu xác thực ở LocalStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isFirstLogin');
      
      // Xóa state
      setToken(null);
      setUsername(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, username, role, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};