import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-on-background min-h-screen w-full flex flex-col items-center justify-center font-body">
      <h1 className="text-[6rem] font-extrabold font-headline mb-4 text-primary">404</h1>
      <p className="text-2xl text-on-surface-variant mb-8">Oops! The page or product you're looking for doesn't exist.</p>
      <button 
        onClick={() => navigate('/')} 
        className="bg-surface-variant text-white border border-outline px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-surface-variant/80 transition-colors"
      >
        <span className="material-symbols-outlined">home</span>
        Back to Home
      </button>
    </div>
  );
}
