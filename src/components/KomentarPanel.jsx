import { FaPen, FaSyncAlt, FaTrash } from "react-icons/fa";
import { Papan } from "./layout";
import {
  CheckField,
  Field,
  Kosong,
  Rangka,
  SelectField,
  SetujuPill,
  Spinner,
  TombolIkon,
} from "./ui";

export function FormKomentar({
  form,
  onField,
  editId,
  onSimpan,
  onBatal,
  sibuk,
  judulTerpilih,
  onBukaDaftar,
}) {
  return (
    <form className="papan" onSubmit={onSimpan}>
      <div className="papan__kepala">
        <span className="papan__judul">
          {editId ? "Ubah komentar" : "Tulis komentar"}
        </span>
      </div>

      <div className="papan__badan">
        <SelectField
          label="Pengumuman tujuan"
          nilai={judulTerpilih}
          placeholder="Pilih pengumuman"
          onBuka={onBukaDaftar}
        />

        <Field
          label="Nama pengirim"
          wajib
          nilai={form.pengirim_nama}
          onUbah={(v) => onField("pengirim_nama", v)}
          placeholder="Nama siswa atau tamu"
        />

        <Field
          label="Email pengirim"
          type="email"
          nilai={form.pengirim_email}
          onUbah={(v) => onField("pengirim_email", v)}
          placeholder="email@contoh.com"
        />

        <Field
          label="Isi komentar"
          wajib
          multiline
          nilai={form.isi_komentar}
          onUbah={(v) => onField("isi_komentar", v)}
          placeholder="Tulis komentar atau masukan…"
        />

        <CheckField
          label="Setujui komentar"
          catatan="Komentar yang belum disetujui menunggu moderator."
          checked={form.is_approved}
          onUbah={(v) => onField("is_approved", v)}
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
              "Kirim komentar"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export function TabelKomentar({
  daftar,
  memuat,
  onUbah,
  onHapus,
  menghapusId,
  onMuatUlang,
}) {
  return (
    <Papan
      judul={`Daftar komentar (${daftar.length})`}
      aksi={
        <TombolIkon label="Muat ulang daftar" onKlik={onMuatUlang}>
          <FaSyncAlt size={15} />
        </TombolIkon>
      }
      telanjang
    >
      {memuat ? (
        <Rangka baris={5} pesan="Memuat daftar komentar" />
      ) : daftar.length === 0 ? (
        <Kosong
          judul="Belum ada komentar"
          catatan="Komentar yang masuk akan tampil di sini untuk dimoderasi."
        />
      ) : (
        <div className="tabel__bungkus">
          <table className="tabel">
            <thead>
              <tr>
                <th scope="col">Pengirim</th>
                <th scope="col" className="sembunyi-900">
                  Email
                </th>
                <th scope="col">Isi komentar</th>
                <th scope="col" className="sembunyi-900">
                  Pengumuman
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
                  <td className="tabel__tebal">
                    <span className="potong">{item.pengirim_nama}</span>
                  </td>
                  <td className="sembunyi-900">
                    <span className="potong">{item.pengirim_email || "—"}</span>
                  </td>
                  <td>
                    <span className="dipotong2">{item.isi_komentar}</span>
                  </td>
                  <td className="sembunyi-900">
                    <span className="potong">{item.pengumuman}</span>
                  </td>
                  <td>
                    <SetujuPill disetujui={item.is_approved} />
                  </td>
                  <td className="tabel__aksi">
                    <span className="aksi-seri">
                      <TombolIkon
                        label={`Ubah komentar dari ${item.pengirim_nama}`}
                        onKlik={() => onUbah(item)}
                        nonaktif={menghapusId !== null}
                      >
                        <FaPen size={13} />
                      </TombolIkon>
                      <TombolIkon
                        label={`Hapus komentar dari ${item.pengirim_nama}`}
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
