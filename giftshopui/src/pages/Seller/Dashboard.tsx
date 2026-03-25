import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  FileText, 
  Users, 
  Layers, 
  Package, 
  Box, 
  Loader2 
} from 'lucide-react';
// Import các hàm service của bạn ở đây
// import { getAllCategories, getAllProducts, getAllItems, getAllQuotes, getAllUsers, getAllOrders } from '@/services/api';
import CategorySevice from '../../api/service/category.service';
import ProductService from '../../api/service/product.service';
import ItemService from '../../api/service/item.service';
import QuoteService from '../../api/service/quote.service';
import UserService from '../../api/service/user.service';
import OrderService from '../../api/service/order.service';

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    categories: 0,
    products: 0,
    items: 0,
    quotes: 0,
    users: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  const getCount = (response: any) => {
    if (Array.isArray(response)) return response.length;
    if (response?.success && Array.isArray(response?.data)) return response.data.length;
    return 0;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Gọi tất cả API cùng lúc để tối ưu thời gian
        const [categories, products, items, quotes, users, orders] = await Promise.all([
          CategorySevice.getAllCategories(),
          ProductService.getAllProducts(),
          ItemService.getAllItems(),
          QuoteService.getAllQuotes(),
          UserService.getAllUsers(),
          OrderService.getAllOrders(),
        ]);

        setStatsData({
          categories: getCount(categories),
          products: getCount(products),
          items: getCount(items),
          quotes: getCount(quotes),
          users: getCount(users),
          orders: getCount(orders),
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const STATS_CONFIG = [
    { label: 'Danh mục', value: statsData.categories, icon: <Layers />, color: 'bg-purple-500' },
    { label: 'Sản phẩm', value: statsData.products, icon: <Package />, color: 'bg-blue-500' },
    { label: 'Số lượng Item', value: statsData.items, icon: <Box />, color: 'bg-cyan-500' },
    { label: 'Báo giá', value: statsData.quotes, icon: <FileText />, color: 'bg-orange-500' },
    { label: 'Người dùng', value: statsData.users, icon: <Users />, color: 'bg-indigo-500' },
    { label: 'Đơn hàng', value: statsData.orders, icon: <ShoppingCart />, color: 'bg-green-500' },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tổng quan hệ thống</h1>
        <p className="text-gray-500 mt-1">Số liệu thống kê thực tế từ hệ thống.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATS_CONFIG.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${stat.color} text-white rounded-lg flex items-center justify-center mb-3 shadow-inner`}>
              {React.cloneElement(stat.icon, { size: 20 })}
            </div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-xl font-black mt-1 text-gray-800">
              {stat.value.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 h-64 flex items-center justify-center text-gray-300 italic uppercase font-black tracking-widest text-center">
              Biểu đồ phân tích doanh thu
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 h-64 flex items-center justify-center text-gray-300 italic uppercase font-black tracking-widest text-center">
              Hoạt động gần đây
          </div>
      </div>
    </div>
  );
}
