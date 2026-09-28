/* =============================================================
   Akses data — Supabase REST API
   ============================================================= */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const terkonfigurasi = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const kepala = (tambahan = {}) => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  ...tambahan,
});

const bacaGalat = async (respons) => {
  let pesan = `Permintaan gagal (HTTP ${respons.status}).`;
  try {
    const data = await respons.json();
    if (data?.message) pesan = data.message;
    if (data?.hint) pesan = `${pesan} — ${data.hint}`;
  } catch {
    /* badan bukan JSON, pakai pesan bawaan */
  }
  return pesan;
};

const minta = async (jalur, opsi = {}) => {
  const respons = await fetch(`${SUPABASE_URL}/rest/v1/${jalur}`, {
    ...opsi,
    headers: kepala(opsi.headers),
  });

  if (!respons.ok) throw new Error(await bacaGalat(respons));
  if (respons.status === 204) return null;

  const teks = await respons.text();
  return teks ? JSON.parse(teks) : null;
};

const tulis = (badan) => ({
  method: "POST",
  headers: { Prefer: "return=minimal" },
  body: JSON.stringify(badan),
});

/* ---------- pengumuman ---------- */

export const ambilPengumuman = () =>
  minta("pengumuman?select=*&order=created_at.desc");

export const buatPengumuman = (muatan) =>
  minta("pengumuman", tulis(muatan));

export const ubahPengumuman = (id, muatan) =>
  minta(`pengumuman?id=eq.${id}`, { ...tulis(muatan), method: "PATCH" });

export const hapusPengumuman = (id) =>
  minta(`pengumuman?id=eq.${id}`, { method: "DELETE" });

/* ---------- komentar ---------- */

export const ambilKomentar = () =>
  minta("komentar?select=*&order=created_at.desc");

export const buatKomentar = (muatan) => minta("komentar", tulis(muatan));

export const ubahKomentar = (id, muatan) =>
  minta(`komentar?id=eq.${id}`, { ...tulis(muatan), method: "PATCH" });

export const hapusKomentar = (id) =>
  minta(`komentar?id=eq.${id}`, { method: "DELETE" });
