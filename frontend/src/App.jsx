import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthPage from './pages/AuthPage/AuthPage';
import AppRoutes from './routes/AppRoutes';
import { selectIsAuthenticated } from './store/selectors';
import { fetchCart } from './store/CartPage/cartSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <AppRoutes />;
}

export default App;