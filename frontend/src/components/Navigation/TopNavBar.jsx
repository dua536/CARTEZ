import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../store/AuthPage/authSlice';
import { selectCartCount } from '../../store/selectors';
import { getSearchValidationError, normalizeSearchQuery } from '../../utils/search';

export default function TopNavBar({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useSelector(selectCartCount);
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isSearchDirty, setIsSearchDirty] = useState(false);

  const isSearchRoute = location.pathname.startsWith('/search');
  const queryFromUrl = new URLSearchParams(location.search).get('q') || '';
  const normalizedQueryFromUrl = normalizeSearchQuery(queryFromUrl);
  const effectiveSearchInput = isSearchRoute
    ? (isSearchDirty ? searchInput : normalizedQueryFromUrl)
    : searchInput;

  const handleSearchChange = (event) => {
    const nextValue = event.target.value;
    setIsSearchDirty(true);
    setSearchInput(nextValue);

    if (searchError) {
      setSearchError(getSearchValidationError(nextValue));
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const validationError = getSearchValidationError(effectiveSearchInput);

    if (validationError) {
      setSearchError(validationError);
      return;
    }

    const normalizedQuery = normalizeSearchQuery(effectiveSearchInput);
    setIsSearchDirty(false);
    setSearchInput(normalizedQuery);
    setSearchError('');
    navigate(`/search?q=${encodeURIComponent(normalizedQuery)}`);
  };

  const handleClearSearch = () => {
    setIsSearchDirty(false);
    setSearchError('');
    setSearchInput('');

    if (isSearchRoute) {
      navigate('/search');
    }
  };

  const visibleSearchError = searchError;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/', { replace: true });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-950/60 backdrop-blur-xl flex justify-between items-center px-4 md:px-8 py-4 shadow-[0_24_48px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4 md:gap-12">
        <button 
          onClick={onToggleSidebar}
          className="hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-white/5 disabled:opacity-50"
          aria-label="Toggle Menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <Link to="/" className="text-2xl font-bold tracking-tight text-white hidden sm:block hover:text-primary transition-colors">CartZen</Link>
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link to="/" className="text-emerald-400 font-semibold transition-colors duration-300">Shop</Link>
          <button className="appearance-none bg-transparent border-0 p-0 m-0 text-neutral-400 hover:text-emerald-300 transition-colors duration-300" type="button">Curated</button>
          <button className="appearance-none bg-transparent border-0 p-0 m-0 text-neutral-400 hover:text-emerald-300 transition-colors duration-300" type="button">Sommelier's Pick</button>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
          <input
            className={`bg-surface-container-highest border-none rounded-full px-6 py-2 pr-16 w-80 text-sm focus:ring-1 text-on-surface placeholder:text-neutral-500 ${visibleSearchError ? 'focus:ring-red-400/70 ring-1 ring-red-400/60' : 'focus:ring-primary/50'}`}
            placeholder="Search curated collection..."
            type="text"
            value={effectiveSearchInput}
            onChange={handleSearchChange}
            aria-label="Search products"
            aria-invalid={Boolean(visibleSearchError)}
          />
          {effectiveSearchInput && (
            <button
              type="button"
              className="absolute right-9 top-1.5 text-neutral-500 hover:text-on-surface transition-colors"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
          <button
            type="submit"
            className="absolute right-3 top-1.5 text-neutral-500 hover:text-primary transition-colors"
            aria-label="Run search"
          >
            <span className="material-symbols-outlined text-lg">search</span>
          </button>
          {visibleSearchError && (
            <p className="absolute top-11 left-3 text-[11px] text-red-300 bg-neutral-950/80 px-2 py-1 rounded-md whitespace-nowrap">
              {visibleSearchError}
            </p>
          )}
        </form>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative hover:text-primary transition-colors">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary-container text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-primary transition-colors flex items-center gap-1"
            type="button"
            aria-label="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="hidden sm:inline text-xs font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
