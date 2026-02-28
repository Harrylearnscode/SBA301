import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MasterPage from './pages/Customer/MasterPage';
import Shop from './pages/Customer/Shop';
import CustomProduct from './pages/Customer/CustomProduct';
import Quote from './pages/Customer/Quote';
import Cart from './pages/Customer/Cart';
import UserProfile from './pages/Customer/UserProfile';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Tất cả các Route nằm trong Layout sẽ có chung Header & Footer */}
                <Route path="customer" element={<Layout />}>
                    <Route path='masterPage' element={<MasterPage />} /> {/* Trang chủ */}

                    {/* Định nghĩa các Route khác theo Header */}
                     <Route path="shop" element={<Shop />} />
                     <Route path="custom" element={<CustomProduct />} />
                     <Route path="quote" element={<Quote />} />
                     <Route path="cart" element={<Cart />} />
                     <Route path="profile" element={<UserProfile />} />
                </Route>
                <Route path="*" element={<MasterPage />} />
                
            </Routes>
        </BrowserRouter>
    );
}