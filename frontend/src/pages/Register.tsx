import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface RegisterProps {
  onAuthChange?: () => void;
}

export default function Registracija({ onAuthChange }: RegisterProps) {
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [grad, setGrad] = useState("");
  const [datumrodjenja, setDatumRodjenja] = useState("");
  const [greska, setGreska] = useState("");
  const navigate = useNavigate();
// Funkcija za registraciju korisnika
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreska("");
 // Validacija datuma rođenja
    if (datumrodjenja) {
    const unetDatum = new Date(datumrodjenja);
    const danas = new Date();
    if (unetDatum > danas) {
      setGreska("Datum rođenja ne može biti u budućnosti.");
      return;
    }
  }
 // POST zahtev ka backendu
    try {
      const res = await axios.post("http://localhost:3000/korisnici/registracija", {
        ime,
        prezime,
        email,
        lozinka,
        grad,
        datumrodjenja
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("korisnik", JSON.stringify(res.data.korisnik));

        if (onAuthChange) onAuthChange(); 

        navigate("/sportovi");
      } else {
        navigate("/login");
      }
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        setGreska(err.response.data.message);
      } else {
        setGreska("Došlo je do greške. Pokušajte ponovo.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-xl rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Registracija</h2>

        <input
          type="text"
          placeholder="Ime"
          className="w-full border rounded-lg p-2 mb-3"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Prezime"
          className="w-full border rounded-lg p-2 mb-3"
          value={prezime}
          onChange={(e) => setPrezime(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Lozinka"
          className="w-full border rounded-lg p-2 mb-3"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Grad"
          className="w-full border rounded-lg p-2 mb-3"
          value={grad}
          onChange={(e) => setGrad(e.target.value)}
          required
        />

        <input
          type="date"
          placeholder="Datum rođenja"
          className="w-full border rounded-lg p-2 mb-3"
          value={datumrodjenja}
          onChange={(e) => setDatumRodjenja(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white rounded-lg p-2 hover:bg-green-700"
        >
          Registruj se
        </button>

        {greska && <p className="text-red-600 mt-3">{greska}</p>}

        <p className="mt-3 text-sm text-gray-600 text-center">
          Već imaš nalog?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Prijavi se
          </Link>
        </p>
      </form>
    </div>
  );
}
