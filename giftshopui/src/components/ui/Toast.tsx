import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ show, message, type = 'success', onClose }: ToastProps) {
  // Tự động đóng Toast sau 3 giây
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  // Cấu hình Icon và màu sắc viền tương ứng với từng trạng thái
  const icons = {
    success: <CheckCircle className="text-green-500" size={24} />,
    error: <AlertCircle className="text-red-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />
  };

  const borders = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500'
  };

  const titles = {
    success: 'Thành công!',
    error: 'Đã xảy ra lỗi!',
    info: 'Thông báo'
  };

  return (
    <div className={`fixed top-24 right-4 z-[100] bg-white border-l-4 ${borders[type]} p-4 rounded shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-between gap-6 transition-all duration-300 animate-[bounce_0.5s_ease-in-out]`}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <div>
          <p className="font-bold text-gray-800 text-sm">{titles[type]}</p>
          <p className="text-xs text-gray-500">{message}</p>
        </div>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
}