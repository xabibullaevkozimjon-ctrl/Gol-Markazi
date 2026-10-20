import { useState } from 'react'
import { User, Building2, Lock } from './icons.jsx'
import { ROLE, gb, inp, usePersist, Pw, Avatar, Brand } from './ui.jsx'
import { load } from './store.js'

const PICK = [
  ['customer', User, "Maydonni band qilaman, o'yindan keyin baho beraman"],
  ['owner', Building2, 'Maydonlarim va buyurtmalarni boshqaraman'],
]
const DEMO = { customer: '900000001' }

export default function Auth({ db, upd, onLogin }) {
  const [role, setRole] = usePersist('auth_role', null)
  const [tab, setTab] = usePersist('auth_tab', 'reg')
  const [f, setF] = useState({ name: '', phone: '', password: '' })
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [foc, setFoc] = useState(false)
  const ownerTaken = db.users.some((u) => u.role === 'owner')
  const blocked = role === 'owner' && ownerTaken && tab === 'reg'
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  // Raqam to'liq yozilsa, shu raqamga tegishli parol ham o'zi chiqadi
  const setPhone = (e) => {
    const v = e.target.value
    const u = tab === 'login' ? db.users.find((x) => x.phone === v && x.role === role) : null
    setF({ ...f, phone: v, password: u ? u.password : f.password })
  }
  const sug = tab === 'login' && foc && f.phone ? db.users.filter((u) => u.role === role && u.phone.startsWith(f.phone) && u.phone !== f.phone).slice(0, 5) : []
  const pickRole = (k) => { setRole(k); setErr(''); setOk(''); if (k === 'owner' && ownerTaken) setTab('login') }
  const register = () => {
    setErr(''); setOk('')
    const users = load().users
    if (role === 'owner' && users.some((u) => u.role === 'owner')) return setErr("Qabul qiluvchi allaqachon ro'yxatdan o'tgan. Faqat kirish mumkin.")
    if (f.name.trim().length < 2) return setErr('Ismingizni kiriting')
    if (!/^\d{9}$/.test(f.phone)) return setErr("Telefon raqam 9 ta raqamdan iborat bo'lsin (masalan 901234567)")
    if (f.password.length < 4) return setErr("Parol kamida 4 belgi bo'lsin")
    if (users.some((u) => u.phone === f.phone)) return setErr("Bu raqam allaqachon ro'yxatdan o'tgan")
    upd((p) => ({ ...p, users: [...p.users, { id: Date.now(), name: f.name.trim(), phone: f.phone, password: f.password, role }] }))
    setOk("Ro'yxatdan o'tdingiz! Endi kirishingiz mumkin.")
    setF({ name: '', phone: f.phone, password: f.password }); setTab('login')
  }
  const enter = () => {
    setErr(''); setOk('')
    const u = load().users.find((x) => x.phone === f.phone && x.password === f.password)
    if (!u) return setErr("Telefon raqam yoki parol noto'g'ri")
    if (u.role !== role) return setErr(`Bu raqam "${ROLE[u.role]}" sifatida ro'yxatdan o'tgan. Rolni o'zgartirib qayta kiring.`)
    onLogin(u.id)
  }
  const back = () => { setRole(null); setErr(''); setOk(''); setF({ name: '', phone: '', password: '' }); setTab('reg') }
  return (
    <div className="min-h-screen anim-fade flex items-center text-white" style={{ backgroundImage: 'linear-gradient(90deg,rgba(5,7,12,.94) 0%,rgba(5,7,12,.7) 50%,rgba(5,7,12,.25) 100%),url(img/bg-login.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10 items-center">
        <div className="hidden md:block anim-up">
          <Brand size={64} text="text-5xl" />
          <h1 className="text-4xl font-black leading-tight mt-8">Futbol maydonini <span className="gold-text">onlayn band qiling</span></h1>
          <ul className="mt-5 space-y-2 text-slate-300">
            <li>50 ta maydon, hammasi bitta joyda</li>
            <li>Sana va soatni o'zingiz tanlaysiz</li>
            <li>O'yindan keyin maydonga baho berasiz</li>
            <li>Haftaning eng ko'p band qilingan maydonlari reytingi</li>
          </ul>
        </div>
        <div className="w-full max-w-md mx-auto md:mr-0 md:ml-auto bg-[#0b0e15]/95 text-white rounded-2xl p-6 shadow-2xl border border-[#f5c542]/30 anim-pop">
          <div className="md:hidden mb-5 flex justify-center"><Brand size={48} text="text-3xl" /></div>
          <div key={role ? 'form' + tab : 'pick'} className="anim-fade">
            {!role ? (
              <>
                <p className="text-center font-black text-xl mb-4">Saytga kim bo'lib kirmoqchisiz?</p>
                <div className="space-y-3">
                  {PICK.map(([k, I, d], i) => (
                    <button key={k} onClick={() => pickRole(k)} style={{ animationDelay: `${i * 90}ms` }} className={`w-full py-4 px-5 rounded-xl flex items-center gap-4 text-left anim-up ${gb(false)}`}>
                      <I size={28} /><span><span className="block text-lg">{ROLE[k]}</span><span className="block text-sm font-normal opacity-90">{k === 'owner' && ownerTaken ? "Allaqachon ro'yxatdan o'tgan, faqat kirish" : d}</span></span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3 rounded-lg bg-white/5 px-3 py-2">
                  <span className="font-bold">{ROLE[role]}</span>
                  <button onClick={back} className={`px-3 py-1 rounded-lg text-sm ${gb(false)}`}>O'zgartirish</button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[['reg', "Ro'yxatdan o'tish"], ['login', 'Kirish']].map(([k, t]) => (
                    <button key={k} onClick={() => { setTab(k); setErr(''); setOk('') }} className={`py-3 rounded-lg ${gb(tab === k)}`}>{t}</button>
                  ))}
                </div>
                {blocked ? (
                  <div className="rounded-lg bg-[#f5c542]/10 border border-[#f5c542]/40 p-4 text-center space-y-3">
                    <Lock className="mx-auto text-[#f5c542]" size={28} />
                    <p className="text-sm text-slate-200">Qabul qiluvchi allaqachon ro'yxatdan o'tgan. Yangi qabul qiluvchi qo'shib bo'lmaydi.</p>
                    <button onClick={() => setTab('login')} className={`px-4 py-2 rounded-lg ${gb(false)}`}>Kirishga o'tish</button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {tab === 'reg' && <input className={inp} placeholder="Ism" value={f.name} onChange={set('name')} />}
                      <div className="relative">
                        <input className={inp} placeholder="Telefon (9 raqam)" inputMode="numeric" value={f.phone} onChange={setPhone} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)} autoComplete="off" />
                        {sug.length > 0 && (
                          <div className="absolute z-10 left-0 right-0 mt-1 rounded-lg overflow-hidden shadow-xl border border-green-700 anim-pop">
                            {sug.map((u) => (
                              <button key={u.id} onMouseDown={(e) => { e.preventDefault(); setF({ ...f, phone: u.phone, password: u.password }); setFoc(false) }} className="w-full text-left px-3 py-2 flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white">
                                <Avatar u={u} size={28} /><span><b>{u.phone}</b> <span className="text-sm opacity-90">{u.name}</span></span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <Pw value={f.password} onChange={set('password')} />
                    </div>
                    {err && <div className="mt-3 rounded-lg bg-red-950/70 text-red-300 border border-red-800 px-4 py-3 text-sm anim-pop">{err}</div>}
                    {ok && <div className="mt-3 rounded-lg bg-green-950/70 text-green-300 border border-green-800 px-4 py-3 text-sm anim-pop">{ok}</div>}
                    {tab === 'reg'
                      ? <button onClick={register} className={`mt-4 w-full py-3 rounded-lg ${gb(false)}`}>Ro'yxatdan o'tish</button>
                      : (
                        <>
                          <button onClick={enter} className={`mt-4 w-full py-3 rounded-lg ${gb(false)}`}>Kirish</button>
                          <p className="text-xs text-slate-500 mt-3">{DEMO[role] ? `Demo: ${DEMO[role]}, parol demo123. ` : ''}Raqamning birinchi raqamlarini yozsangiz, ro'yxatdan o'tgan raqamlar chiqadi, tanlasangiz parol ham o'zi yoziladi.</p>
                        </>
                      )}
                  </>
                )}
                {blocked && err && <div className="mt-3 rounded-lg bg-red-950/70 text-red-300 border border-red-800 px-4 py-3 text-sm">{err}</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
