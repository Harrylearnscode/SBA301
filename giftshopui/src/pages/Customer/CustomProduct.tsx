import React, { useState, useEffect } from "react";
import { Plus, Check, X, Gift, Truck, Minus, Loader2, Package } from "lucide-react";
import ProductService from "../../api/service/product.service";
import CartService from "../../api/service/cart.service";
import axiosInstance from "../../api/axios.config";
import API_ENDPOINTS from "../../api/endpoints";

interface Product {
    id: number;
    name: string;
    basePrice: number;
    imageUrl?: string;
    isGift?: boolean;
}

interface SelectedItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

export default function CustomProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await ProductService.getAllProducts(true);
                const productsData = Array.isArray(response) ? response : response?.data || [];
                const filtered = Array.isArray(productsData)
                    ? productsData.filter((p: Product) => p.isGift === false)
                    : [];
                setProducts(filtered);
            } catch (err) {
                console.error(err);
                setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Thêm / bỏ sản phẩm
    const toggleItem = (product: Product) => {
        const exists = selectedItems.find((item) => item.productId === product.id);
        if (exists) {
            setSelectedItems(selectedItems.filter((item) => item.productId !== product.id));
        } else {
            setSelectedItems([
                ...selectedItems,
                {
                    productId: product.id,
                    name: product.name,
                    price: Number(product.basePrice || 0),
                    quantity: 1,
                },
            ]);
        }
    };

    // Cập nhật số lượng
    const updateQuantity = (productId: number, delta: number) => {
        setSelectedItems((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    // Xóa item
    const removeItem = (productId: number) => {
        setSelectedItems((prev) => prev.filter((item) => item.productId !== productId));
    };

    // Tổng tiền
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Tạo hộp quà
    const handleAddToCart = async () => {
    if (selectedItems.length === 0) {
        alert("Vui lòng chọn ít nhất một sản phẩm!");
        return;
    }

    const payload = {
        items: selectedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
        })),
        basePrice: totalPrice,
        isGift: true,
        name: "Custom",
    };

    try {
        // 1️⃣ tạo product hộp quà
        const productRes = await ProductService.createProduct(payload);

        const newProduct = productRes?.data || productRes;

        // 2️⃣ add vào cart
        await CartService.addToCart(newProduct.id, 1);

        alert("Đã thêm hộp quà vào giỏ hàng!");

        setSelectedItems([]);

    } catch (error) {
        console.error(error);
        alert("Không thể tạo hộp quà.");
    }
};

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-20 font-sans text-gray-800">
            {/* Hero Section */}
            <section className="relative bg-[#4a0404] py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif text-[#facc15] mb-4 uppercase tracking-[0.1em] leading-tight">
                        Tự Thiết Kế Hộp Quà
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl font-light italic">
                        Lựa chọn vật phẩm tinh túy, tạo nên món quà mang đậm dấu ấn cá nhân.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 mt-12">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 shadow-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content: Product List */}
                    <div className="lg:col-span-8">
                        <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-5">
                            <div>
                                <h2 className="text-2xl font-bold font-serif text-gray-900">Danh mục vật phẩm</h2>
                                <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-medium">Khám phá tinh hoa quà tết</p>
                            </div>
                            <p className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase">
                                {products.length} sản phẩm
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 opacity-50">
                                <Loader2 className="animate-spin mb-4 text-[#b30000]" size={40} />
                                <p className="font-medium tracking-widest uppercase text-xs">Đang tải tinh hoa...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                {products.map((product) => {
                                    const isSelected = selectedItems.some((i) => i.productId === product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 border ${
                                                isSelected ? "border-[#b30000] shadow-xl shadow-red-50" : "border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1"
                                            }`}
                                        >
                                            {/* Status Badge */}
                                            {isSelected && (
                                                <div className="absolute top-3 right-3 z-20 bg-[#b30000] text-white p-1.5 rounded-full shadow-lg animate-in zoom-in">
                                                    <Check size={14} strokeWidth={3} />
                                                </div>
                                            )}

                                            {/* Image Area */}
                                            <div className="relative h-56 overflow-hidden bg-gray-50">
                                                <img
                                                    src={product.imageUrl || "https://placehold.co/400x400?text=Product"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                                            </div>

                                            <div className="p-6">
                                                <h3 className="font-bold text-gray-800 mb-2 min-h-[3rem] leading-snug line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-baseline gap-1 mb-6">
                                                    <span className="text-xl font-bold text-[#b30000]">
                                                        {Number(product.basePrice || 0).toLocaleString()}
                                                    </span>
                                                    <span className="text-xs font-bold text-[#b30000] underline">đ</span>
                                                </div>

                                                <button
                                                    onClick={() => toggleItem(product)}
                                                    className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 ${
                                                        isSelected
                                                            ? "bg-[#b30000] text-white shadow-lg"
                                                            : "bg-white text-gray-600 border border-gray-200 hover:border-[#b30000] hover:text-[#b30000]"
                                                    }`}
                                                >
                                                    {isSelected ? "Đã chọn vào hộp" : "Thêm vào hộp"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-10 bg-white rounded-2xl shadow-2xl border border-gray-50 overflow-hidden">
                            <div className="bg-[#4a0404] p-6 flex justify-between items-center text-[#facc15]">
                                <h3 className="font-bold uppercase tracking-[0.2em] text-sm">Hộp Quà Của Bạn</h3>
                                <div className="bg-[#b30000]/20 p-2 rounded-lg">
                                    <Gift size={22} className="text-[#facc15]" />
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-6 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedItems.length === 0 ? (
                                        <div className="text-center py-16 text-gray-300">
                                            <Package size={48} className="mx-auto mb-4 opacity-20" />
                                            <p className="italic text-sm">Chưa có sản phẩm nào được chọn...</p>
                                        </div>
                                    ) : (
                                        selectedItems.map((item) => (
                                            <div key={item.productId} className="flex justify-between items-start gap-4 animate-in slide-in-from-right-4">
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-800 text-sm leading-tight mb-2">
                                                        {item.name}
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        {/* Quantity Controller */}
                                                        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg h-8 overflow-hidden">
                                                            <button
                                                                onClick={() => updateQuantity(item.productId, -1)}
                                                                className="px-2 h-full hover:bg-gray-200 text-gray-400 hover:text-red-600 transition-colors"
                                                            >
                                                                <Minus size={12} />
                                                            </button>
                                                            <span className="w-8 text-center text-xs font-bold text-gray-700">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.productId, 1)}
                                                                className="px-2 h-full hover:bg-gray-200 text-gray-400 hover:text-red-600 transition-colors"
                                                            >
                                                                <Plus size={12} />
                                                            </button>
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-medium">
                                                            {item.price.toLocaleString()}đ
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.productId)}
                                                    className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Total Area */}
                                <div className="border-t border-gray-100 pt-6 mb-8">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Tổng giá trị dự kiến</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-[#b30000]">
                                                {totalPrice.toLocaleString()}đ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={selectedItems.length === 0}
                                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs transition-all transform active:scale-95 shadow-lg ${
                                        selectedItems.length > 0
                                            ? "bg-[#b30000] text-white hover:bg-[#8e0000] hover:shadow-red-200"
                                            : "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                                    }`}
                                >
                                    Thêm vào giỏ hàng
                                </button>

                                <div className="mt-6 flex justify-center items-center text-gray-400 text-[10px] uppercase font-bold tracking-widest gap-2">
                                    <Truck size={14} className="opacity-50" />
                                    <span>Miễn phí vận chuyển tận nơi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom CSS for better scrollbar */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e2e2; }
            `}</style>
        </div>
    );
}