import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {  }
      <section className="relative min-h-screen flex items-center justify-center">
        <img
          src="https://wallpapers.com/images/featured/best-sports-9mo6eiyv8hxj5jln.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
            Dobrodošli u <span className="text-blue-500">TandemZnanje</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Pronađite sportske događaje, povežite se sa zajednicom i uživajte u
            vrhunskom iskustvu na jednom mestu.
          </p>
          <button
            onClick={() => navigate("/sportovi")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-full text-lg transition-transform hover:scale-105 shadow-lg"
          >
            Pogledaj Sportove
          </button>
        </div>
      </section>

      { }
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ⚡
            </div>
            <h3 className="text-xl font-semibold mb-2">Brza registracija</h3>
            <p className="text-gray-600">
              Kreirajte nalog i pridružite se događajima u nekoliko klikova.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🏆
            </div>
            <h3 className="text-xl font-semibold mb-2">Ekskluzivni događaji</h3>
            <p className="text-gray-600">
              Pristup najnovijim i najpopularnijim sportskim događajima u tvojoj oblasti.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🌐
            </div>
            <h3 className="text-xl font-semibold mb-2">Globalna zajednica</h3>
            <p className="text-gray-600">
              Povežite se sa ljubiteljima sporta širom sveta i učestvujte u zajednici.
            </p>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;