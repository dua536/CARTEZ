export default function Footer() {
  return (
    <footer className="bg-neutral-950 w-full py-12 px-8 border-t border-neutral-800/20 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
        <div className="text-neutral-600 text-[10px] uppercase tracking-[0.2em] font-label">
          © 2024 CartZen. The Digital Sommelier.
        </div>
        <div className="flex gap-12">
          <button className="appearance-none bg-transparent border-0 p-0 m-0 text-neutral-600 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-label" type="button">Privacy</button>
          <button className="appearance-none bg-transparent border-0 p-0 m-0 text-neutral-600 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-label" type="button">Terms</button>
          <button className="appearance-none bg-transparent border-0 p-0 m-0 text-neutral-600 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-label" type="button">Sourcing</button>
          <button className="appearance-none bg-transparent border-0 p-0 m-0 text-neutral-600 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-label" type="button">Sustainability</button>
        </div>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-neutral-500 cursor-pointer hover:text-emerald-400">language</span>
          <span className="material-symbols-outlined text-neutral-500 cursor-pointer hover:text-emerald-400">support_agent</span>
        </div>
      </div>
    </footer>
  );
}
