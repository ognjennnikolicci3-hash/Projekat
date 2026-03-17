import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

type EventItem = {
  id: number;
  title: string;
  start: string; 
  end?: string | null;
  description?: string;
  organizer?: string;
  sportId?: number;
  terenId?: number;
  maxIgraca?: number;
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function localDateKey(dateLike: Date | string) {
  const d = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
 
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function Kalendar({ sportId }: { sportId?: number }) {
  const [current, setCurrent] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
// Dohvatanje događaja sa servera
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const url = sportId
          ? `http://localhost:3000/dogadjaji/calendar?sportId=${sportId}`
          : `http://localhost:3000/dogadjaji/calendar`;
        const res = await axios.get<EventItem[]>(url, {
          headers: token ? { Authorization: "Bearer " + token } : undefined,
        });

        
        setEvents(
          (res.data || []).map((e) => ({
            ...e,
            
            end: e.end ? e.end : undefined,
          }))
        );
      } catch (err) {
        console.error("Greška pri učitavanju događaja za kalendar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [sportId]);

  // Generisanje matrice dana za trenutni mesec
  const monthMatrix = useMemo(() => {
    const first = startOfMonth(current);
    const last = endOfMonth(current);
    const startDay = first.getDay(); // 
    const daysInMonth = last.getDate();

    const matrix: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) matrix.push(null);
    for (let d = 1; d <= daysInMonth; d++) matrix.push(new Date(current.getFullYear(), current.getMonth(), d));
    while (matrix.length % 7 !== 0) matrix.push(null);

    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < matrix.length; i += 7) weeks.push(matrix.slice(i, i + 7));
    return weeks;
  }, [current]);

  // Grupisanje događaja po datumu  
  const eventsByDate = useMemo(() => {
    const m: Record<string, EventItem[]> = {};
    for (const ev of events) {
      
      const key = localDateKey(ev.start);
      if (!m[key]) m[key] = [];
      m[key].push(ev);
    }
    return m;
  }, [events]);
// Navigacija između meseci
  const prevMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  const openDay = (d: Date | null) => setSelectedDate(d);

   // Formatiranje vremena za prikaz
  const formatTime = (iso: string) => {
    const dt = new Date(iso);
    if (isNaN(dt.getTime())) return "";
    return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button onClick={prevMonth} className="px-3 py-1 mr-2 bg-gray-200 rounded">←</button>
          <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded">→</button>
        </div>
        <h3 className="text-xl font-bold">
          {current.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
        </h3>
        <div>
          <a href="/dogadjaji/kreiraj" className="px-4 py-2 bg-blue-600 text-white rounded">Kreiraj događaj</a>
        </div>
      </div>

      {loading ? <p>Učitavam događaje...</p> : null}

      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <th key={d} className="p-2 text-left text-gray-600">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthMatrix.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => {
                const key = day ? localDateKey(day) : `null-${i}-${j}`;
                const evs = day ? eventsByDate[key] || [] : [];
                const todayKey = localDateKey(new Date());
                const isToday = day ? (localDateKey(day) === todayKey) : false;
                return (
                  <td
                    key={key}
                    onClick={() => openDay(day)}
                    className={`align-top p-2 h-28 border border-gray-100 cursor-pointer ${isToday ? 'bg-yellow-50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-medium text-gray-700">{day ? day.getDate() : ''}</div>
                      {evs.length > 0 && (
                        <div className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">{evs.length}</div>
                      )}
                    </div>

                    <div className="mt-2 space-y-1">
                      {evs.slice(0,2).map(e => (
                        <div key={e.id} className="text-xs p-1 rounded border border-gray-100 hover:shadow-sm bg-gray-50">
                          <div className="font-semibold truncate">{e.title}</div>
                          <div className="text-[11px] text-gray-500">{formatTime(e.start)}</div>
                        </div>
                      ))}
                      {evs.length > 2 && <div className="text-xs text-gray-500 mt-1">+{evs.length - 2} više</div>}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

     
      {selectedDate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold">Događaji za {selectedDate.toLocaleDateString()}</h4>
              <button onClick={() => setSelectedDate(null)} className="text-gray-500">Zatvori</button>
            </div>

            <div>
              {(eventsByDate[localDateKey(selectedDate)] || []).length === 0 ? (
                <p className="text-gray-500">Nema događaja za ovaj dan.</p>
              ) : (
                (eventsByDate[localDateKey(selectedDate)] || []).map(ev => (
                  <div key={ev.id} className="p-3 border-b last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{ev.title}</div>
                        <div className="text-sm text-gray-600">{formatTime(ev.start)}</div>
                      </div>
                      <div className="text-sm text-gray-500">{ev.organizer}</div>
                    </div>
                    {ev.description && <p className="mt-2 text-sm text-gray-700">{ev.description}</p>}
                    <div className="mt-2 flex gap-2">
                      <a href={`/korisnici/${ev.sportId}/${ev.id}`} className="text-sm px-3 py-1 bg-indigo-600 text-white rounded">Vidi učesnike</a>
                      <a href={`/dogadjaji/view/${ev.id}`} className="text-sm px-3 py-1 bg-green-600 text-white rounded">Pregledaj</a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}