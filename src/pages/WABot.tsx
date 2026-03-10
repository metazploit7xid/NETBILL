import { useState, useEffect } from "react";
import { MessageCircle, Send, Plus, CheckCircle2, Clock, XCircle, Settings, Smartphone, RefreshCw, LogOut } from "lucide-react";

function WhatsAppSettings() {
  const [status, setStatus] = useState<any>({ status: 'disconnected' });
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/wa/status");
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error("Failed to fetch WA status", error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    if (!phone) return alert("Masukkan nomor WhatsApp");
    setLoading(true);
    try {
      await fetch("/api/wa/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      fetchStatus();
    } catch (error) {
      console.error("Failed to connect", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("Yakin ingin logout WhatsApp?")) return;
    setLoading(true);
    try {
      await fetch("/api/wa/logout", { method: "POST" });
      fetchStatus();
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-emerald-500/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-green-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Bot WA Utama</h3>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${
              status.status === 'connected' ? 'bg-green-500 dark:bg-emerald-500/20 dark:text-emerald-400' : 
              status.status === 'connecting' || status.status === 'waiting_for_pairing' ? 'bg-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-400' : 
              'bg-red-500 dark:bg-red-500/20 dark:text-red-400'
            }`}>
              {status.status === 'connected' ? 'Aktif' : 
               status.status === 'connecting' ? 'Menghubungkan...' : 
               status.status === 'waiting_for_pairing' ? 'Menunggu Pairing' : 
               'Nonaktif'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-slate-400">Provider</span>
          <span className="font-medium text-gray-900 dark:text-white">Baileys (Pairing Code)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-slate-400">Nomor WA</span>
          <span className="font-medium text-gray-900 dark:text-white">{status.userPhone?.split(':')[0] || '-'}</span>
        </div>
      </div>

      {status.status === 'connected' && (
        <div className="pt-4 flex gap-2">
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex-1 px-3 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded text-sm font-medium flex items-center justify-center transition-colors"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Logout
          </button>
          <button className="flex-1 px-3 py-2 bg-green-50 dark:bg-emerald-500/10 text-green-600 dark:text-emerald-400 hover:bg-green-100 dark:hover:bg-emerald-500/20 rounded text-sm font-medium flex items-center justify-center transition-colors">
            Test Kirim
          </button>
        </div>
      )}

      {status.status === 'waiting_for_pairing' && (
        <div className="bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 rounded-lg p-4 text-center mt-4">
          <p className="text-xs text-blue-800 dark:text-cyan-400 font-medium mb-2">Masukkan kode ini di WhatsApp Anda:</p>
          <div className="text-2xl font-mono font-bold tracking-widest text-blue-900 dark:text-cyan-300 bg-white dark:bg-slate-900 py-2 px-4 rounded-lg inline-block shadow-sm border border-blue-100 dark:border-cyan-500/30">
            {status.pairingCode}
          </div>
        </div>
      )}

      {(status.status === 'disconnected' || status.status === 'error') && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Nomor WhatsApp Bot (cth: 62812...)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="h-4 w-4 text-gray-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="6281234567890"
                className="pl-10 w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </div>
          <button
            onClick={handleConnect}
            disabled={loading || !phone}
            className="w-full px-4 py-2 bg-[#0d6efd] dark:bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading || status.status === 'connecting' ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
            ) : (
              'Minta Kode Pairing'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function WABot() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">WhatsApp Bot</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kirim notifikasi invoice & tagihan otomatis via WhatsApp</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-[#198754] dark:bg-emerald-600 text-white rounded-md hover:bg-green-700 dark:hover:bg-emerald-700 transition-colors text-sm font-medium">
          <Send className="w-4 h-4 mr-2" />
          Kirim Blast WA
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Terkirim</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-emerald-400">3</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">0</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Gagal</span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">0</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-cyan-500/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Total Notif</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-cyan-400">3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Schedules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Jadwal Pengiriman Otomatis</h2>
              <button className="text-sm text-blue-600 dark:text-cyan-400 font-medium hover:text-blue-700 dark:hover:text-cyan-300 flex items-center">
                <Plus className="w-4 h-4 mr-1" />
                Tambah Jadwal
              </button>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-slate-800">
              {/* Schedule 1 */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">Kirim Invoice Awal Bulan</h3>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 text-[10px] font-bold rounded-full">Invoice</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 flex gap-4">
                      <span>Tanggal 1 setiap bulan</span>
                      <span>Pukul 08:00</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Terakhir: 2024-03-01 08:00 <span className="text-blue-600 dark:text-cyan-400 ml-2">Berikutnya: 2024-04-01 08:00</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-0.5"></div>
                    </div>
                    <button className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">Edit</button>
                    <button className="text-xs text-green-600 dark:text-emerald-400 font-medium">Kirim</button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded p-3 text-xs text-gray-600 dark:text-slate-400 border border-gray-100 dark:border-slate-700/50">
                  <p className="font-medium mb-1 text-gray-700 dark:text-slate-300">Template Pesan:</p>
                  <p>Halo {`{nama}`}, tagihan internet Anda untuk periode {`{periode}`} sebesar {`{total}`} telah terbit. Mohon segera lakukan pembayaran sebelum {`{jatuh_tempo}`}.</p>
                </div>
              </div>

              {/* Schedule 2 */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">Reminder H-3 Jatuh Tempo</h3>
                      <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold rounded-full">Reminder</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 flex gap-4">
                      <span>H-3 sebelum jatuh tempo</span>
                      <span>Pukul 09:00</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Terakhir: 2024-03-07 09:00 <span className="text-blue-600 dark:text-cyan-400 ml-2">Berikutnya: 2024-03-11 09:00</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-0.5"></div>
                    </div>
                    <button className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">Edit</button>
                    <button className="text-xs text-green-600 dark:text-emerald-400 font-medium">Kirim</button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded p-3 text-xs text-gray-600 dark:text-slate-400 border border-gray-100 dark:border-slate-700/50">
                  <p className="font-medium mb-1 text-gray-700 dark:text-slate-300">Template Pesan:</p>
                  <p>Halo {`{nama}`}, mengingatkan tagihan internet Anda sebesar {`{total}`} akan jatuh tempo pada {`{jatuh_tempo}`}. Segera lakukan pembayaran untuk menghindari isolir.</p>
                </div>
              </div>

              {/* Schedule 3 */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">Notif Tagihan Jatuh Tempo</h3>
                      <span className="px-2 py-0.5 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-[10px] font-bold rounded-full">Jatuh Tempo</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 flex gap-4">
                      <span>H+1 setelah jatuh tempo</span>
                      <span>Pukul 08:00</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Terakhir: 2024-03-10 08:00 <span className="text-blue-600 dark:text-cyan-400 ml-2">Berikutnya: 2024-03-11 08:00</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-0.5"></div>
                    </div>
                    <button className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">Edit</button>
                    <button className="text-xs text-green-600 dark:text-emerald-400 font-medium">Kirim</button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded p-3 text-xs text-gray-600 dark:text-slate-400 border border-gray-100 dark:border-slate-700/50">
                  <p className="font-medium mb-1 text-gray-700 dark:text-slate-300">Template Pesan:</p>
                  <p>Halo {`{nama}`}, tagihan internet Anda sebesar {`{total}`} telah JATUH TEMPO. Layanan Anda akan diisolir jika tidak segera melakukan pembayaran.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notification History */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Riwayat Notifikasi</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3 font-medium">Pelanggan</th>
                    <th className="px-6 py-3 font-medium">No. HP</th>
                    <th className="px-6 py-3 font-medium">Tipe</th>
                    <th className="px-6 py-3 font-medium">Waktu Kirim</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                  <tr className="bg-white dark:bg-slate-900">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">Budi Santoso</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">ISP-001</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300">6281234567890</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 text-[10px] font-bold rounded-full">Invoice</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300">2024-03-01 08:00</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400 text-xs font-medium rounded-full">Terkirim</span>
                        <button className="text-xs text-blue-600 dark:text-cyan-400 hover:underline">Kirim Ulang</button>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-slate-900">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">Siti Rahayu</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">ISP-002</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300">6281398765432</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold rounded-full">Reminder</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300">2024-03-08 09:00</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400 text-xs font-medium rounded-full">Terkirim</span>
                        <button className="text-xs text-blue-600 dark:text-cyan-400 hover:underline">Kirim Ulang</button>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-slate-900">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">Ahmad Fauzi</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">ISP-003</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300">6285712345678</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-[10px] font-bold rounded-full">Isolir</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-slate-300">2024-02-11 08:00</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400 text-xs font-medium rounded-full">Terkirim</span>
                        <button className="text-xs text-blue-600 dark:text-cyan-400 hover:underline">Kirim Ulang</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Config & Manual Send */}
        <div className="space-y-6">
          {/* Bot Config */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Konfigurasi Bot WA</h2>
            </div>
            <div className="p-6">
              <WhatsAppSettings />
            </div>
          </div>

          {/* Supported Providers */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Provider yang Didukung</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-emerald-500/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-green-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Baileys (Built-in)</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Pairing Code, Tanpa Biaya</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-emerald-500/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-green-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Fonnte</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">API WA populer Indonesia</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-emerald-500/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-green-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Wablas</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Multi-device support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Send */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Kirim Pesan Manual</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nomor WA</label>
                <input 
                  type="text" 
                  placeholder="628xxxxxxxxx" 
                  className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Pesan</label>
                <textarea 
                  rows={4}
                  placeholder="Ketik pesan..." 
                  className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded px-3 py-2 text-sm focus:ring-cyan-500 focus:border-cyan-500"
                ></textarea>
              </div>
              <button className="w-full px-4 py-2 bg-[#198754] dark:bg-emerald-600 text-white rounded text-sm font-medium hover:bg-green-700 dark:hover:bg-emerald-700 transition-colors">
                Kirim Pesan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
