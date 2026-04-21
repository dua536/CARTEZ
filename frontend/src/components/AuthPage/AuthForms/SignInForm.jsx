import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../../../store/AuthPage/authSlice';
import { selectAuthError, selectAuthStatus } from '../../../store/selectors';
import styles from './AuthForms.module.css';

export default function SignInForm({ onSwitchView }) {
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);
  const isSubmitting = authStatus === 'loading';
  const [formValues, setFormValues] = useState({ email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    if (authError) {
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());
    await dispatch(loginUser(formValues));
  };

  return (
    <div className="flex-col gap-8 flex form-visible">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-headline font-bold text-on-surface">Welcome Back</h3>
        <p className="text-on-surface-variant text-sm">Please enter your details to access your kitchen.</p>
      </div>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email Address</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
            <input
              className="w-full bg-surface-container-highest border-none rounded-lg h-14 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 transition-all"
              placeholder="alex@example.com"
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Password</label>
            <button className="text-xs font-bold text-primary hover:underline" onClick={() => onSwitchView('forgot')} type="button">Forgot password?</button>
          </div>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
            <input
              className="w-full bg-surface-container-highest border-none rounded-lg h-14 pl-12 pr-12 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 transition-all"
              placeholder="••••••••"
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface" type="button">
              <span className="material-symbols-outlined" data-icon="eye">visibility</span>
            </button>
          </div>
        </div>
        {authError && <p className="text-sm text-red-400">{authError}</p>}
        <button className={`${styles.btnGradient} h-14 rounded-lg text-on-primary-container font-bold text-base shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed`} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing In...' : 'Sign In to CartZen'}
        </button>
      </form>
      <div className="relative flex items-center gap-4 py-2">
        <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
        <span className="text-xs font-bold text-outline uppercase tracking-widest">or continue with</span>
        <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
      </div>
      <div className="grid grid-cols-1 flex justify-center">
        <button className="flex items-center justify-center gap-3 h-14 rounded-lg bg-surface-container-high border border-outline-variant/20 hover:bg-surface-bright transition-colors w-full">
          <svg className="size-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span className="text-sm font-bold text-on-surface">Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
