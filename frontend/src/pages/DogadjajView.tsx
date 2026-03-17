import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

type EventView = {
  id: number;
  naziv?: string;
  opis?: string;
  datumVreme: string;
  maxIgraca?: number;
  organizator?: { id:number; ime:string; prezime:string };
  sport?: { id:number; naziv:string };
  teren?: { id:number; naziv:string };
  prosecnaOcena?: number | null;
};

export default function DogadjajView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventView | null>(null);
  const [loading, setLoading] = useState(true);
// Dohvata podatke o događaju sa servera
  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/dogadjaji/view/${id}`, { 
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
});
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        alert('Događaj nije pronađen.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);
// Provera da li se još uvek učitava
  if (loading) return <p>Učitavanje...</p>;
   // Prikaz ako događaj nije dostupan
  if (!event) return <p>Događaj nije dostupan.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-3">{event.naziv}</h2>
      <p className="text-gray-600 mb-2">📅 {new Date(event.datumVreme).toLocaleString()}</p>
      <p className="mb-2">📍 Teren: <strong>{event.teren?.naziv ?? 'Nepoznato'}</strong></p>
      <p className="mb-2">🏅 Sport: <strong>{event.sport?.naziv ?? 'Nepoznato'}</strong></p>
      <p className="mb-2">👥 Max igrača: <strong>{event.maxIgraca ?? 'N/A'}</strong></p>
      <p className="mb-2">👤 Organizator: <strong>{event.organizator ? `${event.organizator.ime} ${event.organizator.prezime}` : 'Nepoznato'}</strong></p>
      <p className="mb-4">{event.opis}</p>
      <p className="mb-2">⭐ Prosečna ocena: <strong>{event.prosecnaOcena?.toFixed?.(2) ?? 'N/A'}</strong></p>

      <div className="mt-4 flex gap-2">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Nazad</button>
        <a className="px-4 py-2 bg-indigo-600 text-white rounded" href={`/korisnici/${event.sport?.id ?? ''}/${event.id}`}>Vidi učesnike</a>
      </div>
    </div>
  );
}