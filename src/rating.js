// Baho va reyting hisob-kitoblari
export const ratingOf = (db, fid) => {
  const r = db.ratings.filter((x) => x.fieldId === fid)
  return { n: r.length, avg: r.length ? r.reduce((s, x) => s + x.stars, 0) / r.length : 0 }
}
export const bookingRating = (db, bid) => db.ratings.find((x) => x.bookingId === bid)
export const endMs = (b) => { const [y, m, d] = b.date.split('-').map(Number); return new Date(y, m - 1, d, b.hour + b.hours, 0, 0).getTime() }
// O'yin tugagan: egasi "Yakunlandi" qilgan yoki qabul qilingan buyurtma vaqti o'tib ketgan
export const canRate = (b) => b.status === 'yakunlandi' || (b.status === 'qabul' && Date.now() >= endMs(b))
// So'nggi 7 kunda eng ko'p band qilingan maydonlar
export const weeklyTop = (db, n = 10) => {
  const since = Date.now() - 7 * 864e5
  const c = {}
  db.bookings.forEach((b) => { if (b.status !== 'rad' && (b.at || Date.parse(b.date)) >= since) c[b.fieldId] = (c[b.fieldId] || 0) + 1 })
  return Object.entries(c)
    .map(([id, count]) => ({ field: db.fields.find((f) => f.id === Number(id)), count }))
    .filter((x) => x.field)
    .sort((a, b) => b.count - a.count || ratingOf(db, b.field.id).avg - ratingOf(db, a.field.id).avg)
    .slice(0, n)
}
