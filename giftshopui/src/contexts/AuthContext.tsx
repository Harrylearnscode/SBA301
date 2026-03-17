import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AuthService from '../api/service/auth.service';

interface DecodedToken {
  sub: string; // Tương ứng với username
  role: { authority: string }[]; // Cấu trúc Spring Security trả về cho mảng Authorities
  exp: number; // Thời gian hết hạn
}

interface AuthContextType {
  token: string | null;
  username: string | null;
  role: string | null;
  login: (token: string) => string | null; // Sửa dòng này
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Hàm xử lý giải mã token
  const processToken = (jwtToken: string): string | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(jwtToken);
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
      setUsername(decoded.sub);
      
      if (decoded.role && decoded.role.length > 0) {
        const userRole = decoded.role[0].authority;
        setRole(userRole);
        return userRole; // Trả về role tại đây
      }
      return null;
    } catch (error) {
      console.error("Invalid token:", error);
      logout(); 
      return null;
    }
  };

  // Chạy 1 lần khi load app để khôi phục state từ localStorage
  useEffect(() => {
    if (token) {
      processToken(token);
    }
  }, []);

  const login = (newToken: string): string | null => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    return processToken(newToken);
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