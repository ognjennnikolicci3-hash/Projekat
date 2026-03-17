import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type E = {
  id: number;
  title: string;
  start: string;
  sportId?: number;
  sportNaziv?: string;
  terenNaziv?: string;
  maxIgraca?: number;
  prosecnaOcena?: number | null;
};

export default function MojiDogadjaji() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizovani, setOrganizovani] = useState<E[]>([]);
  const [pridruzeni, setPridruzeni] = useState<E[]>([]);
  const navigate = useNavigate();
// Fetch mojih događaja
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/dogadjaji/moji', {
        baseURL: 'http://localhost:3000',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setOrganizovani(res.data.organizovani || []);
      setPridruzeni(res.data.pridruzeni || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data || 'Greška pri učitavanju mojih događaja');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);
// Funkcija za otkazivanje organizovanog događaja
  const otkaziDogadjaj = async (dogId: number) => {
    if (!window.confirm('Da li ste sigurni da želite da otkažete ovaj događaj?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/dogadjaji/otkazi',
        { dogadjajId: dogId },
        { baseURL: 'http://localhost:3000', headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      setOrganizovani(prev => prev.filter(d => d.id !== dogId));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Greška pri otkazivanju događaja');
    }
  };
// Funkcija za napuštanje pridruženog događaja
  const napustiDogadjaj = async (dogId: number) => {
    if (!window.confirm('Da li želite da napustite ovaj događaj?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/dogadjaji/odustani',
        { dogadjajId: dogId },
        { baseURL: 'http://localhost:3000', headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      setPridruzeni(prev => prev.filter(d => d.id !== dogId));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Greška pri napuštanju događaja');
    }
  };

  if (loading) return <p className="text-center mt-10">Učitavam vaše događaje...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{String(error)}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <section className="w-full max-w-6xl">
        <h3 className="text-2xl font-bold mb-6 text-center">Moji organizovani događaji</h3>
        {organizovani.length === 0 ? (
          <p className="text-gray-500 text-center">Nemate nijedan organizovan događaj.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizovani.map(d => (
              <div key={d.id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-full">
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-1">{d.title}</h4>
                  <p className="text-sm text-gray-600">{new Date(d.start).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{d.sportNaziv || ''} {d.terenNaziv ? `• ${d.terenNaziv}` : ''}</p>
                </div>
                <div className="flex gap-2 mt-auto flex-wrap">
                  <button onClick={() => navigate(`/dogadjaji/view/${d.id}`)} className="px-3 py-1 bg-indigo-600 text-white rounded flex-1">
                    Pregledaj
                  </button>
                  
                  <button onClick={() => otkaziDogadjaj(d.id)} className="px-3 py-1 bg-red-600 text-white rounded flex-1">
                    Otkazi
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="w-full max-w-6xl mt-12">
        <h3 className="text-2xl font-bold mb-6 text-center">Događaji kojima sam pridružen</h3>
        {pridruzeni.length === 0 ? (
          <p className="text-gray-500 text-center">Niste prijavljeni ni na jedan događaj.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pridruzeni.map(d => (
              <div key={d.id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-full">
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-1">{d.title}</h4>
                  <p className="text-sm text-gray-600">{new Date(d.start).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{d.sportNaziv || ''} {d.terenNaziv ? `• ${d.terenNaziv}` : ''}</p>
                </div>
                <div className="flex gap-2 mt-auto flex-wrap">
                  <button onClick={() => navigate(`/dogadjaji/view/${d.id}`)} className="px-3 py-1 bg-indigo-600 text-white rounded flex-1">
                    Pregledaj
                  </button>
                  
                  <button onClick={() => napustiDogadjaj(d.id)} className="px-3 py-1 bg-red-600 text-white rounded flex-1">
                    Napusti
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
