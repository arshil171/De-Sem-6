import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  LayoutDashboard, Users, CalendarCheck, Tractor, ShoppingBag,
  LogOut, Search, ChevronLeft, ChevronRight, Pencil, Trash2,
  X, CheckCircle2, AlertCircle, TrendingUp, Plus, RefreshCw,
  Shield, BarChart2, Package, UserCheck, ToggleLeft, ToggleRight,
} from "lucide-react";

const BASE = import.meta.env.VITE_BASE_URL;
const api  = (path, opts = {}) => axios({ url: `${BASE}${path}`, withCredentials: true, ...opts });

/* ── shared UI atoms ──────────────────────────────────── */
const Badge = ({ label, color }) => {
  const m = {
    green:  "bg-green-900/60 text-green-300 border-green-800",
    yellow: "bg-yellow-900/60 text-yellow-300 border-yellow-800",
    blue:   "bg-blue-900/60 text-blue-300 border-blue-800",
    red:    "bg-red-950/60 text-red-400 border-red-900",
    purple: "bg-purple-900/60 text-purple-300 border-purple-800",
  };
  return <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${m[color]??m.green}`}>{label}</span>;
};

const Toast = ({ msg, type, onClose }) => (
  <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold
    ${type==="error" ? "bg-red-950 border-red-800 text-red-300" : "bg-[#162716] border-green-800 text-green-300"}`}>
    {type==="error" ? <AlertCircle className="w-4 h-4 shrink-0"/> : <CheckCircle2 className="w-4 h-4 shrink-0"/>}
    {msg}
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5"/></button>
  </div>
);

const Spinner = () => (
  <div className="flex justify-center py-20">
    <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"/>
  </div>
);

const Empty = ({ icon: Icon, text }) => (
  <div className="text-center py-20">
    <Icon className="w-14 h-14 text-[#2d4a2d] mx-auto mb-3"/>
    <p className="text-[#4b6b4b] font-semibold">{text}</p>
  </div>
);

