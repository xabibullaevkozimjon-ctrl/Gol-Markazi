import { useEffect, useState } from 'react'
import { MapPin, Search, Clock, ArrowLeft, LayoutGrid, CalendarCheck, ClipboardList, Wallet, Flame } from './icons.jsx'
import { som, pad, ds, todayStr, days, WD, MO, dLabel, rng, HOURS, gb, inp, card, Img, Badge, Stars, RateTag, Tabs, Hero, usePersist } from './ui.jsx'
import { load } from './store.js'
import { ratingOf, bookingRating, canRate, weeklyTop } from './rating.js'

const LABEL = ['', 'Yomon', 'Qoniqarsiz', "O'rtacha", 'Yaxshi', 'Ajoyib']

// O'yin tugagach: maydon rasmi chiqadi va yulduzcha so'raladi
function RateModal({ b, field, onClose, onSubmit }) {
  const [stars, setStars] = useState(0)
  const [text, setText] = useState('')
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 anim-fade">
      <div className="bg-[#0b0e15] text-white rounded-2xl w-full max-w-md overflow-hidden border border-[#f5c542]/40 anim-pop max-h-[94vh] overflow-y-auto">
        <Img src={field.img} className="w-full h-48" />
        <div className="p-5 space-y-3 text-center">
          <div className="text-[#f5c542] text-sm font-bold">O'yin tugadi!</div>
          <h3 className="text-2xl font-black">{field.name}</h3>
          <div className="text-slate-400 text-sm">{dLabel(b.date)} · {rng(b)}</div>
          <p className="font-bold">Maydonga necha yulduz qo'yasiz?</p>
          <div className="flex justify-center"><Stars value={stars} size={40} onPick={setStars} /></div>
          <div className="h-5 text-[#f5c542] font-bold">{LABEL[stars]}</div>
          <textarea className={inp} rows={2} placeholder="Fikringiz (ixtiyoriy)" value={text} onChange={(e) => setText(e.target.value)} />
          <button disabled={!stars} onClick={() => onSubmit(stars, text.trim())} className={`w-full py-3 rounded-lg ${gb(false)}`}>Yuborish</button>
          <button onClick={onClose} className={`w-full py-3 rounded-lg ${gb(false)}`}>Keyinroq</button>
        </div>
      </div>
    </div>
  )
}

