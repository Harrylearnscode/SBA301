import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#5c0000] text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Brand Info */}
                    <div>
                        <h2 className="text-xl font-serif font-bold uppercase tracking-widest text-[#facc15] mb-2">Quà Tết Việt</h2>
                        <p className="text-white/70 text-sm mb-6 leading-relaxed">
                            Hơn 10 năm gìn giữ hương vị Tết Việt. Chúng tôi tự hào mang đến những món quà ý nghĩa nhất cho năm mới Bính Ngọ 2026.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#facc15] hover:text-[#5c0000] transition">
                                <Facebook size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#facc15] hover:text-[#5c0000] transition">
                                <Instagram size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#facc15] hover:text-[#5c0000] transition">
                                <Youtube size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-[#facc15]">Hỗ Trợ</h3>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li><a href="#" className="hover:text-white transition">Chính sách vận chuyển</a></li>
                            <li><a href="#" className="hover:text-white transition">Đổi trả & Bảo hành</a></li>
                            <li><a href="#" className="hover:text-white transition">Khách hàng Doanh nghiệp</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-[#facc15]">Liên Hệ</h3>
                        <ul className="space-y-4 text-sm text-white/70">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#facc15] shrink-0" />
                                <span>123 Đồng Khởi, Q.1, TP.HCM</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-[#facc15] shrink-0" />
                                <span>1900 2026</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-[#facc15] shrink-0" />
                                <span>cskh@quatetviet.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-[#facc15]">Bản Tin</h3>
                        <p className="text-white/70 text-sm mb-4">Đăng ký nhận báo giá doanh nghiệp.</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="bg-white/10 border border-white/20 text-white px-4 py-2 text-sm w-full focus:outline-none focus:border-[#facc15]"
                            />
                            <button
                                type="submit"
                                className="bg-[#facc15] text-[#5c0000] px-4 py-2 font-bold text-sm hover:bg-yellow-500 transition"
                            >
                                Gửi
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 pt-8 text-center text-xs text-white/50">
                    © 2026 Quà Tết Việt. All rights reserved.
                </div>
            </div>
        </footer>
    );
}