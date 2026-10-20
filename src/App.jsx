import { useEffect, useState } from 'react'
import { LogOut, ImagePlus, X } from './icons.jsx'
import { load, save, getMe, setMe } from './store.js'
import { ROLE, gb, inp, BG, Avatar, Pw, Brand, toDataUrl, clearAuthUi } from './ui.jsx'
import Auth from './Auth.jsx'
import Customer from './Customer.jsx'
import Owner from './Owner.jsx'

export default function App() {
  const [db, setDb] = useState(load)
  const [meId, setMeId] = useState(getMe)
  const [prof, setProf] = useState(false)
  // Har safar eng yangi ma'lumot ustiga yoziladi (boshqa oynadagi o'zgarishlar yo'qolmaydi)
  const upd = (f) => setDb(() => { save(f(load())); return load() })
  useEffect(() => {
    // Ma'lumot o'zgarmagan bo'lsa qayta chizilmaydi (bosishlar yo'qolmasligi uchun)
    const h = () => setDb((prev) => { const n = load(); return JSON.stringify(n) === JSON.stringify(prev) ? prev : n })
    window.addEventListener('storage', h)
    window.addEventListener('focus', h)
    return () => { window.removeEventListener('storage', h); window.removeEventListener('focus', h) }
  }, [])
  const me = db.users.find((u) => u.id === meId)
  const login = (id) => { clearAuthUi(); setMe(id); setMeId(id) }
  const logout = () => { clearAuthUi(); setMe(null); setMeId(null); setProf(false) }
  if (!me) return <Auth db={db} upd={upd} onLogin={login} />
  return (
    <div className="min-h-screen text-white anim-fade" style={BG}>
      <header className="bg-black text-white border-b border-[#f5c542]/40 anim-down">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Brand />
          <div className="flex items-center gap-2">
            <button onClick={() => setProf(true)} className={`rounded-lg pl-1 pr-3 py-1 flex items-center gap-2 ${gb(false)}`}>
              <Avatar u={me} size={34} />
              <span className="text-left text-xs leading-tight"><span className="block font-bold max-w-[7rem] truncate">{me.name}</span><span className="block font-normal opacity-90 hidden sm:block">{ROLE[me.role]} · Profil</span></span>
            </button>
            <button onClick={logout} className={`rounded-lg px-3 py-2 flex items-center gap-2 ${gb(false)}`}><LogOut size={16} /><span className="hidden sm:inline">Chiqish</span></button>
          </div>
        </div>
      </header>
      {me.role === 'owner' ? <Owner db={db} upd={upd} me={me} /> : <Customer db={db} upd={upd} me={me} />}
      {prof && <Profile me={me} upd={upd} onClose={() => setProf(false)} />}
    </div>
  )
}

function Profile({ me, upd, onClose }) {
  const [f, setF] = useState({ name: me.name, phone: me.phone, password: me.password, avatar: me.avatar || '' })
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const pick = async (e) => { const file = e.target.files?.[0]; if (file) setF({ ...f, avatar: await toDataUrl(file, 300) }) }
  const submit = () => {
    setErr(''); setOk('')
    if (f.name.trim().length < 2) return setErr('Ismingizni kiriting')
    if (!/^\d{9}$/.test(f.phone)) return setErr("Telefon raqam 9 ta raqamdan iborat bo'lsin")
    if (f.password.length < 4) return setErr("Parol kamida 4 belgi bo'lsin")
    if (load().users.some((u) => u.id !== me.id && u.phone === f.phone)) return setErr('Bu raqam boshqa foydalanuvchida bor')
    upd((p) => ({ ...p, users: p.users.map((u) => (u.id === me.id ? { ...u, name: f.name.trim(), phone: f.phone, password: f.password, avatar: f.avatar } : u)) }))
    setOk('Saqlandi')
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 anim-fade" onClick={onClose}>
      <div className="bg-[#0b0e15] text-white rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto p-5 border border-[#f5c542]/40 anim-pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black gold-text">Profil</h2>
          <button onClick={onClose} className={`p-2 rounded-lg ${gb(false)}`} aria-label="Yopish"><X size={18} /></button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <Avatar u={{ avatar: f.avatar }} size={80} />
          <div className="space-y-2">
            <label className={`cursor-pointer inline-flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${gb(false)}`}><ImagePlus size={16} />Rasm tanlash<input type="file" accept="image/*" className="hidden" onChange={pick} /></label>
            {f.avatar && <button onClick={() => setF({ ...f, avatar: '' })} className={`block text-sm rounded-lg px-3 py-2 ${gb(false)}`}>Rasmni olib tashlash</button>}
          </div>
        </div>
        <div className="text-sm text-slate-400 mb-3">Rol: <b className="text-white">{ROLE[me.role]}</b></div>
        <div className="space-y-3">
          <div><div className="text-sm font-bold mb-1">Ism</div><input className={inp} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div><div className="text-sm font-bold mb-1">Telefon raqam</div><input className={inp} inputMode="numeric" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
          <div><div className="text-sm font-bold mb-1">Parol</div><Pw value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
        </div>
        {err && <div className="mt-3 rounded-lg bg-red-950/70 text-red-300 border border-red-800 px-4 py-3 text-sm anim-pop">{err}</div>}
        {ok && <div className="mt-3 rounded-lg bg-green-950/70 text-green-300 border border-green-800 px-4 py-3 text-sm anim-pop">{ok}</div>}
        <button onClick={submit} className={`mt-4 w-full py-3 rounded-lg ${gb(false)}`}>Saqlash</button>
      </div>
    </div>
  )
}
