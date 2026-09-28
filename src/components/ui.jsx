import { useId, useState } from "react";
import {
  FaChevronDown,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { inisial, metaKomentar, metaStatus } from "../lib/format";

/* ---------- status ---------- */

export function StatusPill({ nilai }) {
  const meta = metaStatus(nilai);
  return <span className={`jempol jempol--${meta.nada}`}>{meta.label}</span>;
}

export function SetujuPill({ disetujui }) {
  const meta = metaKomentar(disetujui);
  return <span className={`jempol jempol--${meta.nada}`}>{meta.label}</span>;
}

/* ---------- gambar dengan cadangan inisial ---------- */

export function Thumb({ src, nama, ukuran, kelas = "" }) {
  const [gagal, setGagal] = useState(null);
  const tampil = Boolean(src) && gagal !== src;
  const gaya = ukuran ? { "--ukuran": `${ukuran}px` } : undefined;

  return (
    <span
      className={`gambar ${kelas}`.trim()}
      style={gaya}
      aria-hidden="true"
    >
      {tampil ? (
        <img
          className="gambar__isi"
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setGagal(src)}
        />
      ) : (
        <span className="gambar__awal">{inisial(nama)}</span>
      )}
    </span>
  );
}

/* ---------- isian formulir ---------- */

export function Field({
  label,
  nilai,
  onUbah,
  placeholder,
  type = "text",
  multiline = false,
  wajib = false,
}) {
  const id = useId();

  return (
    <div className="ladang">
      <label className="ladang__label" htmlFor={id}>
        {label}
        {wajib && (
          <span className="ladang__wajib" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className="ladang__teks"
          value={nilai}
          onChange={(e) => onUbah(e.target.value)}
          placeholder={placeholder}
          required={wajib}
        />
      ) : (
        <input
          id={id}
          className="ladang__input"
          type={type}
          value={nilai}
          onChange={(e) => onUbah(e.target.value)}
          placeholder={placeholder}
          required={wajib}
        />
      )}
    </div>
  );
}

export function SelectField({ label, nilai, placeholder, onBuka }) {
  const id = useId();
  const kosong = !nilai;

  return (
    <div className="ladang">
      <span className="ladang__label" id={`${id}-label`}>
        {label}
      </span>
      <button
        type="button"
        className="ladang__pilih"
        onClick={onBuka}
        aria-haspopup="dialog"
        aria-labelledby={`${id}-label`}
      >
        <span className={`ladang__nilai${kosong ? " ladang__nilai--kosong" : ""}`}>
          {nilai || placeholder}
        </span>
        <FaChevronDown size={14} color="var(--tinta-2)" />
      </button>
    </div>
  );
}

export function CheckField({ label, catatan, checked, onUbah }) {
  const id = useId();

  return (
    <label className="centang" htmlFor={id}>
      <input
        id={id}
        className="centang__kotak"
        type="checkbox"
        checked={checked}
        onChange={(e) => onUbah(e.target.checked)}
      />
      <span className="centang__teks">
        {label}
        {catatan && <span className="centang__catatan">{catatan}</span>}
      </span>
    </label>
  );
}

/* ---------- tombol ---------- */

export function Spinner({ size = 14 }) {
  return <FaSpinner className="putar" size={size} />;
}

export function TombolIkon({ label, onKlik, children, bahaya, nonaktif }) {
  return (
    <button
      type="button"
      className={`tombol tombol--ikon${bahaya ? " tombol--bahaya" : ""}`}
      onClick={onKlik}
      disabled={nonaktif}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

/* ---------- keadaan & umpan balik ---------- */

export function Alert({ nada = "galat", judul, pesan, onTutup }) {
  return (
    <div
      className={`abar abar--${nada}`}
      role={nada === "galat" ? "alert" : "status"}
    >
      {nada === "galat" ? <FaExclamationTriangle size={16} /> : <FaCheck size={16} />}
      <div className="abar__teks">
        <p className="abar__judul">{judul}</p>
        {pesan && <p className="abar__pesan">{pesan}</p>}
      </div>
      {onTutup && (
        <button
          type="button"
          className="tombol tombol--ikon tombol--hantu abar__tutup"
          onClick={onTutup}
          aria-label="Tutup pesan"
        >
          <FaTimes size={14} />
        </button>
      )}
    </div>
  );
}

export function Kosong({ judul, catatan, aksi }) {
  return (
    <div className="kosong">
      <p className="kosong__judul">{judul}</p>
      {catatan && <p className="kosong__catatan">{catatan}</p>}
      {aksi}
    </div>
  );
}

export function Rangka({ baris = 5, pesan = "Memuat data" }) {
  return (
    <div className="rangka" role="status" aria-live="polite">
      <span className="hanya-pembaca">{pesan}</span>
      <div aria-hidden="true">
        {Array.from({ length: baris }, (_, i) => (
          <div className="rangka__baris" key={i}>
            <div className="rangka__lingkaran" />
            <div className="rangka__teks">
              <div className="rangka__balok rangka__balok--panjang" />
              <div className="rangka__balok rangka__balok--pendek" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Ringkasan({ sel }) {
  return (
    <div className="ringkasan">
      {sel.map((s) => (
        <div className="ringkasan__sel" key={s.label}>
          <p
            className={`ringkasan__angka${s.nada === "pin" ? " ringkasan__angka--pin" : ""}`}
          >
            {s.angka}
          </p>
          <p className="ringkasan__label">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
