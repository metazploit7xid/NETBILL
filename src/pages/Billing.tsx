import { CreditCard, DollarSign, FileText } from "lucide-react";

export default function Billing() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Billing</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-gray-200 dark:border-slate-800 flex items-center transition-colors duration-200">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mr-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">Rp 0</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-gray-200 dark:border-slate-800 flex items-center transition-colors duration-200">
          <div className="p-3 rounded-full bg-green-100 dark:bg-emerald-500/10 text-green-600 dark:text-emerald-400 mr-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Paid Invoices</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-gray-200 dark:border-slate-800 flex items-center transition-colors duration-200">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 mr-4">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Unpaid Invoices</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 text-center rounded shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
        <FileText className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Billing Overview</h3>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Detailed billing charts and reports will be available here.</p>
      </div>
    </div>
  );
}
