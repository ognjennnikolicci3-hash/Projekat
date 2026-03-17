import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onAuthChange?: () => void;
}

export default function Login({ onAuthChange }: LoginProps) {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const navigate = useNavigate();
// Ako postoji token, odmah preusmeri na sportove
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/sportovi");
    }
  }, [navigate]);
// Funkcija za login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreska("");

    try {
      const res = await axios.post("http://localhost:3000/korisnici/login", {
        email,
        lozinka,
      });
 // Čuvamo token i korisnika u localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("korisnik", JSON.stringify(res.data.korisnik));
// Ako postoji callback za promenu auth stanja (Header), pozovi ga
      if (onAuthChange) onAuthChange(); // osvežavamo Header

      navigate("/home");
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        setGreska(err.response.data.message);
      } else {
        setGreska("Došlo je do greške. Pokušajte ponovo.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Prijava</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Lozinka"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 transition"
        >
          Prijavi se
        </button>

        {greska && <p className="text-red-600 mt-4 text-center">{greska}</p>}

        <p className="mt-4 text-sm text-gray-600 text-center">
          Nemaš nalog?{" "}
          <a
            href="/registracija"
            className="text-blue-600 hover:underline font-medium"
          >
            Registruj se
          </a>
        </p>
      </form>
    </div>
  );
}
