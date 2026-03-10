import { useState, useEffect } from "react";
import { Plus, Search, Trash2, User, Package, Download, Upload, Trash, Menu } from "lucide-react";
import Plans from "./Plans";

interface Customer {
  id: number;
  name: string;
  phone: string;
  pppoe_user: string;
  status: string;
}

export default function Customers() {
  const [activeTab, setActiveTab] = useState("pelanggan");
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pppoe_user: "",
    pppoe_password: ""
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setShowAddForm(false);
      setFormData({ name: "", phone: "", pppoe_user: "", pppoe_password: "" });
      fetchCustomers();
    } catch (error) {
      console.error("Failed to add customer", error);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await fetch(`/api/customers/${id}`, { method: "DELETE" });
      fetchCustomers();
    } catch (error) {
      console.error("Failed to delete customer", error);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.pppoe_user && c.pppoe_user.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pelanggan & Paket</h1>
        
        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mt-2">
          <button 
            onClick={() => setActiveTab("pelanggan")}
            className={`pb-2 text-sm font-medium flex items-center ${activeTab === "pelanggan" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300"}`}
          >
            <User className="w-4 h-4 mr-2" />
            Pelanggan
          </button>
          <button 
            onClick={() => setActiveTab("paket")}
            className={`pb-2 text-sm font-medium flex items-center ${activeTab === "paket" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300"}`}
          >
            <Package className="w-4 h-4 mr-2" />
            Paket
          </button>
        </div>
      </div>

      {activeTab === "pelanggan" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Kelola Pelanggan
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center px-3 py-1.5 bg-[#0d6efd] dark:bg-blue-600 text-white rounded text-sm hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Tambah
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-[#198754] text-[#198754] dark:text-emerald-400 dark:border-emerald-500 rounded text-sm hover:bg-green-50 dark:hover:bg-emerald-900/30 transition-colors">
                <Download className="w-4 h-4 mr-1.5" />
                Backup JSON
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-[#198754] text-[#198754] dark:text-emerald-400 dark:border-emerald-500 rounded text-sm hover:bg-green-50 dark:hover:bg-emerald-900/30 transition-colors">
                <Download className="w-4 h-4 mr-1.5" />
                Backup XLSX
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-[#ffc107] text-[#ffc107] dark:text-amber-400 dark:border-amber-500 rounded text-sm hover:bg-yellow-50 dark:hover:bg-amber-900/30 transition-colors">
                <Upload className="w-4 h-4 mr-1.5" />
                Restore
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded p-4 shadow-sm transition-colors duration-200">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Total Pelanggan</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{customers.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded p-4 shadow-sm transition-colors duration-200">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Sudah Bayar</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded p-4 shadow-sm transition-colors duration-200">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Belum Bayar</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded p-4 shadow-sm transition-colors duration-200">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Isolir</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded p-4 shadow-sm transition-colors duration-200">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Non Tagihan</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{customers.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded p-4 shadow-sm transition-colors duration-200">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Pelanggan Aktif</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{customers.filter(c => c.status !== 'isolated').length}</p>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tambah Pelanggan Baru</h2>
              <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nama</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Telepon (WhatsApp)</label>
                  <input
                    type="text"
                    required
                    placeholder="6281234567890"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">PPPoE Username</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    value={formData.pppoe_user}
                    onChange={(e) => setFormData({ ...formData, pppoe_user: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">PPPoE Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    value={formData.pppoe_password}
                    onChange={(e) => setFormData({ ...formData, pppoe_password: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0d6efd] dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 text-sm font-medium transition-colors"
                  >
                    Simpan Pelanggan
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors duration-200">
            <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center">
              <span className="font-medium text-gray-700 dark:text-slate-300 flex items-center text-sm">
                <Menu className="w-4 h-4 mr-2" />
                Daftar Pelanggan
              </span>
            </div>
            
            <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-cyan-600 focus:ring-cyan-500" />
                  Pilih Semua
                </label>
                <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                  Tampilkan 
                  <select className="mx-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded py-1 px-2 text-sm focus:ring-cyan-500 focus:border-cyan-500">
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                  entri
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button className="hidden sm:flex items-center px-3 py-1.5 bg-[#dc3545] dark:bg-red-600 text-white rounded text-sm hover:bg-red-600 dark:hover:bg-red-700 transition-colors">
                  <Trash className="w-4 h-4 mr-1.5" />
                  Hapus Terpilih
                </button>
                <div className="flex items-center text-sm w-full sm:w-auto">
                  <span className="mr-2 text-gray-600 dark:text-slate-400">Cari:</span>
                  <input
                    type="text"
                    className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-1 text-sm focus:ring-cyan-500 focus:border-cyan-500 w-full sm:w-48"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500 dark:text-slate-400">Loading customers...</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-sm">
                  <thead className="bg-white dark:bg-slate-900">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 dark:text-slate-300 border-b dark:border-slate-800"></th>
                      <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 dark:text-slate-300 border-b dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50">Nama ↕</th>
                      <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 dark:text-slate-300 border-b dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50">Username ↕</th>
                      <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 dark:text-slate-300 border-b dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50">Telepon ↕</th>
                      <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 dark:text-slate-300 border-b dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50">PPPoE Username ↕</th>
                      <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 dark:text-slate-300 border-b dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50">Paket ↕</th>
                      <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 dark:text-slate-300 border-b dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50">PPPoE Profile ↕</th>
                      <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 dark:text-slate-300 border-b dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50">Auto Suspension ↕</th>
                      <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 dark:text-slate-300 border-b dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50">Status Pelanggan ↕</th>
                      <th scope="col" className="px-4 py-3 text-left font-bold text-gray-700 dark:text-slate-300 border-b dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50">Status Pembayaran ↕</th>
                      <th scope="col" className="px-4 py-3 text-center font-bold text-gray-700 dark:text-slate-300 border-b dark:border-slate-800">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="px-4 py-8 text-center text-gray-500 dark:text-slate-400">Tidak ada data pelanggan</td>
                      </tr>
                    ) : (
                      filteredCustomers.map((customer) => {
                        const username = customer.name.toLowerCase().replace(/\s+/g, '');
                        return (
                          <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <input type="checkbox" className="rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-cyan-600 focus:ring-cyan-500" />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-blue-600 dark:text-cyan-400">
                              {customer.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-slate-300">
                              {username}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-blue-600 dark:text-cyan-400">
                              {customer.phone}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-slate-300">
                              {customer.pppoe_user || '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-slate-300">
                              Paket Internet Dasar
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 bg-[#0dcaf0] dark:bg-cyan-500/20 text-white dark:text-cyan-400 text-[10px] font-bold rounded">
                                default
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 bg-[#198754] dark:bg-emerald-500/20 text-white dark:text-emerald-400 text-[10px] font-bold rounded">
                                Ya
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 bg-[#198754] dark:bg-emerald-500/20 text-white dark:text-emerald-400 text-[10px] font-bold rounded">
                                Aktif
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 bg-[#0dcaf0] dark:bg-cyan-500/20 text-white dark:text-cyan-400 text-[10px] font-bold rounded">
                                Belum Ada Tagihan
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <button 
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="p-1.5 bg-[#0d6efd] dark:bg-blue-500/20 text-white dark:text-blue-400 rounded hover:bg-blue-600 dark:hover:bg-blue-500/40 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "paket" && (
        <Plans />
      )}
    </div>
  );
}
