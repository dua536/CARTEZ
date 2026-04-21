import React from 'react';
import styles from './AuthLayout.module.css';
import BrandingPanel from '../BrandingPanel/BrandingPanel';

export default function AuthLayout({ children }) {
  return (
    <>
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div 
          className="w-full h-full bg-cover bg-center" 
          data-alt="Cinematic high-quality fresh produce and grocery close-ups" 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAG7zQlYgzbrRU8ptuRYkCxlz8TwjWdNdXJVSWAfB2c_m0nPy2rzcGQK292jMcczKNTv_sX5H5SPO_8I9S2dt2A1Dl9Inoinj2jjwTzy53aQsadi3bEfVIHhko7uoS71eFBrevggYQ_LFVHdaMTXiFMQIKyVDxJBgpOg0fFGQc5TsOpIYCmDr3gJDMA_y7-qD_5h_wtaGDuEj2wO8bmMZg370aQ9UaGzTyrz30BBivQuX8eTiW-Hll4RFSk-u5cGXGaTeCHZF6qZ7qa")' }}
        ></div>
      </div>
      
      <main className="relative z-20 flex items-center justify-center min-h-screen p-8">
        <div className={`w-full max-w-[1100px] scale-[0.8] -translate-y-12 grid grid-cols-12 gap-0 overflow-hidden rounded-xl shadow-2xl ${styles.glassPanel}`}>
          <BrandingPanel />
          <div className="col-span-7 bg-surface-container-low/50 p-12 overflow-y-auto max-h-[819px]" id="auth-container">
            {children}
          </div>
        </div>
      </main>
      
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-tertiary/5 blur-[100px] rounded-full"></div>
      </div>
    </>
  );
}
