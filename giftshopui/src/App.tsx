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

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />

                    <Route path="/" element={<Layout />}>
                        
                        <Route index element={<MasterPage />} /> {/* Truy cập '/' ra MasterPage */}
                        <Route path="shop" element={<Shop />} />
                        <Route path="product/:id" element={<ProductDetail />} />
                        

                        <Route element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']} />}>
                            <Route path="cart" element={<Cart />} />
                            <Route path="profile" element={<UserProfile />} />
                            <Route path="custom-product" element={<CustomProduct />} />
                        </Route>

                        <Route path="*" element={<MasterPage />} />
                    </Route>

                    {/* Route cho Admin/Seller - không dùng Layout */}
                    <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                        <Route path="/admin" element={<Dashboard />} />
                    </Route>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}