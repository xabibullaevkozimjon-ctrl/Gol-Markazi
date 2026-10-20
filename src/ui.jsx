import { useState } from 'react'
import { User, Star, Eye, EyeOff } from './icons.jsx'

export const som = (n) => Number(n || 0).toLocaleString('uz-UZ').replace(/,/g, ' ') + " so'm"
export const pad = (n) => String(n).padStart(2, '0')
export const ds = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayStr = () => ds(new Date())
export const days = (n) => Array.from({ length: n }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d })
export const WD = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']
export const MO = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek']
export const dLabel = (s) => { const [, m, d] = s.split('-').map(Number); return `${d}-${MO[m - 1]}` }
export const rng = (b) => `${pad(b.hour)}:00–${pad(b.hour + b.hours)}:00`
export const HOURS = Array.from({ length: 16 }, (_, i) => i + 8)
export const FALLBACK = 'img/default.jpg'
export const ROLE = { customer: 'Buyurtma beruvchi', owner: 'Qabul qiluvchi' }
export const GOLD = '#f5c542'
export const ST = {
  kutilmoqda: ['Kutilmoqda', 'bg-amber-400/15 text-amber-300 border border-amber-400/40'],
  qabul: ['Qabul qilindi', 'bg-green-500/20 text-green-300 border border-green-400/40'],
  yakunlandi: ['Yakunlandi', 'bg-white/10 text-white border border-white/30'],
  rad: ['Rad etildi', 'bg-red-500/20 text-red-300 border border-red-400/40'],
}
// Barcha tugmalar: yashil fon, oq yozuv
export const gb = (on) => (on ? 'bg-green-800 ring-2 ring-[#f5c542] text-white font-bold' : 'bg-green-600 hover:bg-green-700 text-white font-bold') +
  ' transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0'
export const inp = 'w-full rounded-lg bg-[#080a10] text-white placeholder:text-slate-500 border border-white/15 px-4 py-3 outline-none focus:ring-2 focus:ring-[#f5c542] focus:border-transparent transition'
export const card = 'bg-[#0e1119]/95 rounded-xl border border-white/10 shadow-lg shadow-black/40 text-white'
export const BG = { background: 'radial-gradient(ellipse at 50% -10%, rgba(245,197,66,.10), transparent 55%), #05070c' }

export const toDataUrl = (file, max = 800) => new Promise((res) => {
  const r = new FileReader()
  r.onload = () => {
    const im = new Image()
    im.onload = () => {
      const s = Math.min(1, max / im.width), c = document.createElement('canvas')
      c.width = im.width * s; c.height = im.height * s
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height)
      res(c.toDataURL('image/jpeg', 0.8))
    }
    im.src = r.result
  }
  r.readAsDataURL(file)
})

// Sahifani yangilaganda (Ctrl+R) tanlangan bo'lim, maydon va sana saqlanib qoladi (har bir oyna uchun alohida)
export const usePersist = (key, init) => {
  const [v, setV] = useState(() => { try { const r = sessionStorage.getItem('maydon_ui_' + key); return r === null ? init : JSON.parse(r) } catch { return init } })
  const set = (x) => { setV(x); try { sessionStorage.setItem('maydon_ui_' + key, JSON.stringify(x)) } catch {} }
  return [v, set]
}
export const clearAuthUi = () => { try { sessionStorage.removeItem('maydon_ui_auth_role'); sessionStorage.removeItem('maydon_ui_auth_tab') } catch {} }

export const Img = ({ src, className = '' }) => (
  <img src={src || FALLBACK} alt="" loading="lazy" className={`object-cover ${className}`}
    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK }} />
)
export const Badge = ({ s }) => <span key={s} className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap anim-pop ${ST[s][1]}`}>{ST[s][0]}</span>
export const Avatar = ({ u, size = 36 }) => (
  u?.avatar
    ? <img src={u.avatar} alt="" style={{ width: size, height: size }} className="rounded-full object-cover border-2 border-[#f5c542]" />
    : <div style={{ width: size, height: size }} className="rounded-full bg-[#1b1608] text-[#f5c542] flex items-center justify-center border-2 border-[#f5c542]"><User size={size * 0.55} /></div>
)
export const Brand = ({ size = 40, text = 'text-2xl' }) => (
  <div className="flex items-center gap-3">
    <img src="img/logo.jpg" alt="" style={{ width: size, height: size }} className="rounded-full object-cover ring-2 ring-[#f5c542]" onError={(e) => { e.currentTarget.style.display = 'none' }} />
    <span className={`${text} font-black tracking-tight gold-text`}>Gol Markazi</span>
  </div>
)
export const Pw = ({ value, onChange, placeholder = 'Parol' }) => {
  const [s, setS] = useState(false)
  return (
    <div className="relative">
      <input className={inp + ' pr-14'} type={s ? 'text' : 'password'} placeholder={placeholder} value={value} onChange={onChange} />
      <button type="button" onClick={() => setS(!s)} aria-label="Parolni ko'rsatish" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white">{s ? <EyeOff size={16} /> : <Eye size={16} />}</button>
    </div>
  )
}
// Yulduzchalar: onPick berilsa bosib baho beriladi, bo'lmasa faqat ko'rsatadi
export const Stars = ({ value = 0, size = 16, onPick }) => {
  const [hov, setHov] = useState(0)
  const shown = hov || Math.round(value)
  const El = onPick ? 'button' : 'span'
  return (
    <span className="inline-flex gap-0.5" onMouseLeave={() => setHov(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <El key={i} {...(onPick ? { type: 'button', onClick: () => onPick(i), onMouseEnter: () => setHov(i), 'aria-label': `${i} yulduz` } : {})}
          className={`${i <= shown ? 'text-[#f5c542]' : 'text-slate-600'} transition-all duration-150 ${onPick ? 'hover:scale-125 cursor-pointer' : ''}`}>
          <Star size={size} filled={i <= shown} />
        </El>
      ))}
    </span>
  )
}
export const RateTag = ({ r }) => r.n
  ? <span className="inline-flex items-center gap-1 text-xs font-bold text-[#f5c542]"><Star size={13} filled />{r.avg.toFixed(1)}<span className="text-slate-400 font-normal">({r.n})</span></span>
  : <span className="text-xs text-slate-500">Hali baho yo'q</span>
export const Tabs = ({ tabs, tab, set }) => (
  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${tabs.length},1fr)` }}>
    {tabs.map(([k, t, I, n]) => (
      <button key={k} onClick={() => { set(k); window.scrollTo({ top: 0 }) }}
        className={`relative py-3 rounded-lg text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${gb(tab === k)}`}>
        <I size={18} /><span>{t}</span>
        {n > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-black animate-pulse">{n}</span>}
      </button>
    ))}
  </div>
)
export const Hero = ({ title, sub, children }) => (
  <section className="anim-fade border-b border-[#f5c542]/20" style={{ backgroundImage: 'linear-gradient(90deg,rgba(5,7,12,.97) 0%,rgba(5,7,12,.86) 45%,rgba(5,7,12,.3) 100%),url(img/bg-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'right center' }}>
    <div className="max-w-5xl mx-auto px-4 pt-9 pb-5">
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl">{title}</h1>
      <p className="text-slate-300 mt-2 mb-6 max-w-xl">{sub}</p>
      {children}
    </div>
  </section>
)
