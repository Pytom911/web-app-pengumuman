/* =============================================================
   Format & konstanta tampilan
   ============================================================= */

export const KATEGORI = [
  "Umum",
  "Akademik",
  "Kegiatan",
  "Penting",
  "Prestasi",
  "Rapat",
];

export const OPSI_STATUS = [
  { kunci: "published", label: "Published", catatan: "Tampil di papan" },
  { kunci: "draft", label: "Draft", catatan: "Konsep, belum tayang" },
  { kunci: "archived", label: "Archived", catatan: "Diarsipkan" },
];

const META_STATUS = {
  published: { label: "Published", nada: "hijau" },
  draft: { label: "Draft", nada: "kuning" },
  archived: { label: "Archived", nada: "abu" },
};

export const metaStatus = (nilai) => {
  const kunci = String(nilai ?? "published").toLowerCase();
  return META_STATUS[kunci] ?? { label: nilai || "published", nada: "abu" };
};

export const metaKomentar = (disetujui) =>
  disetujui ? { label: "Disetujui", nada: "hijau" } : { label: "Menunggu", nada: "kuning" };

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const BULAN_SINGKAT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const keTanggal = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const tanggal = (iso) => {
  const d = keTanggal(iso);
  if (!d) return "—";
  return `${d.getDate()} ${BULAN_SINGKAT[d.getMonth()]} ${d.getFullYear()}`;
};

export const tanggalPanjang = (iso) => {
  const d = keTanggal(iso);
  if (!d) return "—";
  const jam = String(d.getHours()).padStart(2, "0");
  const menit = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}, ${jam}.${menit}`;
};

export const inisial = (nama) => {
  const bersih = String(nama ?? "").trim();
  if (!bersih) return "?";
  const kata = bersih.split(/\s+/).filter(Boolean);
  if (kata.length > 1) {
    return (kata[0][0] + kata[kata.length - 1][0]).toUpperCase();
  }
  return kata[0].slice(0, 2).toUpperCase();
};

export const potong = (teks, batas) => {
  const bersih = String(teks ?? "").trim();
  if (bersih.length <= batas) return bersih;
  return `${bersih.slice(0, batas - 1).trimEnd()}…`;
};

export const keAtas = () => {
  const halus = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: halus ? "smooth" : "auto" });
};
