import { renderToString } from "react-dom/server";
import App from "./src/App.jsx";
import { Sorot, BarisPengumuman, BarisKomentar } from "./src/components/board";
import { TabelPengumuman, FormPengumuman } from "./src/components/PengumumanPanel";

/* Data nyata dari Supabase, hasil baca 14:00 */
const TERPIN = {
  id: "a73d214e-60e1-4ffb-a3ed-6e66b84b7f7a",
  judul: "Jadwal Ujian Akhir Semester Genap",
  konten:
    "Pelaksanaan UAS Genap akan dimulai tanggal 8 Juni 2026. Seluruh siswa diimbau menyelesaikannya tepat waktu.",
  kategori: "Akademik",
  status: "published",
  penulis_nama: "Kurikulum",
  gambar_url: null,
  is_pinned: true,
  jumlah_dibaca: 180,
  created_at: "2026-07-27T06:28:12.928307+00:00",
};

const GAMBAR_MATI = {
  ...TERPIN,
  id: "d310d312-48de-4661-b02f-8dfeaa079c6c",
  judul: "Juara 1 Lomba Robotik Tingkat Nasional",
  kategori: "Prestasi",
  penulis_nama: "Pembina Ekskul",
  gambar_url: "https://example.com/images/juara-robotik.jpg",
  is_pinned: false,
  jumlah_dibaca: 95,
};

const KOMENTAR = {
  id: "8474180a-d00b-441b-8c77-3a34b1753085",
  pengumuman_id: TERPIN.id,
  pengirim_nama: "Rizky Pratama",
  pengirim_email: "rizky.p@gmail.com",
  isi_komentar: "Apakah kartu ujian sudah bisa dicetak lewat portal siswa?",
  is_approved: true,
  created_at: "2026-07-27T06:28:12.928307+00:00",
  pengumuman: TERPIN.judul,
};

const tanpaOp = () => () => {};

/* React SSR menyisipkan <!-- --> di antara node teks bertetangga */
const bersihkan = (html) => html.replaceAll("<!-- -->", "");

const uji = (nama, html, harusAda, harusTidak = []) => {
  const bersih = bersihkan(html);
  const kurang = harusAda.filter((t) => !bersih.includes(t));
  const lebih = harusTidak.filter((t) => bersih.includes(t));
  console.log(
    `${nama}: ${kurang.length === 0 && lebih.length === 0 ? "OK" : "GAGAL"}` +
      (kurang.length ? ` | kurang: ${kurang.join(" , ")}` : "") +
      (lebih.length ? ` | dilarang ada: ${lebih.join(" , ")}` : ""),
  );
};

uji("aplikasi", renderToString(<App />), [
  "App Data Pengumuman",
  "Total pengumuman",
  "Memuat pengumuman",
]);

uji("sorot (pinned)", renderToString(
  <Sorot item={TERPIN} onUbah={tanpaOp} onHapus={tanpaOp} sibuk={false} />,
), [
  "Disematkan",
  "Jadwal Ujian Akhir Semester Genap",
  "Kurikulum",
  "180× dibaca",
  "27 Jul 2026",
  "gambar__awal",
], ["gambar__isi"]);

uji("baris + gambar mati", renderToString(
  <BarisPengumuman item={GAMBAR_MATI} onUbah={tanpaOp} onHapus={tanpaOp} sibuk={false} />,
), [
  "Juara 1 Lomba Robotik Tingkat Nasional",
  "example.com",
  "gambar__isi",
  'loading="lazy"',
], []);

uji("tabel", renderToString(
  <TabelPengumuman
    daftar={[TERPIN, GAMBAR_MATI]}
    memuat={false}
    onUbah={tanpaOp}
    onHapus={tanpaOp}
    menghapusId={null}
    onMuatUlang={tanpaOp}
  />,
), [
  "<table",
  "Daftar pengumuman (2)",
  "scope=\"col\"",
  "180×",
  "95×",
  "Kurikulum",
  "Pembina Ekskul",
  "Prestasi",
  "Disematkan",
]);

uji("baris komentar", renderToString(
  <BarisKomentar
    item={KOMENTAR}
    judulPengumuman={KOMENTAR.pengumuman}
    onUbah={tanpaOp}
    onHapus={tanpaOp}
    sibuk={false}
  />,
), [
  "Rizky Pratama",
  "Apakah kartu ujian",
  "Pada: Jadwal Ujian Akhir Semester Genap",
  "Disetujui",
]);

const form = renderToString(
  <FormPengumuman
    form={{
      judul: "x",
      konten: "y",
      kategori: "Rapat",
      status: "published",
      penulis_nama: "z",
      gambar_url: "https://contoh/gambar.jpg",
      is_pinned: false,
    }}
    onField={tanpaOp}
    editId={TERPIN.id}
    onSimpan={tanpaOp}
    onBatal={tanpaOp}
    sibuk={false}
    onBukaKategori={tanpaOp}
    onBukaStatus={tanpaOp}
  />,
);

uji(
  "form (mode ubah)",
  form,
  ["Ubah pengumuman", "Rapat", "Simpan perubahan", "Sematkan di papan"],
  ["gambar__isi", 'type="file"', "URL Gambar", 'name="gambar'],
);

console.log(
  bersihkan(form).includes("sudah punya gambar yang tersimpan")
    ? "form: catatan gambar lama tampil (read-only, tanpa input)"
    : "form: catatan gambar lama TIDAK tampil",
);
console.log(
  /<input[^>]*gambar/i.test(form) || /<textarea[^>]*gambar/i.test(form)
    ? "PERINGATAN: masih ada kontrol input untuk gambar"
    : "form: tidak ada satu pun kontrol input gambar",
);
