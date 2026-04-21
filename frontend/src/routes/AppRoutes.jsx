import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage';
import CartPage from '../pages/CartPage/CartPage';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage';
import AddressesPage from '../pages/AddressesPage/AddressesPage';
import OrderHistoryPage from '../pages/OrderHistoryPage/OrderHistoryPage';
import NotFoundPage from '../pages/404Page/NotFoundPage';
import AppLayout from '../components/Layout/AppLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Navigate to="/" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/addresses" element={<AddressesPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
