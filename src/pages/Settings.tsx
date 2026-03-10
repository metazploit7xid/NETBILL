import { useState } from "react";
import { Settings as SettingsIcon, CreditCard, MessageCircle, ShieldAlert, Network, Monitor, Smartphone, RefreshCw, LogOut } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("pembayaran");
  const [activeGateway, setActiveGateway] = useState("Midtrans");

  return (
    <div className="space-y-6 font-sans">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pengaturan</h1>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-gray-200 dark:border-slate-800 pb-2">
        <button 
          onClick={() => setActiveTab("pembayaran")}
          className={`text-sm font-medium flex items-center transition-colors ${activeTab === "pembayaran" ? "text-blue-600 dark:text-cyan-400" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"}`}
        >
          Pengaturan Pembayaran
        </button>
        <button 
          onClick={() => setActiveTab("isolir")}
          className={`text-sm font-medium flex items-center transition-colors ${activeTab === "isolir" ? "text-blue-600 dark:text-cyan-400" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"}`}
        >
          <ShieldAlert className="w-4 h-4 mr-1.5" />
          Pengaturan ISOLIR
        </button>
        <button 
          onClick={() => setActiveTab("network")}
          className={`text-sm font-medium flex items-center transition-colors ${activeTab === "network" ? "text-blue-600 dark:text-cyan-400" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"}`}
        >
          <Network className="w-4 h-4 mr-1.5" />
          Network Mapping
        </button>
        <button 
          onClick={() => setActiveTab("genieacs")}
          className={`text-sm font-medium flex items-center transition-colors ${activeTab === "genieacs" ? "text-blue-600 dark:text-cyan-400" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"}`}
        >
          <Monitor className="w-4 h-4 mr-1.5" />
          GenieACS
        </button>
      </div>

      {activeTab === "pembayaran" && (
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2" />
            Pengaturan Payment Gateway
          </h2>

          {/* Gateway Aktif */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded shadow-sm transition-colors duration-200">
            <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center">
              <span className="font-medium text-gray-700 dark:text-white flex items-center text-sm">
                <CreditCard className="w-4 h-4 mr-2" />
                Gateway Aktif
              </span>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Pilih Gateway Aktif:</label>
                <select 
                  className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                  value={activeGateway}
                  onChange={(e) => setActiveGateway(e.target.value)}
                >
                  <option value="Midtrans">Midtrans</option>
                  <option value="Xendit">Xendit</option>
                  <option value="Tripay">Tripay</option>
                </select>
                <button className="mt-4 px-4 py-2 bg-[#0d6efd] dark:bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center">
                  <SettingsIcon className="w-4 h-4 mr-1.5" />
                  Simpan Gateway Aktif
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Status Gateway:</label>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-[11px] font-bold rounded text-white ${activeGateway === 'Midtrans' ? 'bg-[#198754] dark:bg-emerald-600' : 'bg-gray-500 dark:bg-slate-700'}`}>
                    Midtrans: {activeGateway === 'Midtrans' ? 'Enabled (Active)' : 'Disabled'}
                  </span>
                  <span className={`px-2 py-1 text-[11px] font-bold rounded text-white ${activeGateway === 'Xendit' ? 'bg-[#198754] dark:bg-emerald-600' : 'bg-gray-500 dark:bg-slate-700'}`}>
                    Xendit: {activeGateway === 'Xendit' ? 'Enabled (Active)' : 'Disabled'}
                  </span>
                  <span className={`px-2 py-1 text-[11px] font-bold rounded text-white ${activeGateway === 'Tripay' ? 'bg-[#198754] dark:bg-emerald-600' : 'bg-gray-500 dark:bg-slate-700'}`}>
                    Tripay: {activeGateway === 'Tripay' ? 'Enabled (Active)' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gateway Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Midtrans */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded shadow-sm transition-colors duration-200">
              <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-white flex items-center text-sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Midtrans
                </span>
                <span className="px-2 py-0.5 bg-[#198754] dark:bg-emerald-600 text-white text-[10px] font-bold rounded">Enabled</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white dark:bg-slate-800 rounded-full absolute right-1 top-0.5"></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700 dark:text-slate-300">Aktifkan Midtrans</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-5 bg-gray-300 dark:bg-slate-700 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white dark:bg-slate-800 rounded-full absolute left-1 top-0.5"></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700 dark:text-slate-300">Production Mode</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Server Key:</label>
                  <input type="text" defaultValue="SB-Mid-server-XXXXXXXXXXXXXXXXXXXXXX" className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Client Key:</label>
                  <input type="text" defaultValue="SB-Mid-client-XXXXXXXXXXXXXXXXXXXXXX" className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Merchant ID:</label>
                  <input type="text" defaultValue="G123456789" className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Base URL (Callback/Return):</label>
                  <input type="text" placeholder="https://billing.domainanda.com atau http://IP:PORT" className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">Jika kosong, sistem menggunakan host/port dari settings.json</p>
                </div>
              </div>
            </div>

            {/* Xendit */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded shadow-sm transition-colors duration-200">
              <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-white flex items-center text-sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Xendit
                </span>
                <span className="px-2 py-0.5 bg-[#198754] dark:bg-emerald-600 text-white text-[10px] font-bold rounded">Enabled</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white dark:bg-slate-800 rounded-full absolute right-1 top-0.5"></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700 dark:text-slate-300">Aktifkan Xendit</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white dark:bg-slate-800 rounded-full absolute right-1 top-0.5"></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700 dark:text-slate-300">Production Mode</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">API Key:</label>
                  <input type="text" defaultValue="xnd_public_development_XXXXXXXXXXXXXXXXXXXXXX" className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Callback Token:</label>
                  <input type="text" defaultValue="your_callback_token_here" className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Base URL (Redirect):</label>
                  <input type="text" placeholder="https://billing.domainanda.com atau http://IP:PORT" className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">Jika kosong, sistem menggunakan host/port dari settings.json</p>
                </div>
              </div>
            </div>

            {/* Tripay */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded shadow-sm transition-colors duration-200">
              <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-white flex items-center text-sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Tripay
                </span>
                <span className="px-2 py-0.5 bg-[#198754] dark:bg-emerald-600 text-white text-[10px] font-bold rounded">Enabled</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white dark:bg-slate-800 rounded-full absolute right-1 top-0.5"></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700 dark:text-slate-300">Aktifkan Tripay</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-5 bg-gray-300 dark:bg-slate-700 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white dark:bg-slate-800 rounded-full absolute left-1 top-0.5"></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700 dark:text-slate-300">Production Mode</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">API Key:</label>
                  <input type="text" defaultValue="your_tripay_api_key_here" className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Private Key:</label>
                  <input type="text" defaultValue="your_tripay_private_key_here" className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Merchant Code:</label>
                  <input type="text" defaultValue="your_merchant_code_here" className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Base URL (Callback):</label>
                  <input type="text" placeholder="https://billing.domainanda.com atau http://IP:PORT" className="w-full border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">Jika kosong, sistem menggunakan host/port dari settings.json</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "network" && (
        <div className="bg-white dark:bg-slate-900 p-8 text-center rounded shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
          <Network className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Network Mapping & Routers</h3>
          <p className="text-gray-500 dark:text-slate-400 mt-2 mb-6">Kelola koneksi router Mikrotik dan mapping jaringan Anda.</p>
          <a 
            href="/routers" 
            className="inline-flex items-center px-4 py-2 bg-[#0d6efd] dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Kelola Router Mikrotik
          </a>
        </div>
      )}
    </div>
  );
}
