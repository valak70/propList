import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // adjust the path as needed
import { api } from '../api/axios';


const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth();

  const logout = async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
    setUser(null);
    navigate('/login');
  };

  if (loading) return null;

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
  <Link to="/" className="flex items-center space-x-2">
    <img
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' ry='10' fill='%23000000'/%3E%3Cpath d='M20 14h24v36H20z' fill='%23fff'/%3E%3Crect x='24' y='18' width='4' height='6' fill='%23000000'/%3E%3Crect x='36' y='18' width='4' height='6' fill='%23000000'/%3E%3Crect x='24' y='28' width='4' height='6' fill='%23000000'/%3E%3Crect x='36' y='28' width='4' height='6' fill='%23000000'/%3E%3Crect x='28' y='38' width='8' height='8' fill='%23000000'/%3E%3C/svg%3E"
      alt="logo"
      className="w-6 h-6"
    />
    <span className="text-2xl font-bold text-gray-800">PropList</span>
  </Link>

  <div className="space-x-4">
    {user ? (
      <>
        <Link to="/my-properties" className="text-gray-700 hover:text-purple-600">My Properties</Link>
        <Link to="/favorites" className="text-gray-700 hover:text-purple-600">Favorites</Link>
        <Link to="/recommendations" className="text-gray-700 hover:text-purple-600">Recommendations</Link>
        <button onClick={logout} className="text-red-600 font-medium">Logout</button>
      </>
    ) : (
      <>
        <Link to="/login" className="text-gray-700 hover:text-purple-600">Login</Link>
        <Link to="/register" className="text-gray-700 hover:text-purple-600">Register</Link>
      </>
    )}
  </div>
</nav>

  );
};

export default Navbar;
