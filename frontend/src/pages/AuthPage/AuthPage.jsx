import React, { useState } from 'react';
import AuthLayout from '../../components/AuthPage/AuthLayout';
import SignInForm from '../../components/AuthPage/AuthForms/SignInForm';
import RegisterForm from '../../components/AuthPage/AuthForms/RegisterForm';
import ForgotPasswordForm from '../../components/AuthPage/AuthForms/ForgotPasswordForm';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState('signin');

  return (
    <AuthLayout>
      <div className={`flex border-b border-outline-variant/30 mb-10 ${currentView === 'forgot' ? 'hidden' : ''}`} id="auth-tabs">
        <button 
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${currentView === 'signin' ? 'border-primary text-on-surface' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`} 
          onClick={() => setCurrentView('signin')}
        >
          Sign In
        </button>
        <button 
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${currentView === 'register' ? 'border-primary text-on-surface' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`} 
          onClick={() => setCurrentView('register')}
        >
          Register
        </button>
      </div>

      <div className="relative min-h-[31.25rem]">
        {currentView === 'signin' && <SignInForm onSwitchView={setCurrentView} />}
        {currentView === 'register' && <RegisterForm />}
        {currentView === 'forgot' && <ForgotPasswordForm onSwitchView={setCurrentView} />}
      </div>
    </AuthLayout>
  );
}
