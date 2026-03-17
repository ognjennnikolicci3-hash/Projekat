import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

interface Korisnik {
  korisnikId: number;
  ime: string;
  prezime: string;
  email: string;
}

const Korisnici: React.FC = () => {
  const { sportId, dogadjajId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const navState = (location.state || {}) as any;
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [title, setTitle] = useState<string>(navState?.dogadjajNaziv ?? `Događaj ${dogadjajId}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  const [query, setQuery] = useState<string>("");
// Dohvatanje korisnika i naziv događaja
  useEffect(() => {
    const fetchKorisnici = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Korisnik[]>(
          `http://localhost:3000/korisnici?dogadjajId=${dogadjajId}&sportId=${sportId}`,
          {
            headers: token ? { Authorization: "Bearer " + token } : undefined
          }
        );
        setKorisnici(res.data || []);
      } catch (err) {
        console.error("Greška pri učitavanju korisnika:", err);
        setError("Greška pri učitavanju korisnika.");
      } finally {
        setLoading(false);
      }
    };
// Dohvatanje naziva događaja ako nije prosleđeno kroz state
    const ensureTitle = async () => {
      if (navState?.dogadjajNaziv) return;
      try {
        const res = await axios.get<any[]>(`http://localhost:3000/dogadjaji?sportId=${sportId}`, {
          headers: token ? { Authorization: "Bearer " + token } : undefined
        });
        const d = (res.data || []).find((x: any) => String(x.dogadjajId) === String(dogadjajId));
        if (d) {
          const displayName = d.naziv || d.opis || `${d.sportNaziv ?? "Događaj"} - ${new Date(d.datumVreme).toLocaleString()}`;
          setTitle(displayName);
        }
      } catch (err) {
        console.error("Greška pri dohvatu imena događaja:", err);
      }
    };

    fetchKorisnici();
    ensureTitle();
  }, [sportId, dogadjajId, token]);
 // Filtriranje korisnika po upitu
  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return korisnici;
    return korisnici.filter(k =>
      `${k.ime} ${k.prezime}`.toLowerCase().includes(q) ||
      k.ime.toLowerCase().includes(q) ||
      k.prezime.toLowerCase().includes(q) ||
      (k.email || "").toLowerCase().includes(q)
    );
  }, [korisnici, query]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Korisnici za događaj: {title}
      </h2>

      <div className="mb-6 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pretraži po imenu, prezimenu ili emailu..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={() => setQuery("")}
          className="px-3 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200 transition"
          aria-label="Očisti pretragu"
        >
          Očisti
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Učitavam korisnike...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : korisnici.length === 0 ? (
        <p className="text-gray-500">Nema prijavljenih korisnika.</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">Nema rezultata za "{query}".</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((k) => (
            <li key={k.korisnikId} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-700">{k.ime} {k.prezime}</p>
                  <p className="text-sm text-gray-500">{k.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/korisnik/${k.korisnikId}/dogadjaji`, {
                        state: { dogadjajNaziv: title }
                      })
                    }
                    className="bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700 transition"
                  >
                    Pogledaj događaje
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Korisnici;