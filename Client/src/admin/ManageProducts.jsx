import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  ShoppingBag, Package, Plus, Pencil, Trash2, Search,
  X, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight,
  Shield, LogOut, ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

const BASE = import.meta.env.VITE_BASE_URL;
const api  = (path, opts={}) => axios({ url:`${BASE}${path}`, withCredentials:true, ...opts });

/* ── atoms ───────────────────────────────────────────── */
const Toast = ({ msg, type, onClose }) => (
  <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold
    ${type==="error"?"bg-red-950 border-red-800 text-red-300":"bg-[#162716] border-green-800 text-green-300"}`}>
    {type==="error"?<AlertCircle className="w-4 h-4 shrink-0"/>:<CheckCircle2 className="w-4 h-4 shrink-0"/>}
    {msg}
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5"/></button>
  </div>
);

const Spinner = () => (
  <div className="flex justify-center py-20">
    <div className="w-10 h-10 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"/>
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
    <div className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-black text-xl">{title}</h2>
        <button onClick={onClose} className="text-[#4b6b4b] hover:text-white transition-colors"><X className="w-5 h-5"/></button>
      </div>
      {children}
    </div>
  </div>
);

const BLANK = { name:"", description:"", price:"", category:"", image:"", stock:"" };

const catColors = {
  seeds:     "bg-green-900/50 text-green-300 border-green-800",
  fertilizer:"bg-yellow-900/50 text-yellow-300 border-yellow-800",
  tools:     "bg-blue-900/50 text-blue-300 border-blue-800",
  equipment: "bg-purple-900/50 text-purple-300 border-purple-800",
};

const CATS = ["seeds","fertilizer","tools","equipment"];

/* ══════════════════════════════════════════════════════ */
export default function ManageProducts() {
  const navigate = useNavigate();

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [catF, setCatF]           = useState("");
  const [stockF, setStockF]       = useState("");
  const [page, setPage]           = useState(1);
  const [totalPages, setTotal]    = useState(1);
  const [totalCount, setCount]    = useState(0);
  const [modal, setModal]         = useState(null); // null | "create" | product-obj
  const [form, setForm]           = useState(BLANK);
  const [formErrors, setFE]       = useState({});
  const [saving, setSaving]       = useState(false);
  const [busy, setBusy]           = useState("");
  const [toast, setToast]         = useState(null);
  const [preview, setPreview]     = useState(null); // product detail modal

  const flash = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null), 3500);
  };

  /* ── fetch ──────────────────────────────────────────── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit:12 });
      if (search) p.set("search", search);
      if (catF)   p.set("category", catF);
      if (stockF) p.set("stockStatus", stockF);
      const r = await api(`/admin/products?${p}`);
      setProducts(r.data.data.products);
      setTotal(r.data.pagination.totalPages);
      setCount(r.data.pagination.totalProducts);
    } catch { flash("Failed to load products","error"); }
    finally { setLoading(false); }
  }, [search, catF, stockF, page]);

  useEffect(()=>{ setPage(1); },[search,catF,stockF]);
  useEffect(()=>{ fetchProducts(); },[fetchProducts]);

  /* ── validate ───────────────────────────────────────── */
  const validate = () => {
    const e={};
    if (!form.name.trim())            e.name     = "Required";
    if (!form.price || form.price<=0) e.price    = "Must be > 0";
    if (!form.category)               e.category = "Required";
    if (form.stock==="" || form.stock<0) e.stock = "Must be ≥ 0";
    setFE(e);
    return Object.keys(e).length===0;
  };

  /* ── save (create / update) ─────────────────────────── */
  const doSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form, price:Number(form.price), stock:Number(form.stock) };
    try {
      if (modal==="create") {
        const r = await api("/admin/products",{method:"post",data:payload});
        setProducts(ps=>[r.data.data.product,...ps]);
        flash("Product created successfully");
      } else {
        const r = await api(`/admin/products/${modal._id}`,{method:"put",data:payload});
        setProducts(ps=>ps.map(p=>p._id===modal._id?r.data.data.product:p));
        flash("Product updated successfully");
      }
      setModal(null);
    } catch(err){ flash(err.response?.data?.message||"Failed to save","error"); }
    finally { setSaving(false); }
  };

  /* ── delete ─────────────────────────────────────────── */
  const doDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setBusy(id);
    try {
      await api(`/admin/products/${id}`,{method:"delete"});
      setProducts(ps=>ps.filter(p=>p._id!==id));
      setCount(c=>c-1);
      flash("Product deleted");
    } catch(err){ flash(err.response?.data?.message||"Cannot delete","error"); }
    finally { setBusy(""); }
  };

  /* ── open modals ────────────────────────────────────── */
  const openCreate = () => { setForm(BLANK); setFE({}); setModal("create"); };
  const openEdit   = p  => {
    setForm({ name:p.name, description:p.description??"", price:p.price,
              category:p.category, image:p.image??"", stock:p.stock });
    setFE({});
    setModal(p);
  };

  const handleLogout = async () => {
    await api("/auth/logout",{method:"post"}).catch(()=>{});
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href="/login";
  };

  /* ── stats from loaded products ─────────────────────── */
  const inStock    = products.filter(p=>p.stock>0).length;
  const outOfStock = products.filter(p=>p.stock===0).length;

  const formFields = [
    {label:"Product Name *", key:"name",        type:"text",   ph:"e.g. Hybrid Seeds 1kg"},
    {label:"Description",    key:"description", type:"text",   ph:"Short description (optional)"},
    {label:"Price (₹) *",    key:"price",       type:"number", ph:"e.g. 250"},
    {label:"Stock (units) *",key:"stock",       type:"number", ph:"e.g. 100"},
    {label:"Image URL",      key:"image",       type:"text",   ph:"https://example.com/image.jpg"},
  ];

  return (
    <div className="min-h-screen bg-[#080f08] flex">

      {/* ── Sidebar ─────────────────────────────────────── */}
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

        <div className="flex-1 px-3 py-5 space-y-1">
          <Link to="/admin/dashboard"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#4b6b4b] hover:bg-[#1a2e1a] hover:text-green-300 transition-all">
            <ArrowLeft className="w-4 h-4 shrink-0"/> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-600 text-[#080f08] text-sm font-semibold">
            <ShoppingBag className="w-4 h-4 shrink-0"/> Manage Products
          </div>
        </div>

        <div className="px-4 py-4 border-t border-[#1a2e1a]">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-950/30 text-sm font-semibold transition-all">
            <LogOut className="w-4 h-4"/> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <main className="ml-64 flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-1">Admin · Product Catalogue</p>
            <h1 className="text-3xl font-black text-white">Manage Products</h1>
            <p className="text-[#4b6b4b] text-sm mt-1">{totalCount} total products</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3.5 bg-yellow-600 hover:bg-yellow-500 text-[#080f08] font-bold text-sm rounded-xl transition-colors shadow-lg shadow-yellow-900/30">
            <Plus className="w-4 h-4"/> Add New Product
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {label:"Total",    value:totalCount,   cl:"text-white"},
            {label:"In Stock", value:inStock,      cl:"text-green-400"},
            {label:"Out of Stock", value:outOfStock, cl:"text-red-400"},
            {label:"Categories",   value:CATS.length, cl:"text-yellow-400"},
          ].map(({label,value,cl})=>(
            <div key={label} className="bg-[#111f11] border border-[#1f3a1f] rounded-2xl p-4">
              <p className="text-[#4b6b4b] text-xs uppercase tracking-widest font-bold mb-1">{label}</p>
              <p className={`text-2xl font-black ${cl}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 bg-[#111f11] border-2 border-[#2d4a2d] focus-within:border-yellow-600 rounded-xl px-4 py-3 transition-colors">
            <Search className="w-4 h-4 text-[#4b6b4b] shrink-0"/>
            <input type="text" placeholder="Search products by name or description…"
              value={search} onChange={e=>setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-green-100 placeholder-[#3a5a3a] text-sm"/>
            {search && (
              <button onClick={()=>setSearch("")} className="text-[#4b6b4b] hover:text-white">
                <X className="w-4 h-4"/>
              </button>
            )}
          </div>
          <select value={catF} onChange={e=>setCatF(e.target.value)}
            className="bg-[#111f11] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none min-w-[150px]">
            <option value="">All Categories</option>
            {CATS.map(c=>(<option key={c} value={c} className="capitalize">{c}</option>))}
          </select>
          <select value={stockF} onChange={e=>setStockF(e.target.value)}
            className="bg-[#111f11] border-2 border-[#2d4a2d] focus:border-yellow-600 rounded-xl px-4 py-3 text-green-100 text-sm outline-none min-w-[150px]">
            <option value="">All Stock</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button onClick={()=>setCatF("")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${!catF?"bg-yellow-600 border-yellow-600 text-[#080f08]":"border-[#2d4a2d] text-[#4b6b4b] hover:border-yellow-700 hover:text-yellow-400"}`}>
            All
          </button>
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCatF(catF===c?"":c)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border capitalize transition-all
                ${catF===c?"bg-yellow-600 border-yellow-600 text-[#080f08]":"border-[#2d4a2d] text-[#4b6b4b] hover:border-yellow-700 hover:text-yellow-400"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {loading ? <Spinner/> : products.length===0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 text-[#2d4a2d] mx-auto mb-4"/>
            <p className="text-[#4b6b4b] text-lg font-semibold">No products found</p>
            <p className="text-[#3a5a3a] text-sm mt-1">Try different search or filters</p>
            <button onClick={openCreate}
              className="mt-6 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-[#080f08] font-bold text-sm rounded-xl transition-colors">
              Add First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(p=>(
              <div key={p._id}
                className="bg-[#111f11] border border-[#1f3a1f] hover:border-yellow-800 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 group">

                {/* Image or placeholder */}
                <div className="h-36 bg-[#0c190c] border-b border-[#1f3a1f] flex items-center justify-center overflow-hidden relative">
                  {p.image ? (
                    <img src={p.image} alt={p.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={e=>{e.target.style.display="none"}}/>
                  ) : (
                    <Package className="w-12 h-12 text-[#2d4a2d]"/>
                  )}
                  {/* out-of-stock overlay */}
                  {p.stock===0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-red-400 text-xs font-black uppercase tracking-widest border border-red-800 px-3 py-1 rounded-full bg-red-950/60">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  {/* Category badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border w-fit capitalize ${catColors[p.category]??"bg-green-900/50 text-green-300 border-green-800"}`}>
                    {p.category}
                  </span>

                  {/* Name + description */}
                  <div>
                    <h3 className="text-white font-bold text-sm leading-tight cursor-pointer hover:text-yellow-400 transition-colors"
                      onClick={()=>setPreview(p)}>
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="text-[#4b6b4b] text-xs mt-1 line-clamp-2">{p.description}</p>
                    )}
                  </div>

                  {/* Price + stock */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#1f3a1f]">
                    <p className="text-yellow-400 text-lg font-black">₹{p.price}</p>
                    <p className={`text-xs font-bold ${p.stock===0?"text-red-400":"text-green-400"}`}>
                      {p.stock===0?"—":p.stock+" left"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button onClick={()=>openEdit(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1a2e1a] hover:bg-yellow-900/20 border border-[#2d4a2d] hover:border-yellow-800 text-yellow-400 text-xs font-semibold transition-all">
                      <Pencil className="w-3.5 h-3.5"/> Edit
                    </button>
                    <button onClick={()=>doDelete(p._id, p.name)} disabled={busy===p._id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 hover:border-red-800 text-red-400 text-xs font-semibold transition-all disabled:opacity-40">
                      {busy===p._id
                        ? <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"/>
                        : <><Trash2 className="w-3.5 h-3.5"/> Delete</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages>1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
              className="p-2 rounded-xl bg-[#111f11] border border-[#2d4a2d] text-green-400 disabled:opacity-40 hover:border-yellow-600 transition-colors">
              <ChevronLeft className="w-4 h-4"/>
            </button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
              <button key={n} onClick={()=>setPage(n)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${n===page?"bg-yellow-600 text-[#080f08]":"bg-[#111f11] border border-[#2d4a2d] text-[#4b6b4b] hover:border-yellow-600 hover:text-yellow-400"}`}>
                {n}
              </button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
              className="p-2 rounded-xl bg-[#111f11] border border-[#2d4a2d] text-green-400 disabled:opacity-40 hover:border-yellow-600 transition-colors">
              <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
        )}
      </main>

      {/* ── Create / Edit Modal ──────────────────────────── */}
      {modal!==null && (
        <Modal title={modal==="create"?"Add New Product":"Edit Product"} onClose={()=>setModal(null)}>
          <form onSubmit={doSave} className="space-y-4">
            {formFields.map(({label,key,type,ph})=>(
              <div key={key}>
                <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-1.5 block">{label}</label>
                <input type={type} placeholder={ph} value={form[key]}
                  onChange={e=>setForm({...form,[key]:e.target.value})}
                  className={`w-full bg-[#0c190c] border-2 rounded-xl px-4 py-3 text-green-100 text-sm outline-none transition-colors placeholder-[#3a5a3a]
                    ${formErrors[key]?"border-red-800":"border-[#2d4a2d] focus:border-yellow-600"}`}/>
                {formErrors[key] && <p className="text-red-500 text-xs mt-1">{formErrors[key]}</p>}
              </div>
            ))}

            {/* Category */}
            <div>
              <label className="text-[#a3c4a3] text-xs font-bold uppercase tracking-widest mb-2 block">Category *</label>
              <div className="grid grid-cols-2 gap-2">
                {CATS.map(c=>(
                  <label key={c} className="cursor-pointer">
                    <input type="radio" name="cat" value={c} checked={form.category===c}
                      onChange={()=>setForm({...form,category:c})} className="sr-only"/>
                    <div className={`px-3 py-2.5 rounded-xl border-2 text-xs font-semibold capitalize text-center transition-all
                      ${form.category===c?"border-yellow-600 bg-[#1a1200] text-yellow-400":"border-[#2d4a2d] text-green-500 hover:border-yellow-800"}`}>
                      {c}
                    </div>
                  </label>
                ))}
              </div>
              {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
            </div>

            {/* Image preview */}
            {form.image && (
              <div className="rounded-xl overflow-hidden border border-[#2d4a2d] h-32">
                <img src={form.image} alt="preview" className="w-full h-full object-cover"
                  onError={e=>{e.target.style.display="none"}}/>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={()=>setModal(null)}
                className="flex-1 py-3 rounded-xl border border-[#2d4a2d] text-green-400 text-sm font-semibold hover:bg-[#1a2e1a] transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-[#080f08] text-sm font-extrabold transition-colors disabled:opacity-50">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#080f08] border-t-transparent rounded-full animate-spin"/>
                    Saving…
                  </span>
                ) : modal==="create" ? "Create Product" : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Product Preview Modal ────────────────────────── */}
      {preview && (
        <Modal title="Product Details" onClose={()=>setPreview(null)}>
          {preview.image && (
            <div className="rounded-xl overflow-hidden border border-[#2d4a2d] h-40 mb-5">
              <img src={preview.image} alt={preview.name} className="w-full h-full object-cover"/>
            </div>
          )}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black text-lg">{preview.name}</h3>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${catColors[preview.category]??"bg-green-900/50 text-green-300 border-green-800"}`}>
                {preview.category}
              </span>
            </div>
            {preview.description && <p className="text-[#4b6b4b] text-sm">{preview.description}</p>}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#0c190c] rounded-xl">
              <div>
                <p className="text-[#4b6b4b] text-xs uppercase font-bold">Price</p>
                <p className="text-yellow-400 text-xl font-black">₹{preview.price}</p>
              </div>
              <div>
                <p className="text-[#4b6b4b] text-xs uppercase font-bold">Stock</p>
                <p className={`text-xl font-black ${preview.stock===0?"text-red-400":"text-green-400"}`}>
                  {preview.stock===0?"Out of stock":`${preview.stock} units`}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={()=>{setPreview(null); openEdit(preview);}}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-[#080f08] text-sm font-extrabold transition-colors">
                <Pencil className="w-4 h-4"/> Edit Product
              </button>
              <button onClick={()=>{setPreview(null); doDelete(preview._id, preview.name);}}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-900 hover:bg-red-800 text-white text-sm font-bold transition-colors">
                <Trash2 className="w-4 h-4"/> Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </div>
  );
}