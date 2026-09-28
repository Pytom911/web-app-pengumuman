import { useState } from "react";
import { inisial } from "../lib/format";
import profilSatu from "../assets/profile.png";
import profilDua from "../assets/profile2.png";

const ANGGOTA = [
  {
    nama: "Yusuf Pratama",
    peran: "Lead Fullstack Developer · PPLG",
    foto: profilSatu,
    tag: ["React Web", "Supabase REST API"],
    deskripsi:
      "Bertanggung jawab atas arsitektur sistem, integrasi database Supabase, serta logika CRUD pengumuman dan komentar.",
  },
  {
    nama: "Davin Dermawan",
    peran: "UI/UX & Frontend Engineer · PPLG",
    foto: profilDua,
    tag: ["UI/UX Design", "Responsive CSS"],
    deskripsi:
      "Fokus pada perancangan antarmuka yang responsif, tipografi yang enak dibaca, dan pengalaman pengguna yang ramah di berbagai ukuran layar.",
  },
];

function Muka({ src, nama }) {
  const [gagal, setGagal] = useState(false);

  if (gagal) {
    return (
      <span className="tim__muka tim__muka--awal" role="img" aria-label={nama}>
        {inisial(nama)}
      </span>
    );
  }

  return (
    <img
      className="tim__muka"
      src={src}
      alt={nama}
      onError={() => setGagal(true)}
    />
  );
}

export function TimGrid() {
  return (
    <div className="tim">
      {ANGGOTA.map((orang) => (
        <article className="tim__kartu" key={orang.nama}>
          <Muka src={orang.foto} nama={orang.nama} />
          <h2 className="tim__nama">{orang.nama}</h2>
          <p className="tim__peran">{orang.peran}</p>
          <div className="tim__tag">
            {orang.tag.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="tim__deskripsi">{orang.deskripsi}</p>
        </article>
      ))}
    </div>
  );
}
