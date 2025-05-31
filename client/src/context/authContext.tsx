import { createContext, useEffect, useState, useContext } from 'react';
import { api } from '../api/axios';

type User = any


const AuthContext = createContext<{
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  loading: boolean;
}>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
