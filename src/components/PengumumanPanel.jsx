import { FaImage, FaPen, FaSyncAlt, FaThumbtack, FaTrash } from "react-icons/fa";
import { metaStatus } from "../lib/format";
import { Papan } from "./layout";
import {
  CheckField,
  Field,
  Kosong,
  Rangka,
  SelectField,
  Spinner,
  StatusPill,
  Thumb,
  TombolIkon,
} from "./ui";

export function FormPengumuman({
  form,
  onField,
  editId,
  onSimpan,
  onBatal,
  sibuk,
  onBukaKategori,
  onBukaStatus,
}) {
  return (
    <form className="papan" onSubmit={onSimpan}>
      <div className="papan__kepala">
        <span className="papan__judul">
          {editId ? "Ubah pengumuman" : "Tulis pengumuman"}
        </span>
      </div>

      <div className="papan__badan">
        <Field
          label="Judul pengumuman"
          wajib
          nilai={form.judul}
          onUbah={(v) => onField("judul", v)}
          placeholder="Jadwal Ujian Akhir Semester Genap"
        />

        <Field
          label="Nama penulis"
          wajib
          nilai={form.penulis_nama}
          onUbah={(v) => onField("penulis_nama", v)}
          placeholder="Nama guru atau kepala sekolah"
        />

        <div className="form__baris">
          <SelectField
            label="Kategori"
            nilai={form.kategori}
            placeholder="Pilih kategori"
            onBuka={onBukaKategori}
          />
          <SelectField
            label="Status"
            nilai={metaStatus(form.status).label}
            placeholder="Pilih status"
            onBuka={onBukaStatus}
          />
        </div>

        <Field
          label="Isi pengumuman"
          wajib
          multiline
          nilai={form.konten}
          onUbah={(v) => onField("konten", v)}
          placeholder="Tulis rincian pengumuman lengkap…"
        />

        {editId && form.gambar_url ? (
          <p className="catatan-gambar">
            <FaImage size={15} />
            <span>
              Pengumuman ini sudah punya gambar yang tersimpan. Gambar tidak
              diubah lewat form ini.
            </span>
          </p>
        ) : null}

        <CheckField
          label="Sematkan di papan"
          catatan="Pengumuman tersemat selalu tampil paling atas di papan."
          checked={form.is_pinned}
          onUbah={(v) => onField("is_pinned", v)}
        />

        <div className="form__aksi">
          {editId && (
            <button
              type="button"
              className="tombol tombol--hantu"
              onClick={onBatal}
              disabled={sibuk}
            >
              Batal
            </button>
          )}
          <button type="submit" className="tombol tombol--utama" disabled={sibuk}>
            {sibuk ? (
              <>
                <Spinner />
                Menyimpan…
              </>
            ) : editId ? (
              "Simpan perubahan"
            ) : (
              "Publikasikan"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export function TabelPengumuman({
  daftar,
  memuat,
  onUbah,
  onHapus,
  menghapusId,
  onMuatUlang,
}) {
  return (
    <Papan
      judul={`Daftar pengumuman (${daftar.length})`}
      aksi={
        <TombolIkon label="Muat ulang daftar" onKlik={onMuatUlang}>
          <FaSyncAlt size={15} />
        </TombolIkon>
      }
      telanjang
    >
      {memuat ? (
        <Rangka baris={5} pesan="Memuat daftar pengumuman" />
      ) : daftar.length === 0 ? (
        <Kosong
          judul="Belum ada pengumuman"
          catatan="Tulis pengumuman pertama di form di samping untuk mulai mengisi papan."
        />
      ) : (
        <div className="tabel__bungkus">
          <table className="tabel">
            <thead>
              <tr>
                <th scope="col" className="sembunyi-900">
                  Gambar
                </th>
                <th scope="col">Judul</th>
                <th scope="col" className="sembunyi-900">
                  Penulis
                </th>
                <th scope="col" className="sembunyi-680">
                  Kategori
                </th>
                <th scope="col" className="sembunyi-900">
                  Dibaca
                </th>
                <th scope="col" className="sembunyi-900">
                  Semat
                </th>
                <th scope="col">Status</th>
                <th scope="col" className="tabel__aksi">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((item) => (
                <tr key={item.id}>
                  <td className="sembunyi-900">
                    <Thumb src={item.gambar_url} nama={item.judul} ukuran={40} />
                  </td>
                  <td className="tabel__tebal">
                    <span className="potong">{item.judul}</span>
                  </td>
                  <td className="sembunyi-900">
                    <span className="potong">{item.penulis_nama}</span>
                  </td>
                  <td className="sembunyi-680">{item.kategori || "Umum"}</td>
                  <td className="sembunyi-900 angka">
                    {item.jumlah_dibaca || 0}×
                  </td>
                  <td className="sembunyi-900">
                    {item.is_pinned ? (
                      <FaThumbtack size={13} color="var(--pin)" aria-label="Disematkan" />
                    ) : (
                      <span className="angka">—</span>
                    )}
                  </td>
                  <td>
                    <StatusPill nilai={item.status} />
                  </td>
                  <td className="tabel__aksi">
                    <span className="aksi-seri">
                      <TombolIkon
                        label={`Ubah pengumuman ${item.judul}`}
                        onKlik={() => onUbah(item)}
                        nonaktif={menghapusId !== null}
                      >
                        <FaPen size={13} />
                      </TombolIkon>
                      <TombolIkon
                        label={`Hapus pengumuman ${item.judul}`}
                        onKlik={() => onHapus(item)}
                        bahaya
                        nonaktif={menghapusId !== null}
                      >
                        {menghapusId === item.id ? (
                          <Spinner size={13} />
                        ) : (
                          <FaTrash size={13} />
                        )}
                      </TombolIkon>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Papan>
  );
}
