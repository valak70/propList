import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/authContext';

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

const MyProperties = () => {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchMyProperties = async (pageNumber: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/properties/?createdBy=${user?._id}&page=${pageNumber}`);
      setProperties(res.data.properties);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (error) {
      setError('Failed to load properties.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      await api.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      alert('Delete failed');
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  useEffect(() => {
    if (authLoading || !user) return;
    fetchMyProperties(page);
  }, [user, page]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Properties</h2>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map(property => (
          <PropertyCard key={property._id} property={property} isOwner={true} onDelete={handleDelete} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-1 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p =>
              p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)
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
      )}
    </div>
  );
};

export default MyProperties;
