import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const data = JSON.parse(saved);
      setUser(data.user);
      setToken(data.token);
    }
  }, []);

  const login = (userData: any, jwt: string) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("auth", JSON.stringify({ user: userData, token: jwt }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  return { user, token, login, logout };
}
