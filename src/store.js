// Serversiz ma'lumotlar ombori: hammasi brauzer localStorage'da saqlanadi (Ctrl+R qilganda ham o'chmaydi).
import { FIELDS } from './data/fields.js'
const K = 'maydon_db_v4'
const demo = { id: 1, name: 'Mijoz', phone: '900000001', password: 'demo123', role: 'customer' }
const rd = (k) => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } }
export const save = (d) => { try { localStorage.setItem(K, JSON.stringify(d)) } catch { alert("Xotira to'ldi: rasm hajmi katta bo'lishi mumkin") } }
// Tayyor maydonlar har doim fayldan olinadi, o'zgartirishlar (edits) ustiga qo'llanadi
const fix = (d) => ({
  ...d,
  users: d.users.map((u) => ({ ...u, role: u.role === 'owner' ? 'owner' : 'customer' })),
  edits: d.edits || {},
  ratings: d.ratings || [],
  fields: [...d.fields.filter((f) => f.id > 1000), ...FIELDS.map((f) => ({ ...f, ...(d.edits?.[f.id] || {}) }))],
})
export const load = () => {
  const d = rd(K)
  if (d) return fix(d)
  const old = rd('maydon_db_v3') || rd('maydon_db_v2') || rd('maydon_db') || {}
  const users = [...(old.users || [])]
  if (!users.some((u) => u.phone === demo.phone)) users.push(demo)
  const all = [...FIELDS, ...(old.fields || [])]
  const bookings = (old.bookings || []).filter((b) => /^20\d\d-/.test(b.date)).map((b) => ({
    ...b, hours: b.hours || 1, status: b.status === 'tasdiqlandi' ? 'qabul' : b.status,
    total: b.total ?? (all.find((f) => f.id === b.fieldId)?.price || 0),
  }))
  const n = fix({ users, edits: old.edits || {}, ratings: old.ratings || [], fields: old.fields || [], bookings })
  save(n)
  return n
}
// Kirgan foydalanuvchi har bir oynada (tab) alohida saqlanadi: Ctrl+R qilganda rol almashib ketmaydi
export const getMe = () => { try { return JSON.parse(sessionStorage.getItem('maydon_me')) } catch { return null } }
export const setMe = (id) => { try { id ? sessionStorage.setItem('maydon_me', JSON.stringify(id)) : sessionStorage.removeItem('maydon_me') } catch {} }
