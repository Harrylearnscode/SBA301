import React from 'react';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface ConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'info' | 'success';
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    show,
    title,
    message,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    type = 'warning',
    onConfirm,
    onCancel
}) => {
    if (!show) return null;

    const iconMap = {
        warning: <AlertTriangle className="text-amber-500" size={24} />,
        info: <Info className="text-blue-500" size={24} />,
        success: <CheckCircle className="text-green-500" size={24} />
    };

    const buttonColorMap = {
        warning: 'bg-amber-600 hover:bg-amber-700',
        info: 'bg-blue-600 hover:bg-blue-700',
        success: 'bg-green-600 hover:bg-green-700'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 rounded-xl">
                                {iconMap[type]}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        </div>
                        <button 
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed mb-8">
                        {message}
                    </p>
                    
                    <div className="flex gap-3 justify-end italic">
                         <button 
                            onClick={onCancel}
                            className="px-5 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition"
                        >
                            {cancelText}
                        </button>
                        <button 
                            onClick={onConfirm}
                            className={`px-6 py-2.5 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 ${buttonColorMap[type]}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
