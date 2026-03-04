import React from 'react';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#8A0C0C] text-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 py-16 px-6 md:px-16">
                {/* Brand */}
                <div className="space-y-4">
                    <h2 className="text-xl font-serif font-bold text-yellow-600">QUÀ TẾT VIỆT</h2>
                    <p className="text-xs leading-relaxed opacity-70">
                        Hơn 10 năm gìn giữ hương vị Tết Việt. Chúng tôi tự hào mang đến những món quà ý nghĩa nhất cho năm mới Bính Ngọ 2026.
                    </p>
                    <div className="flex gap-4">
                        <Facebook size={18} className="cursor-pointer hover:text-white" />
                        <Instagram size={18} className="cursor-pointer hover:text-white" />
                        <Youtube size={18} className="cursor-pointer hover:text-white" />
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Hỗ Trợ</h4>
                    <ul className="text-xs space-y-3 opacity-70">
                        <li><a href="#" className="hover:text-white">Chính sách vận chuyển</a></li>
                        <li><a href="#" className="hover:text-white">Đổi trả & Bảo hành</a></li>
                        <li><a href="#" className="hover:text-white">Khách hàng Doanh nghiệp</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Liên Hệ</h4>
                    <div className="text-xs space-y-3 opacity-70">
                        <div className="flex items-start gap-3">
                            <MapPin size={16} /> <span>123 Đồng Khởi, Q.1, TP.HCM</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={16} /> <span>1900 2026</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={16} /> <span>lienhe@quatetviet.com</span>
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Bản Tin</h4>
                    <p className="text-xs mb-4 opacity-70">Đăng ký nhận báo giá doanh nghiệp.</p>
                    <div className="flex">
                        <input type="email" placeholder="Email của bạn" className="bg-transparent border border-gray-700 px-4 py-2 text-xs w-full focus:outline-none focus:border-yellow-600" />
                        <button className="bg-yellow-600 text-black px-4 py-2 text-[10px] font-bold uppercase">Gửi</button>
                    </div>
                </div>
            </div>
            <div className="bg-[#460404] mt-16 border-t border-gray-800 text-[10px] opacity-50 uppercase tracking-[0.2em] flex items-center justify-center h-16">
                © 2026 Quà Tết Việt. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;