import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  UserCheck,
  Settings,
  Menu,
  X,
  RefreshCw,
  MessageCircle,
  Sun,
  Moon
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Dashboard Utama", href: "/", icon: Home },
  { name: "Dashboard Billing", href: "/billing", icon: LayoutDashboard },
  { name: "Pelanggan & Paket", href: "/customers", icon: Users },
  { name: "Invoice", href: "/invoices", icon: FileText },
  { name: "Pembayaran & Keuangan", href: "/payments", icon: CreditCard },
  { name: "Kolektor", href: "/collector", icon: UserCheck },
  { name: "WA Bot", href: "/wa-bot", icon: MessageCircle },
  { name: "Pengaturan", href: "/settings", icon: Settings },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check local storage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans transition-colors duration-200">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/80 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#1e222d] dark:bg-slate-900 text-gray-300 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col border-r border-transparent dark:border-slate-800",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-center h-20 px-6 border-b border-gray-700/50 dark:border-slate-800">
          <div className="text-center">
            <h1 className="text-xl font-bold text-white tracking-wider dark:text-cyan-400">GEMBOK-BILL</h1>
            <p className="text-[10px] text-gray-400 dark:text-slate-500">GenieACS - Mikrotik - Whatsapp Bot</p>
          </div>
          <button
            className="lg:hidden absolute right-4 text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-gray-800 dark:bg-cyan-500/10 text-white dark:text-cyan-400"
                    : "text-gray-300 dark:text-slate-400 hover:bg-gray-800 dark:hover:bg-slate-800/50 hover:text-white dark:hover:text-slate-200"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 mr-3 flex-shrink-0",
                    isActive ? "text-blue-400 dark:text-cyan-400" : "text-gray-400 dark:text-slate-500"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700/50 dark:border-slate-800 text-center">
          <div className="text-xs text-gray-400 dark:text-slate-500 mb-3">
            <p className="font-bold text-gray-300 dark:text-slate-300">Version Info</p>
            <p>v1.0.0</p>
            <p>Build: 001</p>
            <p>Released: N/A</p>
          </div>
          <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white dark:text-slate-300 border border-gray-600 dark:border-slate-700 rounded hover:bg-gray-800 dark:hover:bg-slate-800 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Cek Update
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 transition-colors duration-200">
          <div className="flex items-center">
            <button
              className="lg:hidden text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 mr-4"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="lg:hidden text-lg font-bold text-gray-900 dark:text-white">GEMBOK-BILL</span>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-cyan-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                AD
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300 hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
