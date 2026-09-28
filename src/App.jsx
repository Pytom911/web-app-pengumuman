import { useEffect, useState } from "react";
import {
  FaBullhorn,
  FaCheck,
  FaComments,
  FaHome,
  FaSyncAlt,
  FaUsers,
} from "react-icons/fa";
import {
  ambilKomentar,
  ambilPengumuman,
  buatKomentar,
  buatPengumuman,
  hapusKomentar,
  hapusPengumuman,
  terkonfigurasi,
  ubahKomentar,
  ubahPengumuman,
} from "./lib/api";
import { KATEGORI, OPSI_STATUS, keAtas } from "./lib/format";
import { Konfirmasi, Masthead, Nav, Papan, Sheet } from "./components/layout";
import { Alert, Kosong, Rangka, Ringkasan, TombolIkon } from "./components/ui";
import { BarisKomentar, BarisPengumuman, Sorot } from "./components/board";
import { FormPengumuman, TabelPengumuman } from "./components/PengumumanPanel";
import { FormKomentar, TabelKomentar } from "./components/KomentarPanel";
import { TimGrid } from "./components/TeamGrid";

const TABS = [
  { kunci: "papan", label: "Papan", ikon: FaHome },
  { kunci: "pengumuman", label: "Pengumuman", ikon: FaBullhorn },
  { kunci: "komentar", label: "Komentar", ikon: FaComments },
  { kunci: "tim", label: "Tim", ikon: FaUsers },
];

const FORM_P = {
  judul: "",
  konten: "",
  kategori: "Umum",
  status: "published",
  penulis_nama: "",
  gambar_url: "",
  is_pinned: false,
};

const FORM_K = {
  pengumuman_id: "",
  pengirim_nama: "",
  pengirim_email: "",
  isi_komentar: "",
  is_approved: true,
};

const BATAS_PAPAN = 6;

