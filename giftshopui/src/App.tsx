import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MasterPage from './pages/Customer/MasterPage';
import Shop from './pages/Customer/Shop';
import CustomProduct from './pages/Customer/CustomProduct';
import Quote from './pages/Customer/Quote';
import Cart from './pages/Customer/Cart';
import UserProfile from './pages/Customer/UserProfile';
import Headers from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AuthProvider } from './contexts/AuthContext';
import AuthPage from './pages/Customer/AuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Headers />
                <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="customer" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}><Layout /></ProtectedRoute>}>
                        <Route path='masterPage' element={<MasterPage />} /> {/* Trang chủ */}
                        <Route path="shop" element={<Shop />} />
                        <Route path="customProduct" element={<CustomProduct />} />
                        <Route path="quote" element={<Quote />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="profile" element={<UserProfile />} />
                    </Route>

                    <Route path="seller" element={<MasterPage />}>
                    </Route>

                    <Route path="*" element={<MasterPage />} />
                    
                </Routes>
                <Footer />
            </BrowserRouter>
        </AuthProvider>
    );
}