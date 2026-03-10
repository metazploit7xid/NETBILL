import { useState, useEffect } from "react";
import { 
  Monitor, Wifi, WifiOff, Users, UserCheck, UserX, 
  Settings, RefreshCw, CheckCircle, Activity, Download, Upload
} from "lucide-react";

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    totalCustomers: 41,
    activeCustomers: 39,
    offlineCustomers: 2,
    genieAcsTotal: 0,
    genieAcsOnline: 0,
    genieAcsOffline: 0
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100">Dashboard Sistem</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center px-3 py-1.5 border border-blue-500 text-blue-500 dark:text-cyan-400 dark:border-cyan-500 rounded text-sm hover:bg-blue-50 dark:hover:bg-cyan-900/30 transition-colors">
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Validasi Konfigurasi
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-emerald-500 text-emerald-500 dark:text-emerald-400 dark:border-emerald-500 rounded text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
            <Settings className="w-4 h-4 mr-1.5" />
            Pengaturan Sistem
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GenieACS Stats */}
        <div className="bg-[#1877f2] dark:bg-blue-900/40 dark:border dark:border-blue-500/30 rounded-lg p-6 text-white dark:text-blue-100 flex flex-col items-center justify-center shadow-sm transition-colors duration-200">
          <Monitor className="w-8 h-8 mb-2 opacity-90 text-white dark:text-blue-400" />
          <h3 className="text-sm font-medium mb-1 text-white dark:text-blue-200">Total Device GenieACS</h3>
          <p className="text-3xl font-light text-white dark:text-blue-400">{statsData.genieAcsTotal}</p>
        </div>
        <div className="bg-[#28a745] dark:bg-emerald-900/40 dark:border dark:border-emerald-500/30 rounded-lg p-6 text-white dark:text-emerald-100 flex flex-col items-center justify-center shadow-sm transition-colors duration-200">
          <Wifi className="w-8 h-8 mb-2 opacity-90 text-white dark:text-emerald-400" />
          <h3 className="text-sm font-medium mb-1 text-white dark:text-emerald-200">Device Online</h3>
          <p className="text-3xl font-light text-white dark:text-emerald-400">{statsData.genieAcsOnline}</p>
        </div>
        <div className="bg-[#dc3545] dark:bg-red-900/40 dark:border dark:border-red-500/30 rounded-lg p-6 text-white dark:text-red-100 flex flex-col items-center justify-center shadow-sm transition-colors duration-200">
          <WifiOff className="w-8 h-8 mb-2 opacity-90 text-white dark:text-red-400" />
          <h3 className="text-sm font-medium mb-1 text-white dark:text-red-200">Device Offline</h3>
          <p className="text-3xl font-light text-white dark:text-red-400">{statsData.genieAcsOffline}</p>
        </div>

        {/* PPPoE Stats */}
        <div className="bg-[#6c757d] dark:bg-slate-800 dark:border dark:border-slate-700 rounded-lg p-6 text-white dark:text-slate-300 flex flex-col items-center justify-center shadow-sm transition-colors duration-200">
          <Users className="w-8 h-8 mb-2 opacity-90 text-white dark:text-slate-400" />
          <h3 className="text-sm font-medium mb-1 text-white dark:text-slate-300">Total User PPPoE</h3>
          <p className="text-3xl font-light text-white dark:text-slate-400">{statsData.totalCustomers}</p>
        </div>
        <div className="bg-[#198754] dark:bg-emerald-900/40 dark:border dark:border-emerald-500/30 rounded-lg p-6 text-white dark:text-emerald-100 flex flex-col items-center justify-center shadow-sm transition-colors duration-200">
          <UserCheck className="w-8 h-8 mb-2 opacity-90 text-white dark:text-emerald-400" />
          <h3 className="text-sm font-medium mb-1 text-white dark:text-emerald-200">PPPoE Aktif</h3>
          <p className="text-3xl font-light text-white dark:text-emerald-400">{statsData.activeCustomers}</p>
        </div>
        <div className="bg-[#dc3545] dark:bg-red-900/40 dark:border dark:border-red-500/30 rounded-lg p-6 text-white dark:text-red-100 flex flex-col items-center justify-center shadow-sm transition-colors duration-200">
          <UserX className="w-8 h-8 mb-2 opacity-90 text-white dark:text-red-400" />
          <h3 className="text-sm font-medium mb-1 text-white dark:text-red-200">PPPoE Offline</h3>
          <p className="text-3xl font-light text-white dark:text-red-400">{statsData.offlineCustomers}</p>
        </div>
      </div>

      {/* Traffic Graph Section */}
      <div className="bg-[#0dcaf0] dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm border border-transparent dark:border-slate-800 transition-colors duration-200">
        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-transparent dark:border-slate-800">
          <div className="flex items-center text-gray-900 dark:text-cyan-400 font-bold">
            <Activity className="w-5 h-5 mr-2" />
            Grafik Traffic Internet - ether1-ISP
          </div>
          <div className="flex items-center text-sm text-gray-900 dark:text-gray-300">
            <span className="mr-2">Interface:</span>
            <select className="border-gray-300 dark:border-slate-700 rounded text-sm py-1 pl-2 pr-8 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500">
              <option>Ether1-ISP (ISP)</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-[#0dcaf0] dark:bg-slate-900 transition-colors duration-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-[#0d6efd] dark:bg-blue-500/10 dark:border dark:border-blue-500/30 text-white dark:text-blue-400 rounded p-3 text-center">
              <p className="text-xs mb-1 opacity-90">Download</p>
              <p className="font-bold text-lg">0.00 bps</p>
            </div>
            <div className="bg-[#198754] dark:bg-emerald-500/10 dark:border dark:border-emerald-500/30 text-white dark:text-emerald-400 rounded p-3 text-center">
              <p className="text-xs mb-1 opacity-90">Upload</p>
              <p className="font-bold text-lg">0.00 bps</p>
            </div>
            <div className="bg-[#0dcaf0] dark:bg-cyan-500/10 dark:border dark:border-cyan-500/30 text-white dark:text-cyan-400 rounded p-3 text-center border border-white/20">
              <p className="text-xs mb-1 opacity-90">Total</p>
              <p className="font-bold text-lg">0.00 bps</p>
            </div>
            <div className="bg-[#6c757d] dark:bg-slate-800 dark:border dark:border-slate-700 text-white dark:text-slate-300 rounded p-3 text-center">
              <p className="text-xs mb-1 opacity-90">Status</p>
              <p className="font-bold text-lg">Idle</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d6efd] dark:bg-slate-950 rounded-lg p-4 h-64 relative border border-white/10 dark:border-slate-800">
              <div className="flex items-center text-white/90 dark:text-blue-400 text-sm mb-4 font-medium">
                <Download className="w-4 h-4 mr-1.5" />
                Download Traffic (RX)
              </div>
              {/* Chart Placeholder */}
              <div className="absolute inset-x-4 bottom-4 top-12 border-l border-b border-white/20 dark:border-slate-700">
                <div className="absolute top-0 -left-12 text-[10px] text-white/60 dark:text-slate-500">1 Mbps</div>
                <div className="absolute top-1/2 -left-12 text-[10px] text-white/60 dark:text-slate-500">0.5 Mbps</div>
                <div className="absolute bottom-0 -left-12 text-[10px] text-white/60 dark:text-slate-500">0 bps</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center text-white/50 dark:text-blue-500/50 text-xs">
                    <div className="w-3 h-3 rounded-full border-2 border-white/50 dark:border-blue-500/50 mr-2"></div>
                    Download (RX)
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#198754] dark:bg-slate-950 rounded-lg p-4 h-64 relative border border-white/10 dark:border-slate-800">
              <div className="flex items-center text-white/90 dark:text-emerald-400 text-sm mb-4 font-medium">
                <Upload className="w-4 h-4 mr-1.5" />
                Upload Traffic (TX)
              </div>
              {/* Chart Placeholder */}
              <div className="absolute inset-x-4 bottom-4 top-12 border-l border-b border-white/20 dark:border-slate-700">
                <div className="absolute top-0 -left-12 text-[10px] text-white/60 dark:text-slate-500">1 Mbps</div>
                <div className="absolute top-1/2 -left-12 text-[10px] text-white/60 dark:text-slate-500">0.5 Mbps</div>
                <div className="absolute bottom-0 -left-12 text-[10px] text-white/60 dark:text-slate-500">0 bps</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center text-white/50 dark:text-emerald-500/50 text-xs">
                    <div className="w-3 h-3 rounded-full border-2 border-white/50 dark:border-emerald-500/50 mr-2"></div>
                    Upload (TX)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
