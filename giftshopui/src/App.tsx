import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MasterPage from './pages/Customer/MasterPage';
import Shop from './pages/Customer/Shop';
import CustomProduct from './pages/Customer/CustomProduct';
import Cart from './pages/Customer/Cart';
import UserProfile from './pages/Customer/UserProfile';
import ProductDetail from './pages/Customer/ProductDetail';
import Dashboard from './pages/Seller/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import AuthPage from './pages/Customer/AuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import CategoryManagement from './pages/Seller/CategoryManagement';
import ProductManagement from './pages/Seller/ProductManagement';
import OrderManagement from './pages/Seller/OrderManagement';
import UserManagement from './pages/Seller/UserManagement';
import ItemManagement from './pages/Seller/ItemManagement';
import QuoteManagement from './pages/Seller/QuoteManagement';
import AdminProductDetail from './pages/Seller/AdminProductDetail';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />

                    {/* ROUTE DÀNH CHO CUSTOMER (Giao diện mua hàng) */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<MasterPage />} /> 
                        <Route path="shop" element={<Shop />} />
                        <Route path="product/:id" element={<ProductDetail />} />
                        
                        <Route element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']} />}>
                            <Route path="cart" element={<Cart />} />
                            <Route path="profile" element={<UserProfile />} />
                            <Route path="custom-product" element={<CustomProduct />} />
                        </Route>

                        <Route path="*" element={<MasterPage />} />
                    </Route>

                    {/* ROUTE DÀNH CHO ADMIN (Giao diện quản trị) */}
                    <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                        {/* Sử dụng AdminLayout làm khung */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="categories" element={<CategoryManagement />} />
                            <Route path="products" element={<ProductManagement />} />
                            <Route path="orders" element={<OrderManagement />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="Items" element={<ItemManagement/>} />
                            <Route path="quotes" element={<QuoteManagement/>} />
                            <Route path="products/:id" element={<AdminProductDetail />} />
                        </Route>
                    </Route>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}