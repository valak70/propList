import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/authContext';

type Recommendation = {
    _id: string;
    from: {
        _id: string;
        name: string;
        email: string;
    };
    property: any;
};

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    const { user } = useAuth();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await api.get('/recommendations');
                setRecommendations(res.data);
            } catch (err) {
                setError('Failed to fetch recommendations');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);
    useEffect(() => {
        setFavoriteIds(user?.favorites || []);
    }, [user]);
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Recommendations</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {recommendations.map((rec) => (
                    <div key={rec._id}>
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-semibold">{rec.from.name}</span> ({rec.from.email}) recommended this:
                        </p>
                        <PropertyCard property={rec.property} favoriteIds={favoriteIds} />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Recommendations;
