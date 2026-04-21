import { Link } from 'react-router-dom';

export default function SideNavBar({ isOpen }) {
  return (
    <aside className={`fixed top-0 left-0 h-full w-52 z-40 bg-neutral-950/95 backdrop-blur-xl flex flex-col p-4 shadow-2xl pt-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <nav className="space-y-1">
        <button className="w-full appearance-none bg-transparent border-0 text-left flex items-center gap-3 px-4 py-3 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all rounded-lg group" type="button">
          <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">person</span>
          <span className="font-medium text-sm">Profile</span>
        </button>
        <button className="w-full appearance-none bg-transparent border-0 text-left flex items-center gap-3 px-4 py-3 text-neutral-500 hover:bg-neutral-900 hover:text-white transition-all rounded-lg group" type="button">
          <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">settings</span>
          <span className="font-medium text-sm">Settings</span>
        </button>
        <Link to="/addresses" className="w-full appearance-none bg-transparent border-0 text-left flex items-center gap-3 px-4 py-3 text-neutral-500 hover:bg-neutral-900 hover:text-white transition-all rounded-lg group no-underline">
          <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">location_on</span>
          <span className="font-medium text-sm">Addresses</span>
        </Link>
        <button className="w-full appearance-none bg-transparent border-0 text-left flex items-center gap-3 px-4 py-3 text-neutral-500 hover:bg-neutral-900 hover:text-white transition-all rounded-lg group" type="button">
          <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">payments</span>
          <span className="font-medium text-sm">Payment Info</span>
        </button>
        <Link to="/orders" className="w-full appearance-none bg-transparent border-0 text-left flex items-center gap-3 px-4 py-3 text-neutral-500 hover:bg-neutral-900 hover:text-white transition-all rounded-lg group no-underline">
          <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">receipt_long</span>
          <span className="font-medium text-sm">Order History</span>
        </Link>
      </nav>
    </aside>
  );
}
