import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Sport = { sportId: number; naziv: string };
type Teren = { terenId: number; naziv: string; grad?: string; adresa?: string };

export default function KreirajDogadjaj() {
  const [sportId, setSportId] = useState<number | "">("");
  const [terenId, setTerenId] = useState<number | "">("");
  const [datumVreme, setDatumVreme] = useState("");
  const [maxIgraca, setMaxIgraca] = useState("");
  const [opis, setOpis] = useState("");
  const [error, setError] = useState("");
  const [sportovi, setSportovi] = useState<Sport[]>([]);
  const [tereni, setTereni] = useState<Teren[]>([]);
  const [minDateTime, setMinDateTime] = useState<string>("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
//podešavanje minimalnog datuma i učitavanje sportova i terena
  useEffect(() => {
    // Postavljanje minimalnog datuma za datetime-local
    const now = new Date();
    now.setSeconds(0, 0);
    const off = now.getTimezoneOffset();
    const local = new Date(now.getTime() - off * 60 * 1000);
    setMinDateTime(local.toISOString().slice(0, 16));
 // Dohvatanje sportova i terena
    const fetchRefs = async () => {
      try {
        const sRes = await axios.get<Sport[]>("http://localhost:3000/sportovi", {
          headers: token ? { Authorization: "Bearer " + token } : undefined,
        });
        setSportovi(sRes.data);

        const tRes = await axios.get<Teren[]>("http://localhost:3000/tereni", {
          headers: token ? { Authorization: "Bearer " + token } : undefined,
        });
        setTereni(tRes.data);
      } catch (err: any) {
        console.error("Greška pri učitavanju sportova/terena:", err);
        setError("Greška pri učitavanju podataka za forme. Pokušaj osvežavanje.");
      }
    };

    fetchRefs();
  }, [token]);
// Funkcija za slanje forme i kreiranje događaja
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Morate biti ulogovani.");
      return;
    }

    if (sportId === "" || terenId === "") {
      setError("Izaberite sport i teren.");
      return;
    }
if (parseInt(maxIgraca, 10) < 1) {
  setError("Broj igrača mora biti pozitivan.");
  return;
}
     // Validacija datuma i vremena
    const odabrani = new Date(datumVreme);
    if (isNaN(odabrani.getTime())) {
      setError("Neispravan datum.");
      return;
    }
    const sada = new Date();
    if (odabrani < sada) {
      setError("Datum i vreme ne mogu biti u prošlosti.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/dogadjaji/kreiraj",
        {
          sportId: Number(sportId),
          terenId: Number(terenId),
          datumVreme,
          maxIgraca: parseInt(maxIgraca, 10),
          opis,
        },
        { headers: { Authorization: "Bearer " + token } }
      );

      navigate("/moji-dogadjaji");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || err.message || "Greška pri kreiranju događaja");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-xl rounded-2xl mt-12 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🎯 Kreiraj događaj
      </h2>
      {error && <p className="text-red-600 font-medium mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Sport</span>
          <select
            value={sportId}
            onChange={(e) => setSportId(e.target.value === "" ? "" : Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
          >
            <option value="">Izaberite sport</option>
            {sportovi.map((s) => (
              <option key={s.sportId} value={s.sportId}>
                {s.naziv}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Teren</span>
          <select
            value={terenId}
            onChange={(e) => setTerenId(e.target.value === "" ? "" : Number(e.target.value))}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
          >
            <option value="">Izaberite teren</option>
            {tereni.map((t) => (
              <option key={t.terenId} value={t.terenId}>
                {t.naziv} {t.grad ? `(${t.grad})` : ""} {t.adresa ? `- ${t.adresa}` : ""}
              </option>
            ))}
          </select>
        </label>

        <input
          type="datetime-local"
          value={datumVreme}
          onChange={(e) => setDatumVreme(e.target.value)}
          min={minDateTime}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
          required
        />

        <input
  type="number"
  placeholder="Max igrača"
  value={maxIgraca}
  onChange={(e) => setMaxIgraca(e.target.value)}
  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
  required
  min={1} 
/>
        <textarea
          placeholder="Opis događaja (opciono)"
          value={opis}
          onChange={(e) => setOpis(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none"
          rows={3}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          🚀 Kreiraj događaj
        </button>
      </form>
    </div>
  );
}
