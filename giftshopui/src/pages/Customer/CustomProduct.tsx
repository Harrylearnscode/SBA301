import React, { useState, useEffect } from "react";
import { Plus, Check, X, Gift, Truck, Minus, Loader2, Package, ArrowRight, ArrowLeft, Trash2 } from "lucide-react";import ProductService from "../../api/service/product.service";
import CartService from "../../api/service/cart.service";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/ui/Toast";

interface Product {
    id: number;
    name: string;
    basePrice: number;
    imageUrl?: string;
    isGift?: boolean;
    category?: { id: number, name: string };
}

interface SelectedItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

export default function CustomProductPage() {
    const navigate = useNavigate();
    
    // State phân loại dữ liệu
    const [boxes, setBoxes] = useState<Product[]>([]);
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // State quản lý quy trình
    const [step, setStep] = useState<1 | 2>(1); // 1: Chọn hộp, 2: Chọn đồ
    const [selectedBox, setSelectedBox] = useState<Product | null>(null);
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

    // Fetch dữ liệu
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await ProductService.getAllProducts(true);
                const productsData = Array.isArray(response) ? response : response?.data || [];
                
                // Lọc bỏ các giỏ quà set sẵn (isGift = true)
                const baseProducts = productsData.filter((p: Product) => p.isGift === false);

                // TÁCH VỎ HỘP VÀ MÓN LẺ DỰA VÀO TÊN CATEGORY
                // (Bạn có thể đổi 'hộp' thành tên danh mục hoặc ID thực tế của bạn)
                const boxList = baseProducts.filter((p: Product) => 
                    p.category && p.category.name.toLowerCase().includes('box')
                );
                const itemList = baseProducts.filter((p: Product) => 
                    !p.category || !p.category.name.toLowerCase().includes('box')
                );

                setBoxes(boxList);
                setItems(itemList);
            } catch (err) {
                setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Thêm / bỏ món lẻ
    const toggleItem = (product: Product) => {
        const exists = selectedItems.find((item) => item.productId === product.id);
        if (exists) {
            setSelectedItems(selectedItems.filter((item) => item.productId !== product.id));
        } else {
            setSelectedItems([...selectedItems, { productId: product.id, name: product.name, price: Number(product.basePrice || 0), quantity: 1 }]);
        }
    };

    // Cập nhật số lượng món
    const updateQuantity = (productId: number, delta: number) => {
        setSelectedItems((prev) =>
            prev.map((item) =>
                item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
            )
        );
    };

    // Xóa món
    const removeItem = (productId: number) => {
        setSelectedItems((prev) => prev.filter((item) => item.productId !== productId));
    };

    // TÍNH TỔNG TIỀN = Tiền Hộp + Tiền Các Món
    const boxPrice = selectedBox ? Number(selectedBox.basePrice) : 0;
    const itemsPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPrice = boxPrice + itemsPrice;

    // GỌI API TẠO HỘP QUÀ VÀ THÊM VÀO GIỎ
    const handleAddToCart = async () => {
        if (!selectedBox) {
            setToast({ show: true, message: "Bạn chưa chọn Vỏ hộp!", type: "error" }); return;
        }
        if (selectedItems.length === 0) {
            setToast({ show: true, message: "Vui lòng chọn ít nhất một món quà!", type: "error" }); return;
        }

        const componentsPayload = [
            { productId: selectedBox.id, quantity: 1 },
            ...selectedItems.map(item => ({ productId: item.productId, quantity: item.quantity }))
        ];

        const productPayload = {
            name: "Hộp quà tự thiết kế",
            isGift: true,
            isActive: false, 
            giftComponents: componentsPayload
        };

        try {
            const submitData = new FormData();
            submitData.append('product', JSON.stringify(productPayload));
            
            const productRes = await ProductService.createProduct(submitData);
            const newProduct = productRes?.data || productRes;

            await CartService.addToCart(newProduct.id, 1);
            
            // 1. HIỆN THÔNG BÁO THÀNH CÔNG ĐẸP MẮT
            setToast({ show: true, message: "Đã thêm hộp quà vào giỏ hàng thành công!", type: "success" });
            
            // 2. CHỜ 1.5 GIÂY RỒI MỚI CHUYỂN TRANG ĐỂ USER KỊP NHÌN THẤY
            setTimeout(() => {
                setSelectedBox(null);
                setSelectedItems([]);
                setStep(1);
                navigate('/cart');
            }, 1500);

        } catch (error) {
            console.error(error);
            setToast({ show: true, message: "Không thể tạo hộp quà, vui lòng thử lại!", type: "error" });
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-20 font-sans text-gray-800">
            {/* Hero Section */}
            <section className="relative bg-[#4a0404] py-16 overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-serif text-[#facc15] mb-4 uppercase tracking-[0.1em]">
                        Tự Thiết Kế Hộp Quà
                    </h1>
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <div className={`px-4 py-2 rounded-full text-sm font-bold ${step === 1 ? 'bg-[#facc15] text-[#4a0404]' : 'bg-red-900 text-red-300 border border-red-800'}`}>
                            1. Chọn Vỏ Hộp
                        </div>
                        <div className="h-[2px] w-12 bg-red-800"></div>
                        <div className={`px-4 py-2 rounded-full text-sm font-bold ${step === 2 ? 'bg-[#facc15] text-[#4a0404]' : 'bg-red-900 text-red-300 border border-red-800'}`}>
                            2. Chọn Món Quà
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 mt-8">
                {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded mb-8">{error}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* BÊN TRÁI: KHU VỰC CHỌN SẢN PHẨM */}
                    <div className="lg:col-span-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 opacity-50">
                                <Loader2 className="animate-spin mb-4 text-[#b30000]" size={40} />
                                <p>Đang tải dữ liệu...</p>
                            </div>
                        ) : (
                            <>
                                {/* --- BƯỚC 1: CHỌN VỎ HỘP --- */}
                                {step === 1 && (
                                    <div className="animate-in fade-in slide-in-from-left-8 duration-500">
                                        <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Mời bạn chọn mẫu Vỏ hộp</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                            {boxes.map((box) => (
                                                <div 
                                                    key={box.id} 
                                                    onClick={() => setSelectedBox(box)}
                                                    className={`cursor-pointer group bg-white rounded-xl overflow-hidden border-2 transition-all ${selectedBox?.id === box.id ? 'border-[#b30000] shadow-xl scale-105 ring-4 ring-red-50' : 'border-gray-100 hover:border-red-300'}`}
                                                >
                                                    <img src={box.imageUrl || "https://placehold.co/400"} alt={box.name} className="w-full h-48 object-cover" />
                                                    <div className="p-4 text-center">
                                                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{box.name}</h3>
                                                        <p className="text-[#b30000] font-bold">{Number(box.basePrice).toLocaleString()}đ</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* --- BƯỚC 2: CHỌN MÓN LẺ --- */}
                                {step === 2 && (
                                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold font-serif text-gray-900">Mời bạn chọn Món quà</h2>
                                            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#b30000]">
                                                <ArrowLeft size={16} /> Đổi vỏ hộp khác
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                            {items.map((product) => {
                                                const isSelected = selectedItems.some((i) => i.productId === product.id);
                                                return (
                                                    <div key={product.id} className={`group bg-white rounded-xl overflow-hidden border transition-all ${isSelected ? "border-[#b30000] shadow-md" : "border-gray-100 hover:shadow-lg"}`}>
                                                        <img src={product.imageUrl || "https://placehold.co/400"} alt={product.name} className="w-full h-40 object-cover" />
                                                        <div className="p-4">
                                                            <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
                                                            <p className="text-[#b30000] font-bold text-sm mb-4">{Number(product.basePrice).toLocaleString()}đ</p>
                                                            <button 
                                                                onClick={() => toggleItem(product)}
                                                                className={`w-full py-2 rounded text-xs font-bold uppercase transition ${isSelected ? "bg-[#b30000] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                                            >
                                                                {isSelected ? "Đã thêm" : "Thêm vào hộp"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* BÊN PHẢI: TỔNG KẾT HỘP QUÀ */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-[#4a0404] p-5 flex justify-between items-center text-[#facc15]">
                                <h3 className="font-bold uppercase tracking-wider text-sm">Hộp Quà Của Bạn</h3>
                                <Gift size={20} />
                            </div>

                            <div className="p-5">
                                {/* Hiển thị Vỏ Hộp */}
                                <div className="mb-4 pb-4 border-b border-gray-100">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-2">Vỏ hộp đã chọn:</p>
                                    {selectedBox ? (
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-sm text-gray-800">{selectedBox.name}</span>
                                            <span className="font-semibold text-[#b30000] text-sm">{Number(selectedBox.basePrice).toLocaleString()}đ</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-red-500 italic">Chưa chọn vỏ hộp</p>
                                    )}
                                </div>

                                {/* Hiển thị Các Món Lẻ */}
                                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Sản phẩm bên trong:</p>
                                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                                    {selectedItems.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">Chưa có món nào...</p>
                                    ) : (
                                        selectedItems.map((item) => (
                                            <div key={item.productId} className="flex justify-between items-start gap-2">
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-800 text-sm leading-tight mb-1">{item.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center bg-gray-50 rounded border border-gray-200">
                                                            <button onClick={() => updateQuantity(item.productId, -1)} className="px-2 py-1 text-gray-500 hover:text-red-500"><Minus size={10} /></button>
                                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.productId, 1)} className="px-2 py-1 text-gray-500 hover:text-red-500"><Plus size={10} /></button>
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-500">{item.price.toLocaleString()}đ</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeItem(item.productId)} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Tổng Tiền */}
                                <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-600 uppercase">Tổng cộng:</span>
                                    <span className="text-xl font-bold text-[#b30000]">{totalPrice.toLocaleString()}đ</span>
                                </div>

                                {/* Nút điều hướng */}
                                {step === 1 ? (
                                    <button 
                                        onClick={() => setStep(2)}
                                        disabled={!selectedBox}
                                        className={`w-full py-3 rounded uppercase font-bold text-sm flex justify-center items-center gap-2 transition ${selectedBox ? 'bg-gray-800 text-white hover:bg-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        Tiếp tục chọn quà <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleAddToCart}
                                        disabled={selectedItems.length === 0}
                                        className={`w-full py-3 rounded uppercase font-bold text-sm transition shadow-lg ${selectedItems.length > 0 ? 'bg-[#b30000] text-white hover:bg-red-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
            `}</style>
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    );
}