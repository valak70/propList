import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { EllipsisVertical } from 'lucide-react';
import EditPropertyForm from './EditPropertyForm';
import RecommendModal from './RecommendModal';

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

type Props = {
  property: Property;
  favoriteIds?: string[];
  isOwner?: boolean;
  onDelete?: (id: string) => void;
};

const PropertyCard = ({ property, favoriteIds, isOwner = false, onDelete }: Props) => {
  // const [recommending, setRecommending] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showRecommendModal, setShowRecommendModal] = useState(false);


  useEffect(() => {
    setIsFavorite(favoriteIds?.includes(property._id) ?? false);
  }, [favoriteIds, property._id]);

  const handleRecommend = () => {
    setShowRecommendModal(true);
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${property._id}`);
      } else {
        await api.post(`/favorites/${property._id}`);
      }
      setIsFavorite(!isFavorite);
    } catch {
      alert('Failed to toggle favorite');
    }
  };

  return (
    <div
      className="rounded-xl border-4 shadow-md p-4 hover:shadow-lg transition"
      style={{ borderColor: property.colorTheme || '#d1d5db' }}
    >
      {isOwner && (
        <div className='relative mb-2'>
          <div className="absolute top-2 right-2 z-10">
            <button onClick={() => setMenuOpen(!menuOpen)}><EllipsisVertical size={20} /></button>
            {menuOpen && (
              <div className="absolute right-0 bg-white shadow-md border rounded z-10 mt-1">

                <button
                  className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                  onClick={() => setShowEditForm(true)}
                >
                  Edit
                </button>

                <button
                  className="block w-full px-4 py-2 text-sm hover:bg-red-100 text-left text-red-600"
                  onClick={() => onDelete?.(property._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center mb-1">
        <h2 className="text-xl font-bold text-gray-800">{property.title}</h2>
        {property.isVerified && <span className="text-green-600 text-sm font-semibold p-1"> ☑️</span>}
      </div>

      <p className="text-gray-600">{property.city}, {property.state}</p>
      <p className="text-gray-500 text-sm">{property.type} • {property.listingType}</p>
      <p className="text-sm mt-1 text-gray-600">{property.furnished ? 'Furnished' : 'Unfurnished'}</p>
      <p className="text-gray-500 text-sm">{property.bedrooms} Bed • {property.bathrooms} Bath • {property.areaSqFt} SqFt</p>
      <p className="text-gray-800 mt-2 font-semibold">₹{property.price.toLocaleString()}</p>
      <p className="text-sm text-gray-600">Rating: {property.rating.toFixed(1)}</p>
      <p className="text-sm text-gray-600">
        <span >Available from:</span> {new Date(property.availableFrom).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <span >Listed by:</span> {property.listedBy}
      </p>
      <p className="text-sm text-gray-600">
        <span >Posted by:</span> {property.createdBy.name}({property.createdBy.email})
      </p>


      <div className="flex flex-wrap mt-2 gap-1">
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">amenities</span>
        {property.amenities.slice(0, 5).map((amenity) => (
          <span key={amenity} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{amenity}</span>
        ))}
      </div>

      <div className="flex flex-wrap mt-2 gap-1">
        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">tags</span>
        {property.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{tag}</span>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center gap-2">
        <button
          onClick={handleFavorite}
          className={`w-1/2 text-sm rounded-md py-2 font-medium ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-red-100'
            }`}
        >
          {isFavorite ? '♥ Favorited' : '♡ Favorite'}
        </button>
        <button
          onClick={handleRecommend}
          // disabled={recommending}
          className="w-1/2 text-sm rounded-md py-2 font-medium bg-gray-200 hover:bg-gray-300"
        >
           ➥ Recommend
        </button>
      </div>
      {showRecommendModal && (
        <RecommendModal propertyId={property._id} onClose={() => setShowRecommendModal(false)} />
      )}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-lg relative">
            <button onClick={() => setShowEditForm(false)} className="absolute top-2 right-2 text-gray-600">✕</button>
            {/* <h2 className="text-lg font-bold mb-4">Edit Property</h2> */}
            <EditPropertyForm propertyId={property._id} onClose={() => setShowEditForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyCard;
