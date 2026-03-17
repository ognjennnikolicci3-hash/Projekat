import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Sport {
  sportId: number;
  naziv: string;
  slika?: string;
  boja?: string;
}

const sportSlike: Record<string, { img: string; boja: string }> = {
  Fudbal: {
    img: "https://w0.peakpx.com/wallpaper/299/703/HD-wallpaper-football-field-abstract-art-football-stadium-soccer-stadium-football-stands.jpg",
    boja: "from-green-600/70 to-green-900/70"
  },
  Kosarka: {
    img: "https://4kwallpapers.com/images/wallpapers/basketball-do-it-now-3d-background-3840x2160-3746.jpg",
    boja: "from-orange-600/70 to-orange-900/70"
  },
  Padel: {
    img: "https://static01.nyt.com/images/2024/03/15/00xp-padel-78689-cover/00xp-padel-78689-cover-videoSixteenByNineJumbo1600.jpg",
    boja: "from-blue-600/70 to-blue-900/70"
  },
  StoniTenis: {
    img: "https://www.stonitenis-pardon.rs/images/slider3.jpg?1755475200088",
    boja: "from-cyan-600/70 to-cyan-900/70"
  },
  Tenis: {
    img: "https://rtcg.me/upload//media/2023/5/19/19/54/124/1406593/resize/1637048/Tenis_675x900_675x900",
    boja: "from-yellow-500/70 to-yellow-900/70"
  },
};

const Sportovi: React.FC = () => {
  const [sportovi, setSportovi] = useState<Sport[]>([]);
  const navigate = useNavigate();
// Učitavanje sportova sa backend-a
  useEffect(() => {
    const fetchSportovi = async () => {
      try {
        const res = await axios.get<Sport[]>("http://localhost:3000/sportovi", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        });
        setSportovi(
          res.data.map((s) => ({
            ...s,
            slika: sportSlike[s.naziv]?.img,
            boja: sportSlike[s.naziv]?.boja
          }))
        );
      } catch (err) {
        console.error("Greška pri učitavanju sportova:", err);
      }
    };
    fetchSportovi();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 px-6">
      <h2 className="text-5xl font-extrabold text-white mb-14 text-center tracking-wide">
        ⚡ Izaberi svoj sport
      </h2>

      {sportovi.length === 0 ? (
        <p className="text-gray-400 text-center text-lg">
          Trenutno nema dostupnih sportova.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {sportovi.map((s) => (
            <div
              key={s.sportId}
              onClick={() => navigate(`/dogadjaji/${s.sportId}`)}
              className="relative cursor-pointer rounded-2xl overflow-hidden shadow-lg group transform transition duration-500 hover:scale-105 hover:shadow-2xl"
            >
             
              <img
                src={
                  s.slika ||
                  "https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                }
                alt={s.naziv}
                className="w-full h-64 object-cover transform transition duration-500 group-hover:scale-110"
              />

             
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  s.boja || "from-gray-700/70 to-gray-900/70"
                } opacity-80 group-hover:opacity-90 transition`}
              ></div>

             
              <div className="absolute bottom-0 w-full text-center p-6">
                <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                  {s.naziv}
                </h3>
                <p className="text-sm text-gray-200 mt-2 opacity-90">
                  Klikni da vidiš događaje
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sportovi;