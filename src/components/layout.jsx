import { useEffect, useId, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { inisial } from "../lib/format";
import { Spinner, TombolIkon } from "./ui";
import profilSatu from "../assets/profile.png";
import profilDua from "../assets/profile2.png";

/* ---------- kepala halaman ---------- */

function Avatar({ src, nama }) {
  const [gagal, setGagal] = useState(false);

  if (gagal) {
    return (
      <span className="muka muka--awal" role="img" aria-label={nama}>
        {inisial(nama)}
      </span>
    );
  }

  return (
    <img
      className="muka"
      src={src}
      alt={nama}
      onError={() => setGagal(true)}
    />
  );
}

export function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead__isi">
        <div>
          <p className="masthead__nama">App Data Pengumuman</p>
          <p className="masthead__sub">
            Papan pengumuman &amp; interaksi sekolah
          </p>
        </div>
        <div className="masthead__wajah">
          <Avatar src={profilSatu} nama="Yusuf Pratama" />
          <Avatar src={profilDua} nama="Davin Dermawan" />
        </div>
      </div>
    </header>
  );
}

/* ---------- navigasi: satu elemen, tab di bawah / relai di kiri ---------- */

export function Nav({ tabs, aktif, onPilih }) {
  return (
    <nav className="nav" aria-label="Navigasi utama">
      <ul className="nav__daftar">
        {tabs.map((tab) => {
          const Ikon = tab.ikon;
          return (
            <li key={tab.kunci}>
              <button
                type="button"
                className="nav__item"
                onClick={() => onPilih(tab.kunci)}
                aria-current={aktif === tab.kunci ? "page" : undefined}
              >
                <Ikon size={18} />
                <span className="nav__label">{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------- lembar bawah / dialog ---------- */

const FOKUS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Sheet({ buka, judul, onTutup, children, kaki }) {
  const kotak = useRef(null);
  const tutup = useRef(onTutup);

  useEffect(() => {
    tutup.current = onTutup;
  });

  useEffect(() => {
    if (!buka) return;

    const itemFokus = () => {
      if (!kotak.current) return [];
      return Array.from(kotak.current.querySelectorAll(FOKUS)).filter(
        (el) => el.offsetParent !== null,
      );
    };

    const sebelumnya = document.activeElement;
    const overflowAwal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const pertama = itemFokus()[0];
    if (pertama) pertama.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        tutup.current();
        return;
      }
      if (event.key !== "Tab") return;

      const daftar = itemFokus();
      if (!daftar.length) return;

      const awal = daftar[0];
      const akhir = daftar[daftar.length - 1];
      if (event.shiftKey && document.activeElement === awal) {
        event.preventDefault();
        akhir.focus();
      } else if (!event.shiftKey && document.activeElement === akhir) {
        event.preventDefault();
        awal.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowAwal;
      if (sebelumnya instanceof HTMLElement) sebelumnya.focus();
    };
  }, [buka]);

  if (!buka) return null;

  return (
    <div className="sheet">
      <button
        type="button"
        className="sheet__latar"
        onClick={onTutup}
        tabIndex={-1}
        aria-hidden="true"
      />
      <div
        className="sheet__kotak"
        ref={kotak}
        role="dialog"
        aria-modal="true"
        aria-label={judul}
      >
        <div className="sheet__kepala">
          <p className="sheet__judul">{judul}</p>
          <TombolIkon label="Tutup" onKlik={onTutup}>
            <FaTimes size={16} />
          </TombolIkon>
        </div>
        {children}
        {kaki && <div className="sheet__kaki">{kaki}</div>}
      </div>
    </div>
  );
}

export function Konfirmasi({ buka, judul, pesan, label, sibuk, onJalankan, onTutup }) {
  return (
    <Sheet
      buka={buka}
      judul={judul}
      onTutup={onTutup}
      kaki={
        <>
          <button type="button" className="tombol tombol--hantu" onClick={onTutup}>
            Batal
          </button>
          <button
            type="button"
            className="tombol tombol--bahaya-utama"
            onClick={onJalankan}
            disabled={sibuk}
          >
            {sibuk && <Spinner />}
            {label}
          </button>
        </>
      }
    >
      <div className="dialog__isi">{pesan}</div>
    </Sheet>
  );
}

/* ---------- panel dengan kepala ---------- */

export function Papan({ judul, aksi, children, telanjang = false }) {
  const id = useId();

  return (
    <section className="papan" aria-labelledby={id}>
      <div className="papan__kepala">
        <span className="papan__judul" id={id}>
          {judul}
        </span>
        {aksi && <div className="papan__kanan">{aksi}</div>}
      </div>
      <div className={`papan__badan${telanjang ? " papan__badan--telanjang" : ""}`}>
        {children}
      </div>
    </section>
  );
}