const StatCard = ({ label, value, sub, icon: Icon, accent }) => {
  const m = {
    yellow: "text-yellow-400 bg-yellow-600/10 border-yellow-800/40",
    green:  "text-green-400 bg-green-700/10 border-green-800/40",
    blue:   "text-blue-400 bg-blue-700/10 border-blue-800/40",
    purple: "text-purple-400 bg-purple-700/10 border-purple-800/40",
  };
  return (
    <div className={`bg-[#111f11] border rounded-2xl p-5 flex items-center gap-4 ${m[accent]}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${m[accent]}`}>
        <Icon className="w-6 h-6"/>
      </div>
      <div>
        <p className="text-[#4b6b4b] text-xs uppercase tracking-widest font-bold">{label}</p>
        <p className={`text-2xl font-black ${m[accent].split(" ")[0]}`}>{value}</p>
        {sub && <p className="text-[#3a5a3a] text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
    <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-7 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-black text-xl">{title}</h2>
        <button onClick={onClose} className="text-[#4b6b4b] hover:text-white"><X className="w-5 h-5"/></button>
      </div>
      {children}
    </div>
  </div>
);

const Pages = ({ page, total, set }) =>
  total > 1 ? (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button onClick={() => set(p=>Math.max(1,p-1))} disabled={page===1}
        className="p-2 rounded-xl bg-[#111f11] border border-[#2d4a2d] text-green-400 disabled:opacity-40 hover:border-yellow-600 transition-colors">
        <ChevronLeft className="w-4 h-4"/>
      </button>
      <span className="text-[#4b6b4b] text-sm font-semibold">Page {page} / {total}</span>
      <button onClick={() => set(p=>Math.min(total,p+1))} disabled={page===total}
        className="p-2 rounded-xl bg-[#111f11] border border-[#2d4a2d] text-green-400 disabled:opacity-40 hover:border-yellow-600 transition-colors">
        <ChevronRight className="w-4 h-4"/>
      </button>
    </div>
  ) : null;

const TABS = [
  { id:"overview",  label:"Overview",  Icon:LayoutDashboard },
  { id:"users",     label:"Users",     Icon:Users },
  { id:"bookings",  label:"Bookings",  Icon:CalendarCheck },
  { id:"tractors",  label:"Tractors",  Icon:Tractor },
  { id:"products",  label:"Products",  Icon:ShoppingBag },
];

/* ══════════════════════════════════════════════════════ */
/* ROOT                                                   */
/* ══════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [tab,   setTab]   = useState("overview");
  const [toast, setToast] = useState(null);
  const [admin, setAdmin] = useState(null);

  const flash = (msg, type="success") => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    api("/admin/me").then(r => setAdmin(r.data.data.admin)).catch(()=>{});
  }, []);

  const handleLogout = async () => {
    await api("/auth/logout", { method:"post" }).catch(()=>{});
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#080f08] flex">

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="w-64 bg-[#0c190c] border-r border-[#1a2e1a] flex flex-col shrink-0 fixed h-full z-30">
        <div className="px-6 py-7 border-b border-[#1a2e1a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-600 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#080f08]"/>
            </div>
            <div>
              <p className="text-white font-black text-base leading-tight">FarmTRAC</p>
              <p className="text-yellow-600 text-[10px] font-bold uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                ${tab===id ? "bg-yellow-600 text-[#080f08] shadow-lg" : "text-[#4b6b4b] hover:bg-[#1a2e1a] hover:text-green-300"}`}>
              <Icon className="w-4 h-4 shrink-0"/>
              {label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#1a2e1a]">
          {admin && (
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-9 h-9 rounded-full bg-yellow-700 flex items-center justify-center text-[#080f08] font-black text-sm shrink-0">
                {admin.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-xs font-semibold truncate">{admin.name}</p>
                <p className="text-[#3a5a3a] text-[10px] truncate">{admin.email}</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-950/30 text-sm font-semibold transition-all">
            <LogOut className="w-4 h-4"/> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────── */}
      <main className="ml-64 flex-1 overflow-y-auto min-h-screen">
        {tab==="overview" && <OverviewTab flash={flash}/>}
        {tab==="users"    && <UsersTab    flash={flash}/>}
        {tab==="bookings" && <BookingsTab flash={flash}/>}
        {tab==="tractors" && <TractorsTab flash={flash}/>}
        {tab==="products" && <ProductsTab flash={flash}/>}
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* OVERVIEW                                               */
/* ══════════════════════════════════════════════════════ */
function OverviewTab({ flash }) {
  const [stats, setStats]       = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([api("/admin/dashboard"), api("/admin/analytics")])
      .then(([s, a]) => { setStats(s.data.data); setAnalytics(a.data.data); })
      .catch(() => flash("Failed to load dashboard","error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner/>;

  const roleCl   = { farmer:"green", driver:"yellow", admin:"blue" };
  const statusCl = { pending:"yellow", accepted:"green", completed:"blue", cancelled:"red" };

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-1">Control Centre</p>
        <h1 className="text-3xl font-black text-white">Dashboard Overview</h1>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Users"    value={stats.users.total}    sub={`${stats.users.farmers} farmers · ${stats.users.drivers} drivers`} icon={Users}        accent="green"/>
            <StatCard label="Total Bookings" value={stats.bookings.total} sub={`${stats.bookings.pending} pending`}                               icon={CalendarCheck} accent="yellow"/>
            <StatCard label="Tractors"       value={stats.tractors.total} sub={`${stats.tractors.available} available`}                           icon={Tractor}       accent="blue"/>
            <StatCard label="Products"       value={stats.products.total} sub={`${stats.products.outOfStock} out of stock`}                       icon={Package}       accent="purple"/>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[["pending","text-yellow-400"],["accepted","text-green-400"],["completed","text-blue-400"],["cancelled","text-red-400"]].map(([k,cl])=>(
              <div key={k} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-4 text-center">
                <p className="text-[#4b6b4b] text-xs uppercase tracking-widest font-bold mb-1 capitalize">{k}</p>
                <p className={`text-2xl font-black ${cl}`}>{stats.bookings[k]}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent users */}
          <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black text-lg">Recent Users</h3>
              <TrendingUp className="w-4 h-4 text-yellow-600"/>
            </div>
            <div className="space-y-3">
              {analytics.recentUsers.map(u => (
                <div key={u._id} className="flex items-center gap-3 p-3 bg-[#0c190c] rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-yellow-700 flex items-center justify-center text-[#080f08] font-black text-sm shrink-0">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-white text-sm font-semibold truncate">{u.name}</p>
                    <p className="text-[#3a5a3a] text-xs truncate">{u.email}</p>
                  </div>
                  <Badge label={u.role} color={roleCl[u.role]??"green"}/>
                </div>
              ))}
            </div>
          </div>

          {/* Recent bookings */}
          <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black text-lg">Recent Bookings</h3>
              <CalendarCheck className="w-4 h-4 text-yellow-600"/>
            </div>
            <div className="space-y-3">
              {analytics.recentBookings.map(b => (
                <div key={b._id} className="flex items-center gap-3 p-3 bg-[#0c190c] rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-[#1a2e1a] border border-[#2d4a2d] flex items-center justify-center shrink-0">
                    <Tractor className="w-4 h-4 text-yellow-500"/>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-white text-sm font-semibold truncate">{b.tractorId?.tractorName??"Tractor"}</p>
                    <p className="text-[#3a5a3a] text-xs truncate">{b.farmerId?.name} · {b.serviceType}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-yellow-400 text-sm font-black">₹{b.totalPrice}</p>
                    <Badge label={b.status} color={statusCl[b.status]??"green"}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monthly bar chart */}
      {analytics?.monthlyData?.length > 0 && (
        <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">
          <h3 className="text-white font-black text-lg mb-5 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-yellow-600"/> Monthly Bookings — last 6 months
          </h3>
          <div className="flex items-end gap-3 h-36">
            {analytics.monthlyData.map((m,i) => {
              const max = Math.max(...analytics.monthlyData.map(x=>x.bookings), 1);
              const h   = Math.round((m.bookings/max)*100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <p className="text-yellow-400 text-xs font-bold">{m.bookings||""}</p>
                  <div className="w-full bg-yellow-600 rounded-t-lg transition-all" style={{height:`${Math.max(h,4)}%`}}/>
                  <p className="text-[#4b6b4b] text-[10px] font-bold">{m.monthName}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* USERS                                                  */
/* ══════════════════════════════════════════════════════ */
function UsersTab({ flash }) {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [role, setRole]           = useState("");
  const [page, setPage]           = useState(1);
  const [total, setTotal]         = useState(1);
  const [roleModal, setRoleModal] = useState(null);
  const [newRole, setNewRole]     = useState("");
  const [busy, setBusy]           = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit:10 });
      if (search) p.set("search",search);
      if (role)   p.set("role",role);
      const r = await api(`/admin/users?${p}`);
      setUsers(r.data.data.users);
      setTotal(r.data.pagination.totalPages);
    } catch { flash("Failed to load users","error"); }
    finally { setLoading(false); }
  }, [search, role, page]);

  useEffect(()=>{ setPage(1); },[search,role]);
  useEffect(()=>{ fetch(); },[fetch]);

  const doDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    setBusy(id+"d");
    try {
      await api(`/admin/users/${id}`,{method:"delete"});
      setUsers(u=>u.filter(x=>x._id!==id));
      flash("User deleted");
    } catch(e){ flash(e.response?.data?.message||"Cannot delete","error"); }
    finally { setBusy(""); }
  };

  const doRoleChange = async (e) => {
    e.preventDefault();
    setBusy(roleModal._id+"r");
    try {
      await api(`/admin/users/${roleModal._id}/role`,{method:"patch",data:{role:newRole}});
      setUsers(u=>u.map(x=>x._id===roleModal._id?{...x,role:newRole}:x));
      flash(`Role → ${newRole}`);
      setRoleModal(null);
    } catch(e){ flash(e.response?.data?.message||"Cannot change role","error"); }
    finally { setBusy(""); }
  };

  const roleCl = { farmer:"green", driver:"yellow", admin:"blue" };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-1">User Management</p>
          <h1 className="text-3xl font-black text-white">All Users</h1>
        </div>
        <button onClick={fetch}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2e1a] border border-[#2d4a2d] text-green-400 text-sm rounded-xl hover:bg-[#243a24] transition-colors">
          <RefreshCw className="w-4 h-4"/> Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-3 bg-[#111f11] border-2 border-[#2d4a2d] focus-within:border-yellow-600 rounded-xl px-4 py-3 transition-colors">
          <Search className="w-4 h-4 text-[#4b6b4b] shrink-0"/>
          <input type="text" placeholder="Search by name, email or phone…" value={search}
            onChange={e=>setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"/>
        </div>
        <select value={role} onChange={e=>setRole(e.target.value)}
          className="bg-[#111f11] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none">
          <option value="">All Roles</option>
          <option value="farmer">Farmer</option>
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? <Spinner/> : users.length===0 ? <Empty icon={Users} text="No users found"/> : (
        <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1f3a1f]">
                  {["User","Email","Phone","Role","Joined","Actions"].map(h=>(
                    <th key={h} className="px-5 py-4 text-left text-[#4b6b4b] text-xs font-bold uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u,i)=>(
                  <tr key={u._id} className={`border-b border-[#1a2e1a] hover:bg-[#0c190c] transition-colors ${i%2?"bg-[#0d1a0d]/30":""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-700 flex items-center justify-center text-[#080f08] text-xs font-black shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#4b6b4b]">{u.email}</td>
                    <td className="px-5 py-4 text-[#4b6b4b]">{u.phone}</td>
                    <td className="px-5 py-4"><Badge label={u.role} color={roleCl[u.role]??"green"}/></td>
                    <td className="px-5 py-4 text-[#4b6b4b] text-xs">
                      {new Date(u.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>{setRoleModal(u);setNewRole(u.role);}} title="Change Role"
                          className="p-1.5 rounded-lg bg-[#1a2e1a] hover:bg-yellow-900/30 border border-[#2d4a2d] text-yellow-400 transition-colors">
                          <UserCheck className="w-3.5 h-3.5"/>
                        </button>
                        <button onClick={()=>doDelete(u._id)} disabled={busy===u._id+"d"} title="Delete"
                          className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-950/50 border border-red-900/40 text-red-400 transition-colors disabled:opacity-40">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pages page={page} total={total} set={setPage}/>

      {roleModal && (
        <Modal title="Change User Role" onClose={()=>setRoleModal(null)}>
          <div className="flex items-center gap-3 p-4 bg-[#0c190c] rounded-xl mb-5">
            <div className="w-10 h-10 rounded-full bg-yellow-700 flex items-center justify-center text-[#080f08] font-black">
              {roleModal.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold">{roleModal.name}</p>
              <p className="text-[#3a5a3a] text-xs">{roleModal.email}</p>
            </div>
            <Badge label={roleModal.role} color={roleCl[roleModal.role]??"green"}/>
          </div>
          <form onSubmit={doRoleChange} className="space-y-3">
            {["farmer","driver","admin"].map(r=>(
              <label key={r} className="cursor-pointer block">
                <input type="radio" name="role" value={r} checked={newRole===r} onChange={()=>setNewRole(r)} className="sr-only"/>
                <div className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all
                  ${newRole===r ? "border-yellow-600 bg-[#1a1200] text-yellow-400" : "border-[#2d4a2d] text-green-500 hover:border-yellow-800"}`}>
                  {r}
                </div>
              </label>
            ))}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={()=>setRoleModal(null)}
                className="flex-1 py-3 rounded-xl border border-[#2d4a2d] text-green-400 text-sm font-semibold hover:bg-[#1a2e1a] transition-colors">Cancel</button>
              <button type="submit" disabled={!!busy}
                className="flex-1 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-[#080f08] text-sm font-extrabold transition-colors disabled:opacity-50">
                {busy ? "Saving…" : "Update Role"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* BOOKINGS                                               */
/* ══════════════════════════════════════════════════════ */
function BookingsTab({ flash }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState("");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(1);
  const [busy, setBusy]         = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({page,limit:10});
      if (status) p.set("status",status);
      if (search) p.set("search",search);
      const r = await api(`/admin/bookings?${p}`);
      setBookings(r.data.data.bookings);
      setTotal(r.data.pagination.totalPages);
    } catch { flash("Failed to load bookings","error"); }
    finally { setLoading(false); }
  }, [status,search,page]);

  useEffect(()=>{setPage(1);},[status,search]);
  useEffect(()=>{fetch();},[fetch]);

  const updateStatus = async (id, ns) => {
    setBusy(id+ns);
    try {
      const r = await api(`/admin/bookings/${id}/status`,{method:"patch",data:{status:ns}});
      setBookings(b=>b.map(x=>x._id===id?r.data.data.booking:x));
      flash(`Booking → ${ns}`);
    } catch(e){ flash(e.response?.data?.message||"Cannot update","error"); }
    finally { setBusy(""); }
  };

  const sCls = {
    pending:  "bg-yellow-900/60 text-yellow-300 border-yellow-800",
    accepted: "bg-green-900/60 text-green-300 border-green-800",
    completed:"bg-blue-900/60 text-blue-300 border-blue-800",
    cancelled:"bg-red-950/60 text-red-400 border-red-900",
  };
  const next = { pending:["accepted","cancelled"], accepted:["completed","cancelled"], completed:[], cancelled:[] };

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-1">Booking Management</p>
        <h1 className="text-3xl font-black text-white">All Bookings</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-3 bg-[#111f11] border-2 border-[#2d4a2d] focus-within:border-yellow-600 rounded-xl px-4 py-3 transition-colors">
          <Search className="w-4 h-4 text-[#4b6b4b] shrink-0"/>
          <input type="text" placeholder="Search by location or service…" value={search}
            onChange={e=>setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"/>
        </div>
        <select value={status} onChange={e=>setStatus(e.target.value)}
          className="bg-[#111f11] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none">
          <option value="">All Statuses</option>
          {["pending","accepted","completed","cancelled"].map(s=>(
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      {loading ? <Spinner/> : bookings.length===0 ? <Empty icon={CalendarCheck} text="No bookings found"/> : (
        <div className="space-y-4">
          {bookings.map(b=>(
            <div key={b._id} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-[#1a2e1a] border border-[#2d4a2d] rounded-xl flex items-center justify-center shrink-0">
                    <Tractor className="w-5 h-5 text-yellow-500"/>
                  </div>
                  <div>
                    <p className="text-white font-bold">{b.tractorId?.tractorName??"Tractor"}</p>
                    <p className="text-[#4b6b4b] text-xs">{b.serviceType} · {b.farmLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-yellow-400 text-xl font-black">₹{b.totalPrice}</p>
                    <p className="text-[#4b6b4b] text-xs">{b.hours}h × ₹{b.pricePerHour}/hr</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${sCls[b.status]}`}>{b.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#0c190c] rounded-xl mb-4">
                <div>
                  <p className="text-[#4b6b4b] text-xs uppercase font-bold">Farmer</p>
                  <p className="text-green-300 font-semibold text-sm">{b.farmerId?.name}</p>
                  <p className="text-[#3a5a3a] text-xs">{b.farmerId?.phone}</p>
                </div>
                <div>
                  <p className="text-[#4b6b4b] text-xs uppercase font-bold">Driver</p>
                  <p className="text-green-300 font-semibold text-sm">{b.driverId?.name}</p>
                  <p className="text-[#3a5a3a] text-xs">{b.driverId?.phone}</p>
                </div>
                <div>
                  <p className="text-[#4b6b4b] text-xs uppercase font-bold">Booked On</p>
                  <p className="text-green-300 font-semibold text-sm">
                    {new Date(b.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                  </p>
                </div>
              </div>

              {next[b.status]?.length>0 && (
                <div className="flex flex-wrap gap-2">
                  {next[b.status].map(ns=>(
                    <button key={ns} onClick={()=>updateStatus(b._id,ns)} disabled={busy===b._id+ns}
                      className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors disabled:opacity-50
                        ${ns==="accepted"  ? "bg-green-700 hover:bg-green-600 text-white" :
                          ns==="completed" ? "bg-yellow-600 hover:bg-yellow-500 text-[#080f08]" :
                                             "bg-red-900 hover:bg-red-800 text-white"}`}>
                      {busy===b._id+ns
                        ? <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                        : `Mark ${ns}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Pages page={page} total={total} set={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* TRACTORS                                               */
/* ══════════════════════════════════════════════════════ */
function TractorsTab({ flash }) {
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [typeF, setTypeF]       = useState("");
  const [availF, setAvailF]     = useState("");
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(1);
  const [busy, setBusy]         = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({page,limit:10});
      if (search) p.set("search",search);
      if (typeF)  p.set("tractorType",typeF);
      if (availF) p.set("availability",availF);
      const r = await api(`/admin/tractors?${p}`);
      setTractors(r.data.data.tractors);
      setTotal(r.data.pagination.totalPages);
    } catch { flash("Failed to load tractors","error"); }
    finally { setLoading(false); }
  }, [search,typeF,availF,page]);

  useEffect(()=>{setPage(1);},[search,typeF,availF]);
  useEffect(()=>{fetch();},[fetch]);

  const toggle = async (t) => {
    setBusy(t._id);
    try {
      const r = await api(`/admin/tractors/${t._id}/availability`,{method:"patch",data:{availability:!t.availability}});
      setTractors(ts=>ts.map(x=>x._id===t._id?r.data.data.tractor:x));
      flash(`Tractor → ${!t.availability?"available":"unavailable"}`);
    } catch(e){ flash(e.response?.data?.message||"Cannot update","error"); }
    finally { setBusy(""); }
  };

  const tyCl = {
    Ploughing: "bg-yellow-900/50 text-yellow-300",
    Harvesting:"bg-green-900/50 text-green-300",
    Seeding:   "bg-blue-900/50 text-blue-300",
    Spraying:  "bg-purple-900/50 text-purple-300",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-1">Fleet Management</p>
        <h1 className="text-3xl font-black text-white">All Tractors</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-3 bg-[#111f11] border-2 border-[#2d4a2d] focus-within:border-yellow-600 rounded-xl px-4 py-3 transition-colors">
          <Search className="w-4 h-4 text-[#4b6b4b] shrink-0"/>
          <input type="text" placeholder="Search by name or location…" value={search}
            onChange={e=>setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"/>
        </div>
        <select value={typeF} onChange={e=>setTypeF(e.target.value)}
          className="bg-[#111f11] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none">
          <option value="">All Types</option>
          {["Ploughing","Harvesting","Seeding","Spraying"].map(t=>(<option key={t} value={t}>{t}</option>))}
        </select>
        <select value={availF} onChange={e=>setAvailF(e.target.value)}
          className="bg-[#111f11] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none">
          <option value="">All Availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </div>

      {loading ? <Spinner/> : tractors.length===0 ? <Empty icon={Tractor} text="No tractors found"/> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tractors.map(t=>(
            <div key={t._id} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 bg-[#1a2e1a] border border-[#2d4a2d] rounded-xl flex items-center justify-center">
                  <Tractor className="w-5 h-5 text-yellow-500"/>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tyCl[t.tractorType]??""}`}>{t.tractorType}</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-base">{t.tractorName}</h3>
                <p className="text-[#4b6b4b] text-xs mt-1">📍 {t.location}</p>
                <p className="text-[#4b6b4b] text-xs">👤 {t.driverId?.name}</p>
                <p className="text-yellow-400 font-black text-xl mt-2">
                  ₹{t.pricePerHour}<span className="text-[#4b6b4b] text-xs font-normal">/hr</span>
                </p>
              </div>
              <button onClick={()=>toggle(t)} disabled={busy===t._id}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all disabled:opacity-50
                  ${t.availability ? "bg-green-900/20 border-green-800 text-green-400" : "bg-red-950/20 border-red-900 text-red-400"}`}>
                <span className="text-sm font-semibold">{t.availability?"● Available":"○ Unavailable"}</span>
                {busy===t._id
                  ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                  : t.availability ? <ToggleRight className="w-5 h-5"/> : <ToggleLeft className="w-5 h-5"/>
                }
              </button>
            </div>
          ))}
        </div>
      )}
      <Pages page={page} total={total} set={setPage}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/* PRODUCTS                                               */
/* ══════════════════════════════════════════════════════ */
const BLANK = { name:"", description:"", price:"", category:"", image:"", stock:"" };

function ProductsTab({ flash }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [catF, setCatF]         = useState("");
  const [stockF, setStockF]     = useState("");
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(1);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(BLANK);
  const [saving, setSaving]     = useState(false);
  const [busy, setBusy]         = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({page,limit:10});
      if (search) p.set("search",search);
      if (catF)   p.set("category",catF);
      if (stockF) p.set("stockStatus",stockF);
      const r = await api(`/admin/products?${p}`);
      setProducts(r.data.data.products);
      setTotal(r.data.pagination.totalPages);
    } catch { flash("Failed to load products","error"); }
    finally { setLoading(false); }
  }, [search,catF,stockF,page]);

  useEffect(()=>{setPage(1);},[search,catF,stockF]);
  useEffect(()=>{fetch();},[fetch]);

  const openCreate = () => { setForm(BLANK); setModal("create"); };
  const openEdit   = p  => { setForm({name:p.name,description:p.description??"",price:p.price,category:p.category,image:p.image??"",stock:p.stock}); setModal(p); };

  const doSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {...form, price:Number(form.price), stock:Number(form.stock)};
    try {
      if (modal==="create") {
        const r = await api("/admin/products",{method:"post",data:payload});
        setProducts(ps=>[r.data.data.product,...ps]);
        flash("Product created");
      } else {
        const r = await api(`/admin/products/${modal._id}`,{method:"put",data:payload});
        setProducts(ps=>ps.map(p=>p._id===modal._id?r.data.data.product:p));
        flash("Product updated");
      }
      setModal(null);
    } catch(e){ flash(e.response?.data?.message||"Failed to save","error"); }
    finally { setSaving(false); }
  };

  const doDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setBusy(id);
    try {
      await api(`/admin/products/${id}`,{method:"delete"});
      setProducts(ps=>ps.filter(p=>p._id!==id));
      flash("Product deleted");
    } catch(e){ flash(e.response?.data?.message||"Cannot delete","error"); }
    finally { setBusy(""); }
  };

  const catCl = {
    seeds:     "bg-green-900/50 text-green-300",
    fertilizer:"bg-yellow-900/50 text-yellow-300",
    tools:     "bg-blue-900/50 text-blue-300",
    equipment: "bg-purple-900/50 text-purple-300",
  };

  const fields = [
    {label:"Product Name", key:"name",        type:"text",   ph:"e.g. Hybrid Seeds 1kg"},
    {label:"Description",  key:"description", type:"text",   ph:"Short description…"},
    {label:"Price (₹)",    key:"price",       type:"number", ph:"e.g. 250"},
    {label:"Stock (units)",key:"stock",       type:"number", ph:"e.g. 100"},
    {label:"Image URL",    key:"image",       type:"text",   ph:"https://…"},
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-1">Product Catalogue</p>
          <h1 className="text-3xl font-black text-white">All Products</h1>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-yellow-600 hover:bg-yellow-500 text-[#080f08] font-bold text-sm rounded-xl transition-colors">
          <Plus className="w-4 h-4"/> Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-3 bg-[#111f11] border-2 border-[#2d4a2d] focus-within:border-yellow-600 rounded-xl px-4 py-3 transition-colors">
          <Search className="w-4 h-4 text-[#4b6b4b] shrink-0"/>
          <input type="text" placeholder="Search products…" value={search}
            onChange={e=>setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"/>
        </div>
        <select value={catF} onChange={e=>setCatF(e.target.value)}
          className="bg-[#111f11] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none">
          <option value="">All Categories</option>
          {["seeds","fertilizer","tools","equipment"].map(c=>(<option key={c} value={c} className="capitalize">{c}</option>))}
        </select>
        <select value={stockF} onChange={e=>setStockF(e.target.value)}
          className="bg-[#111f11] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none">
          <option value="">All Stock</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>
      </div>

      {loading ? <Spinner/> : products.length===0 ? <Empty icon={ShoppingBag} text="No products found"/> : (
        <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1f3a1f]">
                  {["Product","Category","Price","Stock","Actions"].map(h=>(
                    <th key={h} className="px-5 py-4 text-left text-[#4b6b4b] text-xs font-bold uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p,i)=>(
                  <tr key={p._id} className={`border-b border-[#1a2e1a] hover:bg-[#0c190c] transition-colors ${i%2?"bg-[#0d1a0d]/30":""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#1a2e1a] border border-[#2d4a2d] rounded-xl flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-yellow-500"/>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{p.name}</p>
                          {p.description && <p className="text-[#3a5a3a] text-xs truncate max-w-[150px]">{p.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${catCl[p.category]??"bg-green-900/50 text-green-300"}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-yellow-400 font-black">₹{p.price}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold ${p.stock===0?"text-red-400":"text-green-400"}`}>
                        {p.stock===0?"Out of stock":`${p.stock} units`}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>openEdit(p)}
                          className="p-1.5 rounded-lg bg-[#1a2e1a] hover:bg-yellow-900/30 border border-[#2d4a2d] text-yellow-400 transition-colors">
                          <Pencil className="w-3.5 h-3.5"/>
                        </button>
                        <button onClick={()=>doDelete(p._id)} disabled={busy===p._id}
                          className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-950/50 border border-red-900/40 text-red-400 transition-colors disabled:opacity-40">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pages page={page} total={total} set={setPage}/>

      {modal!==null && (
        <Modal title={modal==="create"?"Add Product":"Edit Product"} onClose={()=>setModal(null)}>
          <form onSubmit={doSave} className="space-y-4">
            {fields.map(({label,key,type,ph})=>(
              <div key={key}>
                <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-1.5 block">{label}</label>
                <input type={type} placeholder={ph} value={form[key]}
                  onChange={e=>setForm({...form,[key]:e.target.value})}
                  className="w-full bg-[#0c190c] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none transition-colors placeholder-[#3a5a3a]"/>
              </div>
            ))}
            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-1.5 block">Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                className="w-full bg-[#0c190c] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none transition-colors">
                <option value="">Select category</option>
                {["seeds","fertilizer","tools","equipment"].map(c=>(<option key={c} value={c} className="capitalize">{c}</option>))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={()=>setModal(null)}
                className="flex-1 py-3 rounded-xl border border-[#2d4a2d] text-green-400 text-sm font-semibold hover:bg-[#1a2e1a] transition-colors">Cancel</button>
              <button type="submit" disabled={saving}
                className="flex-1 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-[#080f08] text-sm font-extrabold transition-colors disabled:opacity-50">
                {saving?"Saving…":modal==="create"?"Create Product":"Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}