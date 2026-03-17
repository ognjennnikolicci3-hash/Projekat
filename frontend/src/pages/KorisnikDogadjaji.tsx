import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface DogadjajView {
  id: number;
  dogadjajId?: number; 
  naziv?: string;
  opis?: string;
  datumVreme: string;
  maxIgraca?: number;
  trenutniBrojUcesnika?: number;
  sport?: { id?: number; naziv?: string };
  teren?: { id?: number; naziv?: string };
  organizator?: { id?: number; ime?: string; prezime?: string };
  prosecnaOcena?: number | null;
}

interface Korisnik {
  korisnikId: number;
  ime: string;
  prezime: string;
}

export default function KorisnikDogadjaji() {
  const { korisnikId } = useParams();
  const [dogadjaji, setDogadjaji] = useState<DogadjajView[]>([]);
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);
  const [myEventIds, setMyEventIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
// Učitavanje korisnika, događaja i mojih događaja
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Dohvatanje korisnika
        try {
          const korisnikRes = await axios.get(`http://localhost:3000/korisnici/${korisnikId}`, { headers });
          setKorisnik(korisnikRes.data);
        } catch (err) {
        
          setKorisnik(null);
        }

        // Dohvatanje događaja za korisnika
        const dogRes = await axios.get(`http://localhost:3000/korisnici/${korisnikId}/dogadjaji`, { headers });
        const normalized: DogadjajView[] = (dogRes.data || []).map((d: any) => ({
          
          id: (d.id ?? d.dogadjajId ?? d.DogadjajId) as number,
          dogadjajId: d.dogadjajId ?? d.id ?? d.DogadjajId,
          naziv: d.naziv ?? d.opis ?? d.title ?? undefined,
          opis: d.opis ?? d.description ?? undefined,
          datumVreme: d.datumVreme ?? d.start ?? (d.DatumVreme ? String(d.DatumVreme) : ""),
          maxIgraca: d.maxIgraca ?? d.MaxIgraca ?? 0,
          trenutniBrojUcesnika: Number(d.trenutniBrojUcesnika ?? d.trenutniBrojUcesnika ?? 0),
          sport: d.sport ?? (d.sportNaziv ? { naziv: d.sportNaziv } : undefined),
          teren: d.teren ?? (d.terenNaziv ? { naziv: d.terenNaziv } : undefined),
          organizator: d.organizator ?? (d.organizatorIme ? { ime: d.organizatorIme } : undefined),
          prosecnaOcena: d.prosecnaOcena ?? null,
        }));
        setDogadjaji(normalized);

       // Dohvatanje mojih događaja (pridruženi i organizovani)
        if (token) {
          try {
            const myRes = await axios.get(`http://localhost:3000/dogadjaji/moji`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const ids = new Set<number>();
            (myRes.data.organizovani || []).forEach((x: any) => ids.add(Number(x.id)));
            (myRes.data.pridruzeni || []).forEach((x: any) => ids.add(Number(x.id)));
            setMyEventIds(ids);
          } catch (err) {
            // ako ne uspe, samo ostavi prazan set
            setMyEventIds(new Set());
          }
        } else {
          setMyEventIds(new Set());
        }
      } catch (err) {
        console.error("Greška pri učitavanju:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
   
  }, [korisnikId]);
// Provera da li je događaj prošao
  const isPast = (iso: string) => {
    const t = new Date(iso).getTime();
    return !isNaN(t) && t < Date.now();
  };

  // Funkcija za pridruživanje događaju
  const pridruziSe = async (dogId: number, sportId?: number) => {
    if (!token) {
      alert("Morate biti ulogovani da biste se pridružili događaju.");
      return;
    }

   
    const ev = dogadjaji.find(d => (d.id ?? d.dogadjajId) === dogId);
    if (!ev) {
      alert("Događaj nije pronađen.");
      return;
    }

    // provera da li je u budućnosti
    if (isPast(ev.datumVreme)) {
      alert("Ne možete se pridružiti događaju koji je već počeo ili završen.");
      return;
    }

    // provera pozicije mesta
    const trenutno = Number(ev.trenutniBrojUcesnika ?? 0);
    const max = Number(ev.maxIgraca ?? 0);
    if (max > 0 && trenutno >= max) {
      alert("Događaj je već popunjen.");
      return;
    }

    // provera da li je korisnik već pridružen
    if (myEventIds.has(dogId)) {
      alert("Već ste pridruženi ovom događaju.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/dogadjaji/pridruzi-se`,
        { dogadjajId: dogId, sportId: sportId ?? ev.sport?.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data?.poruka ?? "Uspešno ste se pridružili događaju.");

      
      setDogadjaji(prev => prev.map(d => {
        const id = d.id ?? d.dogadjajId;
        if (id === dogId) {
          return { ...d, trenutniBrojUcesnika: (Number(d.trenutniBrojUcesnika ?? 0) + 1) };
        }
        return d;
      }));

      setMyEventIds(prev => new Set(prev).add(dogId));
    } catch (err: any) {
      console.error("Greška pri pridruživanju:", err);
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || "Greška pri pridruživanju";
      alert(msg);
    }
  };

  if (loading) return <p className="text-center mt-8">Učitavam ...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        Događaji korisnika:{" "}
        {korisnik ? `${korisnik.ime} ${korisnik.prezime}` : korisnikId}
      </h2>

      {dogadjaji.length === 0 ? (
        <p>Nema događaja.</p>
      ) : (
        <ul className="space-y-4">
          {dogadjaji.map((d) => {
            const id = d.id ?? d.dogadjajId;
            const canJoin = !isPast(d.datumVreme) && (Number(d.trenutniBrojUcesnika ?? 0) < Number(d.maxIgraca ?? 0));
            const isJoined = myEventIds.has(id);

            return (
              <li key={id} className="p-4 border rounded-xl flex flex-col gap-1 hover:shadow-md transition">
                <p className="font-semibold text-lg">{d.naziv}</p>

                <p>🏅 Sport: <strong>{d.sport?.naziv ?? "Nepoznato"}</strong></p>
                <p>📍 Teren: <strong>{d.teren?.naziv ?? "Nepoznato"}</strong></p>

                <p>📅 Datum i vreme: <strong>{new Date(d.datumVreme).toLocaleString()}</strong></p>

                <p>👥 Učesnici: <strong>{Number(d.trenutniBrojUcesnika ?? 0)} / {Number(d.maxIgraca ?? 0)}</strong></p>

                {d.opis && <p>📝 Opis: <em>{d.opis}</em></p>}

                <p>👤 Organizator: <strong>{d.organizator ? `${d.organizator.ime} ${d.organizator.prezime}` : "Nepoznato"}</strong></p>

                <p>⭐ Prosečna ocena: <strong>{d.prosecnaOcena !== null && d.prosecnaOcena !== undefined ? d.prosecnaOcena.toFixed(2) : "N/A"}</strong></p>

               
                <div className="mt-3">
                  {token ? (
                    <button
                      onClick={() => pridruziSe(id, d.sport?.id)}
                      disabled={!canJoin || isJoined}
                      className={`px-4 py-2 rounded-xl text-white font-semibold transition ${(!canJoin || isJoined) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {isJoined ? 'Već ste pridruženi' : (canJoin ? 'Pridruži se' : 'Nije moguće pridružiti se')}
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">Prijavite se da biste mogli da se pridružite događaju.</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}