import { FaPen, FaTrash, FaThumbtack } from "react-icons/fa";
import { inisial, tanggal } from "../lib/format";
import { Spinner, StatusPill, SetujuPill, Thumb, TombolIkon } from "./ui";

/* ---------- pengumuman yang disematkan ---------- */

export function Sorot({ item, onUbah, onHapus, sibuk }) {
  return (
    <article className="sorot">
      <span className="sorot__tanda">
        <FaThumbtack size={10} />
        Disematkan
      </span>

      <div>
        <h3 className="sorot__judul">{item.judul}</h3>
        <p className="sorot__isi">{item.konten}</p>

        <div className="sorot__meta">
          <span>{item.penulis_nama}</span>
          <span>{item.kategori || "Umum"}</span>
          <span className="angka">{item.jumlah_dibaca || 0}× dibaca</span>
          <span>{tanggal(item.created_at)}</span>

          <span className="sorot__aksi">
            <TombolIkon
              label={`Ubah pengumuman ${item.judul}`}
              onKlik={() => onUbah(item)}
              nonaktif={sibuk}
            >
              <FaPen size={13} />
            </TombolIkon>
            <TombolIkon
              label={`Hapus pengumuman ${item.judul}`}
              onKlik={() => onHapus(item)}
              bahaya
              nonaktif={sibuk}
            >
              {sibuk ? <Spinner size={13} /> : <FaTrash size={13} />}
            </TombolIkon>
          </span>
        </div>
      </div>

      <Thumb src={item.gambar_url} nama={item.judul} kelas="sorot__gambar" />
    </article>
  );
}

/* ---------- baris notis pengumuman ---------- */

export function BarisPengumuman({ item, onUbah, onHapus, sibuk }) {
  return (
    <article className="notis">
      <Thumb src={item.gambar_url} nama={item.judul} ukuran={48} />

      <div className="notis__isi">
        <p className="notis__judul">
          {item.is_pinned && (
            <FaThumbtack size={12} color="var(--pin)" aria-hidden="true" />
          )}
          {item.judul}
        </p>
        <p className="notis__meta">
          <span>{item.penulis_nama}</span>
          <span>{item.kategori || "Umum"}</span>
          <span>{tanggal(item.created_at)}</span>
        </p>
      </div>

      <div className="notis__kanan">
        <StatusPill nilai={item.status} />
        <span className="notis__jumlah">{item.jumlah_dibaca || 0}× dibaca</span>
        <TombolIkon
          label={`Ubah pengumuman ${item.judul}`}
          onKlik={() => onUbah(item)}
          nonaktif={sibuk}
        >
          <FaPen size={13} />
        </TombolIkon>
        <TombolIkon
          label={`Hapus pengumuman ${item.judul}`}
          onKlik={() => onHapus(item)}
          bahaya
          nonaktif={sibuk}
        >
          <FaTrash size={13} />
        </TombolIkon>
      </div>
    </article>
  );
}

/* ---------- baris komentar ---------- */

export function BarisKomentar({ item, judulPengumuman, onUbah, onHapus, sibuk }) {
  return (
    <article className="notis">
      <span className="komentar__awal" aria-hidden="true">
        {inisial(item.pengirim_nama)}
      </span>

      <div className="notis__isi">
        <p className="notis__judul">{item.pengirim_nama}</p>
        <p className="notis__meta">
          <span className="dipotong2">{item.isi_komentar}</span>
          <span>Pada: {judulPengumuman}</span>
        </p>
      </div>

      <div className="notis__kanan">
        <SetujuPill disetujui={item.is_approved} />
        <span className="notis__jumlah">{tanggal(item.created_at)}</span>
        <TombolIkon
          label={`Ubah komentar dari ${item.pengirim_nama}`}
          onKlik={() => onUbah(item)}
          nonaktif={sibuk}
        >
          <FaPen size={13} />
        </TombolIkon>
        <TombolIkon
          label={`Hapus komentar dari ${item.pengirim_nama}`}
          onKlik={() => onHapus(item)}
          bahaya
          nonaktif={sibuk}
        >
          <FaTrash size={13} />
        </TombolIkon>
      </div>
    </article>
  );
}
