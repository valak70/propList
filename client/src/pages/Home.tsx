import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import PropertyFilters from '../components/PropertyFilters'; // UI form for filters

type Property = {
  _id: string;
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: boolean;
  availableFrom: string;
  listedBy: string;
  tags: string[];
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: string;
  createdBy: {
    _id: string;
    name?: string;
    email: string;
  };
};

const Home = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const { user } = useAuth();

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      for (const key in filters) {
        if (filters[key]) params.append(key, filters[key]);
      }
      params.append('page', page.toString());

      const res = await api.get(`/properties?${params.toString()}`);
      setProperties(res.data.properties);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      setError('Failed to load properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFavoriteIds(user?.favorites || []);
  }, [user]);

  useEffect(() => {
    fetchProperties();
  }, [filters, page]);

  const handleFilterApply = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1); // Reset page when filters are changed
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Browse Properties</h1>

      <PropertyFilters onApply={handleFilterApply} />

      {loading && <p className="text-gray-600 mt-4">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} favoriteIds={favoriteIds} />
        ))}
      </div>

      <Link to="/add-property" className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-900">
        + Add Property
      </Link>

      <div className="flex justify-center mt-8 space-x-1 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) =>
            p === 1 ||
            p === totalPages ||
            (p >= page - 1 && p <= page + 1)
          )
          .reduce((acc: (number | string)[], curr, i, arr) => {
            if (i > 0 && curr - (arr[i - 1] as number) > 1) {
              acc.push('...');
            }
            acc.push(curr);
            return acc;
          }, [])
          .map((item, idx) =>
            typeof item === 'number' ? (
              <button
                key={idx}
                onClick={() => goToPage(item)}
                className={`px-3 py-2 rounded ${item === page ? 'bg-gray-800 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {item}
              </button>
            ) : (
              <span key={idx} className="px-2 py-2">...</span>
            )
          )}

        <button
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
