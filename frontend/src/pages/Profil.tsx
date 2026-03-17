import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Korisnik {
  korisnikId?: number;
  ime?: string;
  prezime?: string;
  email?: string;
  grad?: string;
  datumrodjenja?: string;
}

export default function Profil() {
  const navigate = useNavigate();
  const stored = localStorage.getItem("korisnik") || null;
  const initialKorisnik = stored ? JSON.parse(stored) as Korisnik : {} as Korisnik;
  const [korisnik, setKorisnik] = useState<Korisnik>(initialKorisnik);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  
  const [form, setForm] = useState<Korisnik>({
    ime: korisnik.ime || '',
    prezime: korisnik.prezime || '',
    email: korisnik.email || '',
    grad: korisnik.grad || '',
    datumrodjenja: korisnik.datumrodjenja ? korisnik.datumrodjenja.split('T')[0] : '', // YYYY-MM-DD
  });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const token = localStorage.getItem("token");
 // Dohvatanje podataka o korisniku
  useEffect(() => {
    
    const fetchMe = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get('/korisnici/me', {
          baseURL: 'http://localhost:3000',
          headers: { Authorization: 'Bearer ' + token }
        });
        if (res.data) {
          setKorisnik(res.data);
          setForm({
            ime: res.data.ime || '',
            prezime: res.data.prezime || '',
            email: res.data.email || '',
            grad: res.data.grad || '',
            datumrodjenja: res.data.datumrodjenja ? (res.data.datumrodjenja as string).split('T')[0] : '',
          });
          localStorage.setItem('korisnik', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('Ne mogu da dohvatim profil:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
    
  }, []);
// Odjava korisnika
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("korisnik");
    navigate("/login");
  };
// Funkcija za update forme
  const onChange = (k: keyof Korisnik, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
  };
// Čuvanje izmena profila
  const saveProfile = async () => {
    // validacija datuma
    if (!form.ime || !form.prezime || !form.email) {
      alert('Ime, prezime i email su obavezni.');
      return;
    }
    setSaving(true);
    
    if (form.datumrodjenja) {
  const unetDatum = new Date(form.datumrodjenja);
  const danas = new Date();
  if (unetDatum > danas) {
    alert('Datum rođenja ne može biti u budućnosti.');
    return;
  }
}

    try {
      const res = await axios.put('/korisnici/me', form, {
        baseURL: 'http://localhost:3000',
        headers: { Authorization: 'Bearer ' + token }
      });
      alert('Profil uspešno ažuriran.');
      const updated = res.data;
      setKorisnik(updated);
      setEditing(false);
      localStorage.setItem('korisnik', JSON.stringify(updated));
    } catch (err: any) {
      console.error('Greška pri čuvanju profila:', err);
      alert(err?.response?.data?.message || 'Greška pri čuvanju profila.');
    } finally {
      setSaving(false);
    }
  };
// Promena lozinke
  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert('Obe lozinke su obavezne.');
      return;
    }
    if (newPassword.length < 6) {
      alert('Nova lozinka mora imati bar 6 karaktera.');
      return;
    }
    setPwLoading(true);
    try {
      const res = await axios.put('/korisnici/me/password', { oldPassword, newPassword }, {
        baseURL: 'http://localhost:3000',
        headers: { Authorization: 'Bearer ' + token }
      });
      alert(res.data?.poruka || 'Lozinka promenjena.');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      console.error('Greška pri promeni lozinke:', err);
      alert(err?.response?.data?.message || 'Greška pri promeni lozinke.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight uppercase text-center">
          Profil
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Učitavam...</p>
        ) : (
          <>
            
            {!editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{korisnik.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grad</p>
                    <p className="font-medium text-gray-800">{korisnik.grad || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Ime</p>
                    <p className="font-medium text-gray-800">{korisnik.ime || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prezime</p>
                    <p className="font-medium text-gray-800">{korisnik.prezime || '-'}</p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Datum rođenja</p>
                    <p className="font-medium text-gray-800">{korisnik.datumrodjenja ? new Date(korisnik.datumrodjenja).toLocaleDateString('sr-RS') : '-'}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Izmeni profil
                  </button>
                  <button
                    onClick={() => navigate('/moji-dogadjaji')}
                    className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
                  >
                    Moji događaji
                  </button>
                </div>

                <div className="mt-4 border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2">Promena lozinke</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="password" placeholder="Stara lozinka" value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      className="p-2 border rounded"/>
                    <input type="password" placeholder="Nova lozinka" value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="p-2 border rounded"/>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={changePassword}
                      disabled={pwLoading}
                      className="bg-yellow-500 text-black py-2 px-4 rounded-lg hover:brightness-95 transition disabled:opacity-60"
                    >
                      {pwLoading ? '...' : 'Promeni lozinku'}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="ml-auto bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                      Odjavi se
                    </button>
                  </div>
                </div>
              </div>
            ) : (
             
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <label className="text-sm text-gray-600">Ime</label>
                  <input value={form.ime} onChange={e => onChange('ime', e.target.value)} className="p-2 border rounded" />

                  <label className="text-sm text-gray-600">Prezime</label>
                  <input value={form.prezime} onChange={e => onChange('prezime', e.target.value)} className="p-2 border rounded" />

                  <label className="text-sm text-gray-600">Email</label>
                  <input value={form.email} onChange={e => onChange('email', e.target.value)} className="p-2 border rounded" />

                  <label className="text-sm text-gray-600">Grad</label>
                  <input value={form.grad} onChange={e => onChange('grad', e.target.value)} className="p-2 border rounded" />

                  <label className="text-sm text-gray-600">Datum rođenja</label>
                  <input type="date" value={form.datumrodjenja || ''} onChange={e => onChange('datumrodjenja', e.target.value)} className="p-2 border rounded" />
                </div>

                <div className="flex gap-3 mt-2">
                  <button onClick={saveProfile} disabled={saving} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-60">
                    {saving ? 'Sačuvaj...' : 'Sačuvaj izmene'}
                  </button>
                  <button onClick={() => { setEditing(false); setForm({ ime: korisnik.ime || '', prezime: korisnik.prezime || '', email: korisnik.email || '', grad: korisnik.grad || '', datumrodjenja: korisnik.datumrodjenja ? korisnik.datumrodjenja.split('T')[0] : '' }); }} className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                    Otkaži
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}