export default function App() {
  const [tab, setTab] = useState("papan");
  const [pengumuman, setPengumuman] = useState([]);
  const [komentar, setKomentar] = useState([]);
  const [memuat, setMemuat] = useState({ pengumuman: true, komentar: true });
  const [suapan, setSuapan] = useState(null);
  const [sibuk, setSibuk] = useState(false);
  const [menghapus, setMenghapus] = useState(null);
  const [konfirmasi, setKonfirmasi] = useState(null);
  const [sheet, setSheet] = useState(null);

  const [formP, setFormP] = useState(FORM_P);
  const [editP, setEditP] = useState(null);
  const [formK, setFormK] = useState(FORM_K);
  const [editK, setEditK] = useState(null);

  /* ---------- pemuatan data ---------- */

  useEffect(() => {
    if (!terkonfigurasi) return;

    let batal = false;

    const awal = async () => {
      try {
        const [p, k] = await Promise.all([ambilPengumuman(), ambilKomentar()]);
        if (batal) return;
        setPengumuman(p);
        setKomentar(k);
      } catch (err) {
        if (batal) return;
        setSuapan({ nada: "galat", judul: "Gagal memuat data", pesan: err.message });
      } finally {
        if (!batal) setMemuat({ pengumuman: false, komentar: false });
      }
    };

    awal();

    return () => {
      batal = true;
    };
  }, []);

  const muatUlang = async (senyap = false) => {
    if (!terkonfigurasi) return;
    if (!senyap) setMemuat({ pengumuman: true, komentar: true });
    try {
      const [p, k] = await Promise.all([ambilPengumuman(), ambilKomentar()]);
      setPengumuman(p);
      setKomentar(k);
    } catch (err) {
      setSuapan({ nada: "galat", judul: "Gagal memuat data", pesan: err.message });
    } finally {
      if (!senyap) setMemuat({ pengumuman: false, komentar: false });
    }
  };

  const pilihTab = (kunci) => {
    setTab(kunci);
    setSuapan(null);
  };

  /* ---------- pengumuman ---------- */

  const ubahFieldP = (kunci, nilai) =>
    setFormP((p) => ({ ...p, [kunci]: nilai }));

  const resetFormP = () => {
    setFormP(FORM_P);
    setEditP(null);
  };

  const mulaiUbahPengumuman = (item) => {
    setEditP(item.id);
    setFormP({
      judul: item.judul ?? "",
      konten: item.konten ?? "",
      kategori: item.kategori || "Umum",
      status: item.status || "published",
      penulis_nama: item.penulis_nama ?? "",
      gambar_url: item.gambar_url ?? "",
      is_pinned: Boolean(item.is_pinned),
    });
    setSuapan(null);
    setTab("pengumuman");
    keAtas();
  };

  const simpanPengumuman = async (event) => {
    event.preventDefault();

    if (!formP.judul.trim() || !formP.konten.trim() || !formP.penulis_nama.trim()) {
      setSuapan({
        nada: "galat",
        judul: "Lengkapi isian wajib",
        pesan: "Judul, nama penulis, dan isi pengumuman wajib diisi.",
      });
      return;
    }

    setSibuk(true);
    setSuapan(null);

    const muatan = {
      judul: formP.judul.trim(),
      konten: formP.konten.trim(),
      kategori: formP.kategori || "Umum",
      status: formP.status || "published",
      penulis_nama: formP.penulis_nama.trim(),
      // gambar_url diteruskan apa adanya: field gambar tidak diedit dari form ini
      gambar_url: formP.gambar_url?.trim() || null,
      is_pinned: formP.is_pinned,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editP) await ubahPengumuman(editP, muatan);
      else await buatPengumuman(muatan);

      setSuapan({
        nada: "sukses",
        judul: editP ? "Pengumuman diperbarui" : "Pengumuman dipublikasikan",
        pesan: muatan.judul,
      });
      resetFormP();
      await muatUlang(true);
    } catch (err) {
      setSuapan({
        nada: "galat",
        judul: "Gagal menyimpan pengumuman",
        pesan: err.message,
      });
    } finally {
      setSibuk(false);
    }
  };

  const mintaHapusPengumuman = (item) => {
    const jumlah = komentar.filter((k) => k.pengumuman_id === item.id).length;

    setKonfirmasi({
      judul: "Hapus pengumuman?",
      pesan: jumlah
        ? `Pengumuman “${item.judul}” akan dihapus bersama ${jumlah} komentar yang menempel padanya.`
        : `Pengumuman “${item.judul}” akan dihapus permanen.`,
      label: "Hapus pengumuman",
      jalankan: () => jalankanHapusPengumuman(item.id),
    });
  };

  const jalankanHapusPengumuman = async (id) => {
    setKonfirmasi(null);
    setMenghapus(id);
    setSuapan(null);

    try {
      await hapusPengumuman(id);
      if (editP === id) resetFormP();
      setSuapan({ nada: "sukses", judul: "Pengumuman dihapus" });
      await muatUlang(true);
    } catch (err) {
      setSuapan({
        nada: "galat",
        judul: "Gagal menghapus pengumuman",
        pesan: err.message,
      });
    } finally {
      setMenghapus(null);
    }
  };

  /* ---------- komentar ---------- */

  const ubahFieldK = (kunci, nilai) =>
    setFormK((k) => ({ ...k, [kunci]: nilai }));

  const resetFormK = () => {
    setFormK(FORM_K);
    setEditK(null);
  };

  const mulaiUbahKomentar = (item) => {
    setEditK(item.id);
    setFormK({
      pengumuman_id: item.pengumuman_id || "",
      pengirim_nama: item.pengirim_nama ?? "",
      pengirim_email: item.pengirim_email ?? "",
      isi_komentar: item.isi_komentar ?? "",
      is_approved: item.is_approved ?? true,
    });
    setSuapan(null);
    setTab("komentar");
    keAtas();
  };

  const simpanKomentar = async (event) => {
    event.preventDefault();

    if (
      !formK.pengumuman_id ||
      !formK.pengirim_nama.trim() ||
      !formK.isi_komentar.trim()
    ) {
      setSuapan({
        nada: "galat",
        judul: "Lengkapi isian wajib",
        pesan: "Pilih pengumuman tujuan, isi nama pengirim dan isi komentar.",
      });
      return;
    }

    setSibuk(true);
    setSuapan(null);

    const muatan = {
      pengumuman_id: formK.pengumuman_id,
      pengirim_nama: formK.pengirim_nama.trim(),
      pengirim_email: formK.pengirim_email.trim() || null,
      isi_komentar: formK.isi_komentar.trim(),
      is_approved: formK.is_approved,
    };

    try {
      if (editK) await ubahKomentar(editK, muatan);
      else await buatKomentar(muatan);

      setSuapan({
        nada: "sukses",
        judul: editK ? "Komentar diperbarui" : "Komentar terkirim",
      });
      resetFormK();
      await muatUlang(true);
    } catch (err) {
      setSuapan({
        nada: "galat",
        judul: "Gagal menyimpan komentar",
        pesan: err.message,
      });
    } finally {
      setSibuk(false);
    }
  };

  const mintaHapusKomentar = (item) => {
    setKonfirmasi({
      judul: "Hapus komentar?",
      pesan: `Komentar dari “${item.pengirim_nama}” akan dihapus permanen.`,
      label: "Hapus komentar",
      jalankan: () => jalankanHapusKomentar(item.id),
    });
  };

  const jalankanHapusKomentar = async (id) => {
    setKonfirmasi(null);
    setMenghapus(id);
    setSuapan(null);

    try {
      await hapusKomentar(id);
      if (editK === id) resetFormK();
      setSuapan({ nada: "sukses", judul: "Komentar dihapus" });
      await muatUlang(true);
    } catch (err) {
      setSuapan({
        nada: "galat",
        judul: "Gagal menghapus komentar",
        pesan: err.message,
      });
    } finally {
      setMenghapus(null);
    }
  };

  /* ---------- data turunan ---------- */

  const judulPengumuman = (id) =>
    pengumuman.find((p) => p.id === id)?.judul ?? "Pengumuman tidak ditemukan";

  const terpin = pengumuman.find((p) => p.is_pinned);
  const lainnya = pengumuman.filter((p) => !p.is_pinned);
  const komentarSiap = komentar.map((k) => ({
    ...k,
    pengumuman: judulPengumuman(k.pengumuman_id),
  }));

  const terbit = pengumuman.filter(
    (p) => (p.status || "").toLowerCase() === "published",
  ).length;
  const disemat = pengumuman.filter((p) => p.is_pinned).length;

  /* ---------- tampilan ---------- */

  return (
    <div className="aplikasi">
      <a className="lewati" href="#isi">
        Lewati ke konten
      </a>

      <div className="rangkai">
        <Nav tabs={TABS} aktif={tab} onPilih={pilihTab} />

        <div className="sisi">
          <Masthead />

          <main className="utama" id="isi" tabIndex={-1}>
            {!terkonfigurasi && (
              <div className="suapan">
                <Alert
                  nada="galat"
                  judul="Supabase belum dikonfigurasi"
                  pesan="Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env, lalu jalankan ulang npm run dev."
                />
              </div>
            )}

            {suapan && (
              <div className="suapan">
                <Alert
                  nada={suapan.nada}
                  judul={suapan.judul}
                  pesan={suapan.pesan}
                  onTutup={() => setSuapan(null)}
                />
              </div>
            )}

            {tab === "papan" && (
              <div className="portion">
                <Ringkasan
                  sel={[
                    { label: "Total pengumuman", angka: pengumuman.length },
                    { label: "Published", angka: terbit },
                    { label: "Disematkan", angka: disemat, nada: "pin" },
                    { label: "Komentar", angka: komentar.length },
                  ]}
                />

                {terpin && (
                  <Sorot
                    item={terpin}
                    onUbah={mulaiUbahPengumuman}
                    onHapus={mintaHapusPengumuman}
                    sibuk={menghapus === terpin.id}
                  />
                )}

                <Papan
                  judul={`Pengumuman di papan (${lainnya.length})`}
                  aksi={
                    <TombolIkon
                      label="Muat ulang papan"
                      onKlik={() => muatUlang()}
                    >
                      <FaSyncAlt size={15} />
                    </TombolIkon>
                  }
                  telanjang
                >
                  {memuat.pengumuman ? (
                    <Rangka baris={4} pesan="Memuat pengumuman" />
                  ) : lainnya.length === 0 ? (
                    <Kosong
                      judul="Papan masih kosong"
                      catatan="Sematkan satu pengumuman agar muncul besar di bagian atas papan."
                    />
                  ) : (
                    lainnya
                      .slice(0, BATAS_PAPAN)
                      .map((item) => (
                        <BarisPengumuman
                          key={item.id}
                          item={item}
                          onUbah={mulaiUbahPengumuman}
                          onHapus={mintaHapusPengumuman}
                          sibuk={menghapus === item.id}
                        />
                      ))
                  )}

                  {!memuat.pengumuman && lainnya.length > BATAS_PAPAN && (
                    <div className="papan__kaki">
                      <button
                        type="button"
                        className="tombol tombol--hantu"
                        onClick={() => pilihTab("pengumuman")}
                      >
                        Lihat semua pengumuman
                      </button>
                    </div>
                  )}
                </Papan>

                <Papan judul="Komentar terbaru" telanjang>
                  {memuat.komentar ? (
                    <Rangka baris={4} pesan="Memuat komentar" />
                  ) : komentarSiap.length === 0 ? (
                    <Kosong
                      judul="Belum ada komentar"
                      catatan="Komentar masuk akan dimoderasi di tab Komentar."
                    />
                  ) : (
                    komentarSiap.slice(0, 5).map((item) => (
                      <BarisKomentar
                        key={item.id}
                        item={item}
                        judulPengumuman={item.pengumuman}
                        onUbah={mulaiUbahKomentar}
                        onHapus={mintaHapusKomentar}
                        sibuk={menghapus === item.id}
                      />
                    ))
                  )}
                </Papan>
              </div>
            )}

            {tab === "pengumuman" && (
              <div className="bilah bilah--samping">
                <FormPengumuman
                  form={formP}
                  onField={ubahFieldP}
                  editId={editP}
                  onSimpan={simpanPengumuman}
                  onBatal={resetFormP}
                  sibuk={sibuk}
                  onBukaKategori={() => setSheet("kategori")}
                  onBukaStatus={() => setSheet("status")}
                />
                <TabelPengumuman
                  daftar={pengumuman}
                  memuat={memuat.pengumuman}
                  onUbah={mulaiUbahPengumuman}
                  onHapus={mintaHapusPengumuman}
                  menghapusId={menghapus}
                  onMuatUlang={() => muatUlang()}
                />
              </div>
            )}

            {tab === "komentar" && (
              <div className="bilah bilah--samping">
                <FormKomentar
                  form={formK}
                  onField={ubahFieldK}
                  editId={editK}
                  onSimpan={simpanKomentar}
                  onBatal={resetFormK}
                  sibuk={sibuk}
                  judulTerpilih={
                    formK.pengumuman_id
                      ? judulPengumuman(formK.pengumuman_id)
                      : ""
                  }
                  onBukaDaftar={() => setSheet("pengumuman")}
                />
                <TabelKomentar
                  daftar={komentarSiap}
                  memuat={memuat.komentar}
                  onUbah={mulaiUbahKomentar}
                  onHapus={mintaHapusKomentar}
                  menghapusId={menghapus}
                  onMuatUlang={() => muatUlang()}
                />
              </div>
            )}

            {tab === "tim" && (
              <div className="portion">
                <TimGrid />
              </div>
            )}
          </main>
        </div>
      </div>

      {sheet === "kategori" && (
        <Sheet buka judul="Pilih kategori" onTutup={() => setSheet(null)}>
          <div className="sheet__badan">
            {KATEGORI.map((item) => (
              <button
                key={item}
                type="button"
                className={`sheet__opsi${
                  formP.kategori === item ? " sheet__opsi--dipilih" : ""
                }`}
                onClick={() => {
                  ubahFieldP("kategori", item);
                  setSheet(null);
                }}
              >
                <span className="sheet__opsi-nilai">{item}</span>
                {formP.kategori === item && (
                  <FaCheck className="sheet__opsi-kanan" size={16} />
                )}
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {sheet === "status" && (
        <Sheet buka judul="Status publikasi" onTutup={() => setSheet(null)}>
          <div className="sheet__badan">
            {OPSI_STATUS.map((item) => (
              <button
                key={item.kunci}
                type="button"
                className={`sheet__opsi${
                  formP.status === item.kunci ? " sheet__opsi--dipilih" : ""
                }`}
                onClick={() => {
                  ubahFieldP("status", item.kunci);
                  setSheet(null);
                }}
              >
                <span>
                  <span className="sheet__opsi-nilai">{item.label}</span>
                  <span className="sheet__opsi-catatan">{item.catatan}</span>
                </span>
                {formP.status === item.kunci && (
                  <FaCheck className="sheet__opsi-kanan" size={16} />
                )}
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {sheet === "pengumuman" && (
        <Sheet
          buka
          judul="Pilih pengumuman tujuan"
          onTutup={() => setSheet(null)}
        >
          <div className="sheet__badan">
            {pengumuman.length === 0 ? (
              <Kosong
                judul="Belum ada pengumuman"
                catatan="Buat pengumuman dulu di tab Pengumuman."
              />
            ) : (
              pengumuman.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`sheet__opsi${
                    formK.pengumuman_id === item.id
                      ? " sheet__opsi--dipilih"
                      : ""
                  }`}
                  onClick={() => {
                    ubahFieldK("pengumuman_id", item.id);
                    setSheet(null);
                  }}
                >
                  <span>
                    <span className="sheet__opsi-nilai">{item.judul}</span>
                    <span className="sheet__opsi-meta">
                      <span>{item.penulis_nama}</span>
                      <span>{item.kategori || "Umum"}</span>
                    </span>
                  </span>
                  {formK.pengumuman_id === item.id && (
                    <FaCheck className="sheet__opsi-kanan" size={16} />
                  )}
                </button>
              ))
            )}
          </div>
        </Sheet>
      )}

      {konfirmasi && (
        <Konfirmasi
          buka
          judul={konfirmasi.judul}
          pesan={konfirmasi.pesan}
          label={konfirmasi.label}
          sibuk={sibuk}
          onJalankan={konfirmasi.jalankan}
          onTutup={() => setKonfirmasi(null)}
        />
      )}
    </div>
  );
}
