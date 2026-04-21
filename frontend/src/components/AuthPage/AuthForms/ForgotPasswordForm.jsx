import styles from './AuthForms.module.css';

export default function ForgotPasswordForm({ onSwitchView }) {
  return (
    <div className="flex-col gap-8 flex form-visible">
      <div className="flex flex-col gap-4">
        <button className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-2 group transition-colors" onClick={() => onSwitchView('signin')} type="button">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          BACK TO LOGIN
        </button>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-headline font-bold text-on-surface">Restore Your Sanctuary</h3>
          <p className="text-on-surface-variant text-sm">Follow our three-step verification to secure your account.</p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center relative px-2">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/30 -z-10"></div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary-container text-xs font-bold">1</div>
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant text-xs font-bold">2</div>
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant text-xs font-bold">3</div>
        </div>
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Verification Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">alternate_email</span>
              <input className="w-full bg-surface-container-highest border-none rounded-lg h-14 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40 transition-all" placeholder="gourmet@example.com" type="email" />
            </div>
          </div>
          <div className="flex flex-col gap-2 opacity-50">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Security Token (6 Digits)</label>
            <div className="grid grid-cols-6 gap-2">
              <input className="h-12 bg-surface-container-highest border-none rounded-lg text-center text-xl font-bold text-primary" disabled maxLength="1" type="text" />
              <input className="h-12 bg-surface-container-highest border-none rounded-lg text-center text-xl font-bold text-primary" disabled maxLength="1" type="text" />
              <input className="h-12 bg-surface-container-highest border-none rounded-lg text-center text-xl font-bold text-primary" disabled maxLength="1" type="text" />
              <input className="h-12 bg-surface-container-highest border-none rounded-lg text-center text-xl font-bold text-primary" disabled maxLength="1" type="text" />
              <input className="h-12 bg-surface-container-highest border-none rounded-lg text-center text-xl font-bold text-primary" disabled maxLength="1" type="text" />
              <input className="h-12 bg-surface-container-highest border-none rounded-lg text-center text-xl font-bold text-primary" disabled maxLength="1" type="text" />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-outline">Available in 2:00</span>
            </div>
          </div>
          <button className={`${styles.btnGradient} h-14 rounded-lg text-on-primary-container font-bold text-base shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all`} type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
