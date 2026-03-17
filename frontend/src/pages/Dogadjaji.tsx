// src/pages/Dogadjaji.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Dogadjaj {
  dogadjajId: number;
  naziv?: string;
  opis?: string;
  datumVreme: string;
  maxIgraca: number;
  prosecnaOcena?: number;
  sportNaziv?: string;
  terenNaziv?: string;
  organizatorIme?: string;
  organizatorId?: number;
  trenutniBrojUcesnika: number; 
}

export default function Dogadjaji() {
  const { sportId } = useParams();
  const navigate = useNavigate();
  const [dogadjaji, setDogadjaji] = useState<Dogadjaj[]>([]);
  const [loading, setLoading] = useState(false);
  const [myEventIds, setMyEventIds] = useState<Set<number>>(new Set());
  const token = localStorage.getItem("token");
// Fetch svih događaja po sportu
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const headers = token ? { Authorization: "Bearer " + token } : {};
        const res = await axios.get(`http://localhost:3000/dogadjaji?sportId=${sportId}`, { headers });
       
        const data = (res.data || []).map((d: any) => ({
          ...d,
          trenutniBrojUcesnika: d.trenutniBrojUcesnika ?? 0
        }));
        setDogadjaji(data);
      } catch (err) {
        console.error("Greška pri učitavanju događaja:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [sportId, token]);
 // Fetch događaja na kojima je korisnik organizator ili učesnik
  useEffect(() => {
    if (!token) return;
    const fetchMy = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/dogadjaji/moji`, {
          headers: { Authorization: "Bearer " + token },
        });
        const ids = new Set<number>();
        [...(res.data.organizovani || []), ...(res.data.pridruzeni || [])].forEach(d => ids.add(d.id));
        setMyEventIds(ids);
      } catch (err) {
        console.error("Greška pri učitavanju mojih događaja:", err);
      }
    };
    fetchMy();
  }, [token]);
// Funkcija za pridruživanje događaju
  const pridruziSe = async (dogadjajId: number) => {
    try {
      const rezultat = await axios.post(
        `http://localhost:3000/dogadjaji/pridruzi-se`,
        { dogadjajId, sportId: Number(sportId) },
        { headers: { Authorization: "Bearer " + token } }
      );
      alert(rezultat.data.poruka);

     // Update lokalnog state-a
      setDogadjaji(prev =>
        prev.map(d => d.dogadjajId === dogadjajId
          ? { ...d, trenutniBrojUcesnika: d.trenutniBrojUcesnika + 1 }
          : d
        )
      );
    } catch (err: any) {
      alert(err?.response?.data?.message || "Greška pri pridruživanju.");
    }
  };

  const isPast = (iso: string) => new Date(iso).getTime() < Date.now();
// Funkcija za ocenjivanje događaja
  const oceniDogadjaj = async (dogadjajId: number, ocena: number) => {
    if (!token) { alert("Morate biti ulogovani da ocenite događaj."); return; }
    const komentar = window.prompt("Ostavite komentar/recenziju (opciono):", "");
    try {
      await axios.post(`http://localhost:3000/ocene`, { dogadjajId, ocena, komentar }, { headers: { Authorization: "Bearer " + token } });
      alert("Uspešno ste ocenili događaj!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Greška pri ocenjivanju");
    }
  };

  const sportNaziv = dogadjaji.length ? (dogadjaji[0].sportNaziv ?? `#${sportId}`) : `#${sportId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-indigo-50 to-blue-100 px-6 py-12">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-indigo-800 drop-shadow-md">
        Događaji za sport: {sportNaziv}
      </h2>

      {loading ? (
        <p className="text-center">Učitavam...</p>
      ) : dogadjaji.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Nema dostupnih događaja.</p>
      ) : (
        <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dogadjaji.map(d => {
            const displayName = d.naziv || (d.opis ? d.opis.slice(0, 40) + (d.opis.length > 40 ? '...' : '') : '') || `${d.sportNaziv ?? "Događaj"} - ${new Date(d.datumVreme).toLocaleString()}`;
            const canRate = myEventIds.has(d.dogadjajId) && isPast(d.datumVreme);
            const canJoin = !isPast(d.datumVreme) && d.trenutniBrojUcesnika < d.maxIgraca;
            const isJoined = myEventIds.has(d.dogadjajId);
            return (
              <div key={d.dogadjajId} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col justify-between border border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{d.naziv ?? displayName}</h3>
                  <p className="text-gray-700 mb-2">🏅 Sport: <span className="font-semibold">{d.sportNaziv || "Nepoznato"}</span></p>
                  <p className="text-gray-700 mb-2">📍 Teren: <span className="font-semibold">{d.terenNaziv || "Nepoznato"}</span></p>
                  <p className="text-gray-700 mb-2">📅 Datum i vreme: <span className="font-semibold">{new Date(d.datumVreme).toLocaleString()}</span></p>
                  <p className="text-gray-700 mb-2">👥 Učesnici: <span className="font-semibold">{d.trenutniBrojUcesnika} / {d.maxIgraca}</span></p>
                  {d.opis && <p className="text-gray-700 mb-2">📝 Opis: <span className="italic">{d.opis}</span></p>}
                  <p className="text-gray-700 mb-4">👤 Organizator: <span className="font-semibold">{d.organizatorIme || "Nepoznato"}</span></p>
                  <p className="text-gray-700 mb-4">⭐ Prosečna ocena: <span className="font-semibold">{d.prosecnaOcena?.toFixed(2) || "N/A"}</span></p>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <button onClick={() => navigate(`/korisnici/${sportId}/${d.dogadjajId}`, { state: { dogadjajNaziv: displayName } })} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Vidi učesnike</button>

                  {token && (
                    <>
                      <button
                        onClick={() => pridruziSe(d.dogadjajId)}
                        disabled={!canJoin || isJoined}
                        className={`w-full py-2 rounded-lg transition text-white ${!canJoin || isJoined ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                      >
                        {isJoined ? 'Već ste pridruženi' : 'Pridruži se'}
                      </button>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-800 text-sm">Oceni:</span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(o => (
                            <button key={o} onClick={() => oceniDogadjaj(d.dogadjajId, o)}
                              className={`bg-yellow-400 text-black w-8 h-8 rounded-full transition font-bold ${!canRate ? 'opacity-40 pointer-events-none' : ''}`}
                              title={canRate ? 'Oceni događaj' : 'Samo učesnici nakon događaja mogu da ocenjuju'}>
                              {o}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}