export default function Customer({ db, upd, me }) {
  const [tab, setTab] = usePersist(`c${me.id}_tab`, 'fields')
  const [fid, setFid] = usePersist(`c${me.id}_fid`, null)
  const [date0, setDate] = usePersist(`c${me.id}_date`, todayStr())
  const date = date0 < todayStr() ? todayStr() : date0
  const [dur, setDur] = usePersist(`c${me.id}_dur`, 1)
  const [skip, setSkip] = usePersist(`c${me.id}_skip`, [])
  const [start, setStart] = useState(null)
  const [msg, setMsg] = useState('')
  const [hl, setHl] = useState(null)
  const [q, setQ] = useState('')
  const [rateId, setRateId] = useState(null)
  const [, setTick] = useState(0)
  useEffect(() => { const t = setInterval(() => setTick((x) => x + 1), 20000); return () => clearInterval(t) }, [])

  const field = db.fields.find((x) => x.id === fid)
  const nowH = new Date().getHours()
  const live = (b) => b.status !== 'rad'
  const at = (h) => db.bookings.find((b) => b.fieldId === fid && b.date === date && live(b) && h >= b.hour && h < b.hour + b.hours)
  const past = (h) => date === todayStr() && h <= nowH
  const okStart = (h) => h + dur <= 24 && Array.from({ length: dur }, (_, i) => h + i).every((x) => !at(x) && !past(x))
  const picked = (h) => start !== null && h >= start && h < start + dur
  const ownerName = (x) => db.users.find((u) => u.id === x.ownerId)?.name || 'Gol Markazi'
  const list = db.fields.filter((x) => (x.name + ' ' + x.address).toLowerCase().includes(q.toLowerCase()))
  const mine = db.bookings.filter((b) => b.customerId === me.id).sort((a, b) => (b.at || 0) - (a.at || 0))
  const here = mine.filter((b) => b.fieldId === fid && live(b))
  const sum = mine.filter(live).reduce((s, b) => s + (b.total || 0), 0)
  const top = weeklyTop(db, 5)
  const reviews = field ? db.ratings.filter((x) => x.fieldId === field.id).sort((a, b) => b.at - a.at).slice(0, 3) : []

  const auto = mine.find((b) => canRate(b) && !bookingRating(db, b.id) && !skip.includes(b.id))
  const cur = rateId ? mine.find((b) => b.id === rateId) : auto
  const curField = cur && db.fields.find((x) => x.id === cur.fieldId)

  const open = (x) => { setFid(x.id); setDate(todayStr()); setDur(1); setStart(null); setMsg(''); setHl(null); setTab('book'); window.scrollTo({ top: 0 }) }
  const cancel = (id) => upd((p) => ({ ...p, bookings: p.bookings.filter((x) => x.id !== id) }))
  const book = () => {
    const latest = load()
    const clash = latest.bookings.some((b) => b.fieldId === fid && b.date === date && live(b) && b.hour < start + dur && start < b.hour + b.hours)
    if (clash) { upd(() => latest); setStart(null); setMsg('Bu vaqt hozirgina boshqa mijoz tomonidan band qilindi. Boshqa vaqtni tanlang.'); return }
    const nb = { id: 'b' + Date.now() + Math.random().toString(36).slice(2, 6), at: Date.now(), fieldId: fid, customerId: me.id, date, hour: start, hours: dur, total: field.price * dur, status: 'kutilmoqda' }
    upd((p) => ({ ...p, bookings: [...p.bookings, nb] }))
    setStart(null); setMsg(''); setTab('orders'); window.scrollTo({ top: 0 })
  }
  const sendRate = (stars, comment) => {
    upd((p) => ({ ...p, ratings: [...p.ratings.filter((x) => x.bookingId !== cur.id), { id: 'r' + Date.now() + Math.random().toString(36).slice(2, 6), bookingId: cur.id, fieldId: cur.fieldId, customerId: me.id, stars, comment, at: Date.now() }] }))
    setRateId(null)
  }
  const closeRate = () => { setSkip([...skip, cur.id]); setRateId(null) }
  const hs = (h) => {
    const b = at(h)
    if (b) return b.customerId === me.id ? 'bg-amber-700 text-white ring-2 ring-[#f5c542]' : 'bg-slate-700 text-slate-300 line-through'
    if (past(h)) return 'bg-slate-800/60 text-slate-600 line-through'
    if (picked(h)) return 'bg-[#f5c542] text-black ring-2 ring-white'
    return okStart(h) ? gb(false) : 'bg-slate-900 text-slate-600'
  }
  const sel = 'bg-[#f5c542] text-black ring-2 ring-white font-bold'

  return (
    <>
      <Hero title={<>Futbol maydonini <span className="gold-text">onlayn band qiling</span></>} sub={`${db.fields.length} ta maydon. Sana va soatni tanlang, buyurtma bering, o'yindan keyin baho bering.`}>
        <Tabs tab={tab} set={setTab} tabs={[['fields', 'Maydonlar', LayoutGrid], ['book', 'Band qilish', CalendarCheck], ['orders', 'Buyurtmalarim', ClipboardList, mine.filter((b) => b.status === 'kutilmoqda').length]]} />
      </Hero>
      <main key={tab} className="max-w-5xl mx-auto p-4 anim-page">
        {tab === 'fields' && (
          <section>
            {top.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-black flex items-center gap-2 mb-3"><Flame className="text-[#f5c542]" size={22} />Haftaning eng ko'p band qilingan maydonlari</h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {top.map(({ field: x, count }, i) => (
                    <div key={x.id} onClick={() => open(x)} style={{ animationDelay: `${i * 70}ms` }} className={`${card} shrink-0 w-56 overflow-hidden cursor-pointer hover:-translate-y-1 hover:border-[#f5c542] transition-all duration-300 anim-up group`}>
                      <div className="relative overflow-hidden">
                        <Img src={x.img} className="w-full h-24 transition-transform duration-500 group-hover:scale-110" />
                        <span className="absolute top-2 left-2 w-8 h-8 rounded-full bg-[#f5c542] text-black font-black flex items-center justify-center">{i + 1}</span>
                      </div>
                      <div className="p-3">
                        <div className="font-extrabold leading-tight truncate">{x.name}</div>
                        <div className="text-xs text-slate-400">{count} ta buyurtma (7 kun)</div>
                        <RateTag r={ratingOf(db, x.id)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-2xl font-black">Maydonlar ({list.length})</h2>
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input className={inp + ' pl-9'} placeholder="Nom yoki manzil bo'yicha qidirish" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
            </div>
            {list.length === 0 && <p className="text-slate-400">Hech narsa topilmadi. Boshqa nom yoki tumanni yozib ko'ring.</p>}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {list.map((x, i) => (
                <div key={x.id} onClick={() => open(x)} style={{ animationDelay: `${(i % 12) * 45}ms` }} className={`${card} group anim-up overflow-hidden cursor-pointer hover:-translate-y-1 hover:border-[#f5c542]/70 transition-all duration-300 flex flex-col`}>
                  <div className="relative overflow-hidden">
                    <Img src={x.img} className="w-full h-28 sm:h-32 transition-transform duration-500 group-hover:scale-110" />
                    <span className="absolute bottom-2 left-2 bg-black/80 text-[#f5c542] text-xs font-bold px-2 py-1 rounded">{som(x.price)} / soat</span>
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="font-extrabold leading-tight">{x.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={12} />{x.address}</div>
                    <div className="mt-1 mb-3"><RateTag r={ratingOf(db, x.id)} /></div>
                    <button className={`mt-auto w-full py-2 rounded-lg text-sm ${gb(false)}`}>Band qilish</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {tab === 'book' && !field && (
          <div className={`${card} p-8 text-center`}>
            <p className="text-slate-300 mb-4">Avval maydonni tanlang.</p>
            <button onClick={() => setTab('fields')} className={`px-5 py-3 rounded-lg ${gb(false)}`}>Maydonlarni ko'rish</button>
          </div>
        )}
        {tab === 'book' && field && (
          <section className={`${card} overflow-hidden`}>
            <Img src={field.img} className="w-full h-48 sm:h-72" />
            <div className="p-4 space-y-5">
              <button onClick={() => setTab('fields')} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${gb(false)}`}><ArrowLeft size={16} />Maydonlarga qaytish</button>
              <div>
                <h3 className="font-black text-2xl">{field.name}</h3>
                <div className="text-slate-400 flex items-center gap-1"><MapPin size={14} />{field.address}</div>
                <div className="text-slate-500 text-sm">Egasi: {ownerName(field)}</div>
                <div className="flex items-center gap-3 mt-1"><span className="font-black text-[#f5c542] text-xl">{som(field.price)} / soat</span><RateTag r={ratingOf(db, field.id)} /></div>
              </div>
              <div>
                <div className="font-bold mb-2">Sanani tanlang</div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {days(14).map((d) => { const s = ds(d); return (
                    <button key={s} onClick={() => { setDate(s); setStart(null) }} className={`shrink-0 w-16 rounded-lg py-2 text-center ${date === s ? sel : gb(false)}`}>
                      <div className="text-xs">{WD[d.getDay()]}</div><div className="text-xl font-black">{d.getDate()}</div><div className="text-xs">{MO[d.getMonth()]}</div>
                    </button>) })}
                </div>
              </div>
              <div>
                <div className="font-bold mb-2">Necha soat o'ynaysiz?</div>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => { setDur(n); setStart(null) }} className={`px-4 py-2 rounded-lg ${dur === n ? sel : gb(false)}`}>{n} soat</button>)}
                </div>
              </div>
              <div>
                <div className="font-bold mb-2">Boshlanish vaqtini tanlang ({dLabel(date)})</div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {HOURS.map((h) => {
                    const b = at(h); const own = b && b.customerId === me.id
                    return (
                      <button key={h} disabled={b ? !own : !okStart(h)} onClick={() => (own ? setHl(b.id) : !b && setStart(h))} className={`py-2 rounded-lg font-bold text-sm leading-tight transition-all hover:scale-105 disabled:hover:scale-100 ${hs(h)}`}>
                        {h}:00{b && <div className="text-[10px] font-normal">{own ? 'Sizniki' : 'Band'}</div>}
                      </button>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-3">
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-green-600 inline-block" />Bo'sh</span>
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-slate-700 inline-block" />Band (boshqa mijoz)</span>
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-amber-700 inline-block" />Sizning buyurtmangiz</span>
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-slate-800 inline-block" />O'tib ketgan</span>
                </div>
              </div>
              {here.length > 0 && (
                <div>
                  <div className="font-bold mb-2">Shu maydondagi buyurtmalaringiz</div>
                  <div className="space-y-2">
                    {here.map((b) => (
                      <div key={b.id} className={`rounded-lg border p-3 flex flex-wrap items-center justify-between gap-2 transition-colors ${hl === b.id ? 'border-[#f5c542] bg-[#f5c542]/10' : 'border-white/10'}`}>
                        <div className="text-sm"><b>{dLabel(b.date)}</b> · {rng(b)} · {b.hours} soat · <b className="text-[#f5c542]">{som(b.total)}</b></div>
                        <div className="flex items-center gap-2"><Badge s={b.status} />{b.status === 'kutilmoqda' && <button onClick={() => cancel(b.id)} className={`px-3 py-1 rounded-lg text-sm ${gb(false)}`}>Bekor qilish</button>}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {reviews.length > 0 && (
                <div>
                  <div className="font-bold mb-2">Mijozlar fikri</div>
                  <div className="space-y-2">
                    {reviews.map((r) => (
                      <div key={r.id} className="rounded-lg bg-white/5 p-3 anim-up">
                        <div className="flex items-center gap-2 text-sm"><Stars value={r.stars} size={14} /><b>{db.users.find((u) => u.id === r.customerId)?.name || 'Mijoz'}</b></div>
                        {r.comment && <div className="text-sm text-slate-300 mt-1">{r.comment}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {msg && <div className="rounded-lg bg-red-950/70 text-red-300 border border-red-800 px-4 py-3 text-sm anim-pop">{msg}</div>}
              {start !== null && (
                <div className="rounded-xl bg-[#f5c542]/10 border border-[#f5c542]/30 p-4 anim-pop">
                  <div className="font-bold">{field.name}</div>
                  <div className="text-sm text-slate-300">{dLabel(date)} · {pad(start)}:00–{pad(start + dur)}:00 · {dur} soat</div>
                  <div className="font-black text-xl text-[#f5c542] mt-1">Jami: {som(field.price * dur)}</div>
                </div>
              )}
              <button disabled={start === null} onClick={book} className={`w-full py-4 rounded-lg text-lg ${gb(false)}`}>{start === null ? 'Vaqtni tanlang' : 'Buyurtma berish'}</button>
            </div>
          </section>
        )}
        {tab === 'orders' && (
          <section>
            <div className="rounded-xl p-4 bg-gradient-to-r from-[#2a1f05] to-[#0e1119] mb-4 flex items-center justify-between border-l-8 border-[#f5c542] border-y border-r border-white/10">
              <div><div className="text-sm text-slate-300">Jami buyurtmalar summasi</div><div key={sum} className="text-3xl font-black text-[#f5c542] anim-pop">{som(sum)}</div></div>
              <Wallet size={34} className="text-[#f5c542]" />
            </div>
            {mine.length === 0 && <p className="text-slate-400">Hali buyurtma yo'q. "Maydonlar" bo'limidan maydon tanlang.</p>}
            <div className="space-y-2">
              {mine.map((b) => {
                const fl = db.fields.find((x) => x.id === b.fieldId)
                const rt = bookingRating(db, b.id)
                return (
                  <div key={b.id} className={`${card} p-3 anim-up`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Img src={fl?.img} className="w-16 h-16 rounded-lg" />
                        <div>
                          <div className="font-extrabold">{fl?.name}</div>
                          <div className="text-sm text-slate-400 flex items-center gap-1"><Clock size={13} />{dLabel(b.date)} · {rng(b)} · {b.hours} soat</div>
                          <div className="font-black text-[#f5c542]">{som(b.total)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge s={b.status} />
                        {b.status === 'kutilmoqda' && <button onClick={() => cancel(b.id)} className={`px-3 py-2 rounded-lg text-sm ${gb(false)}`}>Bekor qilish</button>}
                      </div>
                    </div>
                    {canRate(b) && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 anim-fade">
                        {rt ? (
                          <div className="flex items-center gap-2 text-sm"><span className="text-slate-400">Sizning bahoyingiz:</span><Stars value={rt.stars} size={18} />{rt.comment && <span className="text-slate-300">{rt.comment}</span>}</div>
                        ) : (
                          <>
                            <span className="text-sm text-slate-300">O'yin tugadi. Maydonni baholang.</span>
                            <button onClick={() => setRateId(b.id)} className={`px-4 py-2 rounded-lg text-sm ${gb(false)}`}>Baholash</button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>
      {cur && curField && <RateModal key={cur.id} b={cur} field={curField} onClose={closeRate} onSubmit={sendRate} />}
    </>
  )
}
