import { Users, MapPin, CheckCircle } from "lucide-react";

export default function Collector() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kolektor</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
          <div className="flex items-center text-gray-500 dark:text-slate-400 mb-2">
            <Users className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Total Kolektor</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
          <div className="flex items-center text-gray-500 dark:text-slate-400 mb-2">
            <MapPin className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Area Penagihan Aktif</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-cyan-400">0</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
          <div className="flex items-center text-gray-500 dark:text-slate-400 mb-2">
            <CheckCircle className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Tagihan Tertagih Hari Ini</h3>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-emerald-400">0</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors duration-200">
        <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 border-b border-gray-200 dark:border-slate-800">
          <h3 className="font-medium text-gray-700 dark:text-white">Daftar Kolektor</h3>
        </div>
        <div className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-slate-400">Belum ada data kolektor.</p>
        </div>
      </div>
    </div>
  );
}
