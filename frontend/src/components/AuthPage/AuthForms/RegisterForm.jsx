import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, registerUser } from '../../../store/AuthPage/authSlice';
import { selectAuthError, selectAuthStatus } from '../../../store/selectors';
import styles from './AuthForms.module.css';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);
  const isSubmitting = authStatus === 'loading';
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

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
    await dispatch(registerUser(formValues));
  };

  return (
    <div className="flex-col gap-8 flex form-visible">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-headline font-bold text-on-surface">Create your account</h3>
        <p className="text-on-surface-variant text-sm">Experience the new standard in grocery curation.</p>
      </div>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">First Name</label>
            <input
              className="w-full bg-surface-container-highest border-none rounded-lg h-14 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 transition-all"
              placeholder="Julian"
              type="text"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Last Name</label>
            <input
              className="w-full bg-surface-container-highest border-none rounded-lg h-14 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 transition-all"
              placeholder="Vance"
              type="text"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email Address</label>
          <input
            className="w-full bg-surface-container-highest border-none rounded-lg h-14 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 transition-all"
            placeholder="hello@cartzen.com"
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Password</label>
          <div className="relative">
            <input
              className="w-full bg-surface-container-highest border-none rounded-lg h-14 px-4 pr-12 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 transition-all"
              placeholder="••••••••"
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface" type="button">
              <span className="material-symbols-outlined" data-icon="eye">visibility</span>
            </button>
          </div>
        </div>
        <div className="flex items-start gap-3 py-2">
          <input className="mt-1 size-5 rounded bg-surface-container-highest border-none text-primary focus:ring-offset-background focus:ring-primary" id="terms" type="checkbox" />
          <label className="text-sm text-on-surface-variant leading-tight" htmlFor="terms">
            I agree to the <a className="text-on-surface hover:text-primary underline underline-offset-4 decoration-zinc-800 transition-colors" href="#">Terms of Service</a> and <a className="text-on-surface hover:text-primary underline underline-offset-4 decoration-zinc-800 transition-colors" href="#">Privacy Policy</a>.
          </label>
        </div>
        {authError && <p className="text-sm text-red-400">{authError}</p>}
        <button className={`${styles.btnGradient} h-14 rounded-lg text-on-primary-container font-bold text-base shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed`} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
