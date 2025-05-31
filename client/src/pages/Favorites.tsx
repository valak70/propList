import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import PropertyCard from '../components/PropertyCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/favorites');
        setFavorites(res.data);
      } catch (err) {
        setError('Failed to fetch favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Favorites</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {favorites.map((property: any) => (
          <PropertyCard key={property._id} property={property} favoriteIds={[property._id]} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
