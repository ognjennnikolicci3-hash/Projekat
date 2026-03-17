import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
 const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

   if (["/login", "/registracija"].includes(pathname)) {
    return <></>;

  }
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-xl font-bold">TandemZnanje</h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:underline">Početna</Link>
          </li>

          <li>
            <Link to="/sportovi" className="hover:underline">Sportovi</Link>
          </li>
{token ? (
            <>
             <li>
                <Link to="/dogadjaji/kreiraj" className="hover:underline">Kreiraj događaj</Link>
              </li>
               <li>
                <Link to="/kalendar" className="hover:underline">Kalendar</Link> { }
              </li>
              <li>
                <Link to="/profil" className="hover:underline">Profil</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:underline">Odjavi se</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="hover:underline">Login</Link>
            </li>
          )}
         
        </ul>
      </nav>
    </header>
  );
}
