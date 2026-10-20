import { useState } from 'react'
import { Building2, MapPin, Search, Plus, Trash2, ImagePlus, Pencil, Eye, Clock, Phone, Wallet, Inbox, Flame, X } from './icons.jsx'
import { som, ds, todayStr, dLabel, rng, ROLE, gb, inp, card, Img, Badge, Stars, RateTag, Tabs, Hero, usePersist, toDataUrl } from './ui.jsx'
import { ratingOf, bookingRating, weeklyTop } from './rating.js'

function OrderRow({ b, actions, db, setStatus }) {
  const fl = db.fields.find((x) => x.id === b.fieldId)
  const cu = db.users.find((u) => u.id === b.customerId)
  const rt = bookingRating(db, b.id)
  return (
    <div className={`${card} p-3 space-y-3 anim-up`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Img src={fl?.img} className="w-16 h-16 rounded-lg" />
          <div>
            <div className="font-extrabold">{fl?.name}</div>
            <div className="text-sm text-slate-400 flex items-center gap-1"><Clock size={13} />{dLabel(b.date)} · {rng(b)} · {b.hours} soat</div>
            <div className="text-sm text-slate-400 flex items-center gap-1"><Phone size={13} />{cu?.name} ({ROLE[cu?.role]}) · +998 {cu?.phone}</div>
          </div>
        </div>
        <div className="text-right space-y-1"><div className="font-black text-[#f5c542]">{som(b.total)}</div><Badge s={b.status} /></div>
      </div>
      {rt && (
        <div className="flex flex-wrap items-center gap-2 text-sm rounded-lg bg-[#f5c542]/10 border border-[#f5c542]/30 px-3 py-2 anim-pop">
          <span className="text-slate-300">Mijoz bahosi:</span><Stars value={rt.stars} size={16} />{rt.comment && <span className="text-slate-200">{rt.comment}</span>}
        </div>
      )}
      {actions && (
        <div className="flex flex-wrap gap-2">
          {[['kutilmoqda', 'Kutilmoqda'], ['qabul', 'Qabul qilindi'], ['yakunlandi', 'Yakunlandi'], ['rad', 'Rad etish']].map(([k, t]) => (
            <button key={k} onClick={() => setStatus(b.id, k)} className={`rounded-lg px-3 py-2 text-sm ${gb(b.status === k)}`}>{t}</button>
          ))}
        </div>
      )}
    </div>
  )
}

// Maydonni ochib ko'rish: rasm, baho, mijozlar fikri va buyurtmalar
function FieldModal({ field, db, onClose, onImg }) {
  const r = ratingOf(db, field.id)
  const reviews = db.ratings.filter((x) => x.fieldId === field.id).sort((a, b) => b.at - a.at)
  const bks = db.bookings.filter((b) => b.fieldId === field.id).sort((a, b) => (b.at || 0) - (a.at || 0)).slice(0, 8)
  const week = db.bookings.filter((b) => b.fieldId === field.id && b.status !== 'rad' && (b.at || Date.parse(b.date)) >= Date.now() - 7 * 864e5).length
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 anim-fade" onClick={onClose}>
      <div className="bg-[#0b0e15] text-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto border border-[#f5c542]/40 anim-pop" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <Img src={field.img} className="w-full h-52" />
          <button onClick={onClose} aria-label="Yopish" className={`absolute top-3 right-3 p-2 rounded-lg ${gb(false)}`}><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-2xl font-black">{field.name}</h3>
            <div className="text-slate-400 flex items-center gap-1"><MapPin size={14} />{field.address}</div>
            <div className="font-black text-[#f5c542] text-xl mt-1">{som(field.price)} / soat</div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-white/5 p-3"><div className="text-xl font-black text-[#f5c542]">{r.n ? r.avg.toFixed(1) : '—'}</div><div className="text-xs text-slate-400">O'rtacha baho</div></div>
            <div className="rounded-lg bg-white/5 p-3"><div className="text-xl font-black">{r.n}</div><div className="text-xs text-slate-400">Baholar soni</div></div>
            <div className="rounded-lg bg-white/5 p-3"><div className="text-xl font-black">{week}</div><div className="text-xs text-slate-400">7 kunda band</div></div>
          </div>
          <label className={`inline-flex items-center gap-2 cursor-pointer text-sm rounded-lg px-3 py-2 ${gb(false)}`}><ImagePlus size={16} />Rasmni almashtirish<input type="file" accept="image/*" className="hidden" onChange={(e) => onImg(field.id, e)} /></label>
          <div>
            <div className="font-bold mb-2">Mijozlar bahosi ({reviews.length})</div>
            {reviews.length === 0 && <p className="text-sm text-slate-400">Hali baho berilmagan. O'yin tugagach mijoz yulduzcha qo'yadi.</p>}
            <div className="space-y-2">
              {reviews.map((x) => (
                <div key={x.id} className="rounded-lg bg-white/5 p-3 anim-up">
                  <div className="flex items-center justify-between gap-2 text-sm"><span className="flex items-center gap-2"><Stars value={x.stars} size={14} /><b>{db.users.find((u) => u.id === x.customerId)?.name || 'Mijoz'}</b></span><span className="text-xs text-slate-500">{dLabel(ds(new Date(x.at)))}</span></div>
                  {x.comment && <div className="text-sm text-slate-300 mt-1">{x.comment}</div>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-bold mb-2">So'nggi buyurtmalar</div>
            {bks.length === 0 && <p className="text-sm text-slate-400">Buyurtma yo'q.</p>}
            <div className="space-y-2">
              {bks.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <span>{dLabel(b.date)} · {rng(b)} · {db.users.find((u) => u.id === b.customerId)?.name}</span><Badge s={b.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const RankRow = ({ i, x, extra, db, delay }) => (
  <div style={{ animationDelay: `${delay}ms` }} className={`${card} p-3 flex items-center gap-3 anim-up`}>
    <span className={`w-9 h-9 shrink-0 rounded-full font-black flex items-center justify-center ${i < 3 ? 'bg-[#f5c542] text-black' : 'bg-white/10 text-white'}`}>{i + 1}</span>
    <Img src={x.img} className="w-16 h-12 rounded-lg shrink-0" />
    <div className="min-w-0 flex-1"><div className="font-extrabold truncate">{x.name}</div><div className="text-xs text-slate-400 truncate">{extra}</div></div>
    <RateTag r={ratingOf(db, x.id)} />
  </div>
)

export default function Owner({ db, upd, me }) {
  const [tab, setTab] = usePersist(`o${me.id}_tab`, 'orders')
  const [sel, setSel] = usePersist(`o${me.id}_sel`, todayStr())
  const [f, setF] = useState({ name: '', address: '', price: '', img: '' })
  const [err, setErr] = useState('')
  const [fq, setFq] = useState('')
  const [editId, setEditId] = useState(null)
  const [openId, setOpenId] = useState(null)
  const [ef, setEf] = useState({ name: '', address: '', price: '' })
  const [eerr, setEerr] = useState('')
  // Tayyor (umumiy) maydonlar va o'zi qo'shganlari: hammasini tahrirlash mumkin
  const manage = db.fields.filter((x) => x.ownerId === me.id || x.ownerId == null)
  const shown = manage.filter((x) => (x.name + ' ' + x.address).toLowerCase().includes(fq.toLowerCase()))
  const ids = manage.map((x) => x.id)
  const orders = db.bookings.filter((b) => ids.includes(b.fieldId)).sort((a, b) => (b.at || 0) - (a.at || 0))
  const paid = orders.filter((b) => b.status === 'qabul' || b.status === 'yakunlandi')
  const pending = orders.filter((b) => b.status === 'kutilmoqda').length
  const openField = openId && db.fields.find((x) => x.id === openId)
  const setStatus = (id, status) => upd((p) => ({ ...p, bookings: p.bookings.map((b) => (b.id === id ? { ...b, status } : b)) }))
  // Tayyor maydonlar o'zgarishi "edits" da, o'zi qo'shganlar fields ichida saqlanadi
  const patchField = (id, patch) => upd((p) => (id > 1000
    ? { ...p, fields: p.fields.map((x) => (x.id === id ? { ...x, ...patch } : x)) }
    : { ...p, edits: { ...(p.edits || {}), [id]: { ...((p.edits || {})[id] || {}), ...patch } } }))
  const pick = async (e) => { const file = e.target.files?.[0]; if (file) setF({ ...f, img: await toDataUrl(file) }) }
  const changeImg = async (id, e) => { const file = e.target.files?.[0]; if (file) patchField(id, { img: await toDataUrl(file) }) }
  const startEdit = (x) => { setEditId(x.id); setEf({ name: x.name, address: x.address, price: String(x.price) }); setEerr('') }
  const saveEdit = () => {
    if (!ef.name.trim() || !ef.address.trim() || !(Number(ef.price) > 0)) return setEerr("Nom, manzil va narxni to'g'ri kiriting")
    patchField(editId, { name: ef.name.trim(), address: ef.address.trim(), price: Number(ef.price) })
    setEditId(null)
  }
  const add = () => {
    if (!f.name.trim() || !f.address.trim() || !(Number(f.price) > 0)) return setErr("Nom, manzil va narxni to'g'ri kiriting")
    setErr('')
    upd((p) => ({ ...p, fields: [{ id: Date.now(), ownerId: me.id, name: f.name.trim(), address: f.address.trim(), price: Number(f.price), img: f.img }, ...p.fields] }))
    setF({ name: '', address: '', price: '', img: '' })
  }
  const byDay = {}
  paid.forEach((b) => { byDay[b.date] = (byDay[b.date] || 0) + (b.total || 0) })
  const dayList = [...new Set([todayStr(), ...Object.keys(byDay)])].sort().reverse()
  const dayOrders = paid.filter((b) => b.date === sel)
  const wk = weeklyTop(db, 10)
  const best = db.fields.map((x) => ({ x, r: ratingOf(db, x.id) })).filter((o) => o.r.n > 0).sort((a, b) => b.r.avg - a.r.avg || b.r.n - a.r.n).slice(0, 10)
  const todayIncome = byDay[todayStr()]

  return (
    <>
      <Hero title={<>Qabul qiluvchi <span className="gold-text">paneli</span></>} sub="Buyurtmalarni boshqaring, maydon nomi, narxi va rasmini o'zgartiring, daromad va reytingni kuzating.">
        <Tabs tab={tab} set={setTab} tabs={[['orders', 'Yangi buyurtmalar', Inbox, pending], ['fields', 'Maydonlar', Building2], ['stats', 'Daromat', Wallet], ['rating', 'Reyting', Flame]]} />
      </Hero>
      <main key={tab} className="max-w-5xl mx-auto p-4 anim-page">
        {tab === 'orders' && (
          <section className="space-y-2">
            {orders.length === 0 && <p className="text-slate-400">Hozircha buyurtma yo'q. Mijoz maydonni band qilsa, shu yerda chiqadi.</p>}
            {orders.map((b) => <OrderRow key={b.id} b={b} db={db} setStatus={setStatus} actions />)}
          </section>
        )}
        {tab === 'fields' && (
          <section className="space-y-4">
            <div className={`${card} p-4`}>
              <h2 className="text-xl font-black mb-3">Yangi maydon qo'shish</h2>
              <div className="grid sm:grid-cols-4 gap-2">
                <input className={inp} placeholder="Nomi" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                <input className={inp} placeholder="Manzil" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
                <input className={inp} placeholder="Narx (so'm/soat)" inputMode="numeric" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} />
                <button onClick={add} className={`rounded-lg py-3 flex items-center justify-center gap-2 ${gb(false)}`}><Plus size={18} />Qo'shish</button>
              </div>
              <label className={`mt-3 inline-flex items-center gap-2 cursor-pointer text-sm rounded-lg px-3 py-2 ${gb(false)}`}>
                <ImagePlus size={18} /> Rasm tanlash<input type="file" accept="image/*" className="hidden" onChange={pick} />
              </label>
              {f.img && <Img src={f.img} className="mt-2 w-40 h-24 rounded-lg anim-pop" />}
              {err && <p className="text-red-300 text-sm mt-2">{err}</p>}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-black">Barcha maydonlar ({shown.length})</h2>
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input className={inp + ' pl-9'} placeholder="Qidirish" value={fq} onChange={(e) => setFq(e.target.value)} />
              </div>
            </div>
            <p className="text-sm text-slate-400">Nom, manzil, narx yoki rasmni o'zgartirsangiz, Buyurtma beruvchida ham darhol o'zgaradi. Ko'z tugmasi maydonni ochib, baholar va buyurtmalarni ko'rsatadi.</p>
            {shown.map((x) => (editId === x.id ? (
              <div key={x.id} className={`${card} p-3 border-green-600 space-y-2 anim-pop`}>
                <div className="grid sm:grid-cols-3 gap-2">
                  <input className={inp} placeholder="Nomi" value={ef.name} onChange={(e) => setEf({ ...ef, name: e.target.value })} />
                  <input className={inp} placeholder="Manzil" value={ef.address} onChange={(e) => setEf({ ...ef, address: e.target.value })} />
                  <input className={inp} placeholder="Narx (so'm/soat)" inputMode="numeric" value={ef.price} onChange={(e) => setEf({ ...ef, price: e.target.value })} />
                </div>
                {eerr && <p className="text-red-300 text-sm">{eerr}</p>}
                <div className="flex gap-2">
                  <button onClick={saveEdit} className={`px-4 py-2 rounded-lg ${gb(false)}`}>Saqlash</button>
                  <button onClick={() => setEditId(null)} className={`px-4 py-2 rounded-lg ${gb(false)}`}>Bekor qilish</button>
                </div>
              </div>
            ) : (
              <div key={x.id} className={`${card} flex items-center justify-between gap-2 p-2 anim-up`}>
                <div className="flex items-center gap-3 min-w-0">
                  <Img src={x.img} className="w-16 h-12 rounded-lg shrink-0" />
                  <div className="min-w-0"><b className="block truncate">{x.name}</b><div className="text-xs text-slate-400 truncate">{x.address} · {som(x.price)}</div><RateTag r={ratingOf(db, x.id)} /></div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setOpenId(x.id)} className={`p-2 rounded-lg ${gb(false)}`} aria-label="Ochish"><Eye size={18} /></button>
                  <button onClick={() => startEdit(x)} className={`p-2 rounded-lg ${gb(false)}`} aria-label="Tahrirlash"><Pencil size={18} /></button>
                  <label className={`cursor-pointer p-2 rounded-lg ${gb(false)}`} aria-label="Rasmni almashtirish"><ImagePlus size={18} /><input type="file" accept="image/*" className="hidden" onChange={(e) => changeImg(x.id, e)} /></label>
                  {x.ownerId === me.id && <button onClick={() => upd((p) => ({ ...p, fields: p.fields.filter((y) => y.id !== x.id), bookings: p.bookings.filter((b) => b.fieldId !== x.id) }))} className={`p-2 rounded-lg ${gb(false)}`} aria-label="O'chirish"><Trash2 size={18} /></button>}
                </div>
              </div>
            )))}
          </section>
        )}
        {tab === 'stats' && (
          <section className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 text-black bg-gradient-to-br from-[#ffe08a] to-[#c8961e]"><div className="text-sm opacity-80">Bugungi daromat</div><div key={todayIncome} className="text-xl sm:text-2xl font-black anim-pop">{som(todayIncome)}</div></div>
              <div className="rounded-xl p-4 text-white bg-gradient-to-br from-green-600 to-green-800"><div className="text-sm opacity-90">Jami daromat</div><div key={paid.length} className="text-xl sm:text-2xl font-black anim-pop">{som(paid.reduce((s, b) => s + (b.total || 0), 0))}</div></div>
            </div>
            <p className="text-sm text-slate-400">Daromatga faqat "Qabul qilindi" va "Yakunlandi" buyurtmalar kiradi. Kunni bossangiz, o'sha kunning buyurtmalari ochiladi.</p>
            <div className="space-y-2">
              {dayList.map((d) => (
                <button key={d} onClick={() => setSel(d)} className={`w-full flex justify-between items-center rounded-lg p-3 text-left ${gb(sel === d)}`}>
                  <span>{dLabel(d)}{d === todayStr() ? ' (bugun)' : ''}</span><span>{som(byDay[d])}</span>
                </button>
              ))}
            </div>
            <h3 className="font-black">{dLabel(sel)} buyurtmalari ({dayOrders.length})</h3>
            {dayOrders.length === 0 && <p className="text-slate-400">Bu kunda qabul qilingan buyurtma yo'q.</p>}
            {dayOrders.map((b) => <OrderRow key={b.id} b={b} db={db} setStatus={setStatus} />)}
          </section>
        )}
        {tab === 'rating' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-black flex items-center gap-2 mb-3"><Flame className="text-[#f5c542]" size={22} />Haftaning eng ko'p band qilingan maydonlari</h2>
              {wk.length === 0 && <p className="text-slate-400">Oxirgi 7 kunda hali buyurtma yo'q.</p>}
              <div className="space-y-2">{wk.map(({ field: x, count }, i) => <RankRow key={x.id} i={i} x={x} db={db} delay={i * 50} extra={`${count} ta buyurtma (7 kun)`} />)}</div>
            </div>
            <div>
              <h2 className="text-xl font-black mb-3">Eng yuqori baholangan maydonlar</h2>
              {best.length === 0 && <p className="text-slate-400">Hali baho berilmagan. O'yin tugagach mijoz yulduzcha qo'yadi.</p>}
              <div className="space-y-2">{best.map(({ x, r }, i) => <RankRow key={x.id} i={i} x={x} db={db} delay={i * 50} extra={`${r.n} ta baho`} />)}</div>
            </div>
          </section>
        )}
      </main>
      {openField && <FieldModal field={openField} db={db} onClose={() => setOpenId(null)} onImg={changeImg} />}
    </>
  )
}
