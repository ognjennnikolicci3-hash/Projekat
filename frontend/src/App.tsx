import React, { JSX } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sportovi from "./pages/Sportovi";
import Login from "./pages/Login";
import Profil from "./pages/Profil";
import Dogadjaji from "./pages/Dogadjaji";
import Registracija from "./pages/Register";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Kalendar from "./pages/Kalendar";
import KreirajDogadjaj from "./pages/KreirajDogadjaj";
import Korisnici from "./pages/Korisnici";
import DogadjajView from "./pages/DogadjajView";
import MojiDogadjaji from "./pages/MojiDogadjaji";
import KorisnikDogadjaji from "./pages/KorisnikDogadjaji";


function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registracija" element={<Registracija />} />
            <Route
              path="/profil"
              element={
                <PrivateRoute>
                  <Profil />
                </PrivateRoute>
              }
            />
            <Route
              path="/sportovi"
              element={
                <PrivateRoute>
                  <Sportovi />
                </PrivateRoute>
              }
            />
            <Route
              path="/dogadjaji/:sportId"
              element={
                <PrivateRoute>
                  <Dogadjaji />
                </PrivateRoute>
              }
            />
            <Route
              path="/dogadjaji/kreiraj"
              element={
                <PrivateRoute>
                  <KreirajDogadjaj />
                </PrivateRoute>
              }
            />
            <Route
              path="/kalendar"
              element={
                <PrivateRoute>
                  <Kalendar />
                </PrivateRoute>
              }
            />
            <Route
              path="/korisnici/:sportId/:dogadjajId"
              element={
                <PrivateRoute>
                  <Korisnici />
                </PrivateRoute>
              }
            />
            <Route
              path="/korisnik/:korisnikId/dogadjaji"
              element={
                <PrivateRoute>
                  <KorisnikDogadjaji />
                </PrivateRoute>
              }
            />
            <Route
              path="/dogadjaji/view/:id"
              element={
                <PrivateRoute>
                  <DogadjajView />
                </PrivateRoute>
              }
            />
            <Route
              path="/moji-dogadjaji"
              element={
                <PrivateRoute>
                  <MojiDogadjaji />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;