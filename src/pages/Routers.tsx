import { useState, useEffect } from "react";
import { Server, Plus, Trash2, ShieldAlert, ShieldCheck, RefreshCw } from "lucide-react";

interface Router {
  id: number;
  name: string;
  host: string;
  port: number;
  username: string;
}

interface PPPoESecret {
  ".id": string;
  name: string;
  service: string;
  profile: string;
  disabled: string;
}

export default function Routers() {
  const [routers, setRouters] = useState<Router[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRouter, setSelectedRouter] = useState<number | null>(null);
  const [pppoeSecrets, setPppoeSecrets] = useState<PPPoESecret[]>([]);
  const [loadingPppoe, setLoadingPppoe] = useState(false);

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    host: "",
    port: 8728,
    username: "",
    password: "",
  });

  useEffect(() => {
    fetchRouters();
  }, []);

  const fetchRouters = async () => {
    try {
      const res = await fetch("/api/routers");
      const data = await res.json();
      setRouters(data);
    } catch (error) {
      console.error("Failed to fetch routers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRouter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/routers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setShowAddForm(false);
      setFormData({ name: "", host: "", port: 8728, username: "", password: "" });
      fetchRouters();
    } catch (error) {
      console.error("Failed to add router", error);
    }
  };

  const handleDeleteRouter = async (id: number) => {
    if (!confirm("Are you sure you want to delete this router?")) return;
    try {
      await fetch(`/api/routers/${id}`, { method: "DELETE" });
      if (selectedRouter === id) setSelectedRouter(null);
      fetchRouters();
    } catch (error) {
      console.error("Failed to delete router", error);
    }
  };

  const fetchPppoe = async (routerId: number) => {
    setSelectedRouter(routerId);
    setLoadingPppoe(true);
    try {
      const res = await fetch(`/api/routers/${routerId}/pppoe`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPppoeSecrets(data);
      } else {
        alert("Failed to connect to MikroTik. Please check credentials and IP.");
        setPppoeSecrets([]);
      }
    } catch (error) {
      console.error("Failed to fetch PPPoE", error);
      setPppoeSecrets([]);
    } finally {
      setLoadingPppoe(false);
    }
  };

  const toggleIsolation = async (pppoeId: string, currentDisabled: string) => {
    if (!selectedRouter) return;
    const disable = currentDisabled === "false" || currentDisabled === "no";
    try {
      await fetch(`/api/routers/${selectedRouter}/pppoe/isolate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pppoeId, disable }),
      });
      fetchPppoe(selectedRouter);
    } catch (error) {
      console.error("Failed to toggle isolation", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">MikroTik Routers</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 bg-[#0d6efd] dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Router
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New MikroTik</h2>
          <form onSubmit={handleAddRouter} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Name (Location)</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">IP Address / Host</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">API Port</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">API Username</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">API Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0d6efd] dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 text-sm font-medium transition-colors"
              >
                Save Router
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Routers List */}
        <div className="bg-white dark:bg-slate-900 rounded shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden lg:col-span-1 transition-colors duration-200">
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center">
              <Server className="w-5 h-5 mr-2 text-blue-600 dark:text-cyan-400" />
              Connected Routers
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-slate-400">Loading routers...</div>
            ) : routers.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-slate-400">No routers added yet.</div>
            ) : (
              routers.map((router) => (
                <div
                  key={router.id}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedRouter === router.id ? "bg-blue-50 dark:bg-cyan-500/10" : "hover:bg-gray-50 dark:hover:bg-slate-800/50"
                  }`}
                  onClick={() => fetchPppoe(router.id)}
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-slate-200">{router.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{router.host}:{router.port}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRouter(router.id);
                    }}
                    className="p-2 text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PPPoE Secrets List */}
        <div className="bg-white dark:bg-slate-900 rounded shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden lg:col-span-2 transition-colors duration-200">
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {selectedRouter
                ? `PPPoE Secrets - ${routers.find((r) => r.id === selectedRouter)?.name}`
                : "Select a router to view PPPoE"}
            </h2>
            {selectedRouter && (
              <button
                onClick={() => fetchPppoe(selectedRouter)}
                className="p-1.5 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-500/10 rounded transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loadingPppoe ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            {!selectedRouter ? (
              <div className="p-12 text-center text-gray-500 dark:text-slate-400">
                <Server className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-600 mb-3" />
                <p>Select a router from the list to view and manage its PPPoE connections.</p>
              </div>
            ) : loadingPppoe ? (
              <div className="p-12 text-center text-gray-500 dark:text-slate-400">Connecting to MikroTik...</div>
            ) : pppoeSecrets.length === 0 ? (
              <div className="p-12 text-center text-gray-500 dark:text-slate-400">No PPPoE secrets found on this router.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800 text-xs uppercase tracking-wider text-gray-500 dark:text-slate-400">
                    <th className="p-4 font-medium">Username</th>
                    <th className="p-4 font-medium">Profile</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                  {pppoeSecrets.map((secret) => {
                    const isDisabled = secret.disabled === "true" || secret.disabled === "yes";
                    return (
                      <tr key={secret[".id"]} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-medium text-gray-900 dark:text-slate-200">{secret.name}</td>
                        <td className="p-4 text-gray-500 dark:text-slate-400 text-sm">{secret.profile}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isDisabled
                                ? "bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400"
                                : "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400"
                            }`}
                          >
                            {isDisabled ? "Isolated" : "Active"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => toggleIsolation(secret[".id"], secret.disabled)}
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              isDisabled
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                                : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20"
                            }`}
                          >
                            {isDisabled ? (
                              <>
                                <ShieldCheck className="w-4 h-4 mr-1.5" />
                                Enable
                              </>
                            ) : (
                              <>
                                <ShieldAlert className="w-4 h-4 mr-1.5" />
                                Isolate
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
