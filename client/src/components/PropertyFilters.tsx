import { useState } from 'react';

const PropertyFilters = ({ onApply }: { onApply: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    type: '',
    furnished: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    bedrooms: '',
    bathrooms: '',
    rating: '',
    amenities: '',
    tags: '',
    sort: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-2 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input name="city" value={filters.city} onChange={handleChange} placeholder="City" className="p-2 border rounded" />
        <input name="state" value={filters.state} onChange={handleChange} placeholder="State" className="p-2 border rounded" />
        <input name="type" value={filters.type} onChange={handleChange} placeholder="Type" className="p-2 border rounded" />
        <select name="furnished" value={filters.furnished} onChange={handleChange} className="p-2 border rounded">
          <option value="">Furnished?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <select name="listingType" value={filters.listingType} onChange={handleChange} className="p-2 border rounded">
          <option value="">Listing Type</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>
        <input name="minPrice" value={filters.minPrice} onChange={handleChange} placeholder="Min Price" className="p-2 border rounded" />
        <input name="maxPrice" value={filters.maxPrice} onChange={handleChange} placeholder="Max Price" className="p-2 border rounded" />
        <input name="minArea" value={filters.minArea} onChange={handleChange} placeholder="Min Area (sqft)" className="p-2 border rounded" />
        <input name="maxArea" value={filters.maxArea} onChange={handleChange} placeholder="Max Area (sqft)" className="p-2 border rounded" />
        <input name="bedrooms" value={filters.bedrooms} onChange={handleChange} placeholder="Bedrooms" className="p-2 border rounded" />
        <input name="bathrooms" value={filters.bathrooms} onChange={handleChange} placeholder="Bathrooms" className="p-2 border rounded" />
        <input name="rating" value={filters.rating} onChange={handleChange} placeholder="Min Rating" className="p-2 border rounded" />
        <input name="amenities" value={filters.amenities} onChange={handleChange} placeholder="Amenities (comma)" className="p-2 border rounded" />
        <input name="tags" value={filters.tags} onChange={handleChange} placeholder="Tags (comma)" className="p-2 border rounded" />
        <select name="sort" value={filters.sort} onChange={handleChange} className="p-2 border rounded">
          <option value="">Sort By</option>
          <option value="price">Price Increasing</option>
          <option value="-price">Price Decreasing</option>
          <option value="rating">Rating Increasing</option>
          <option value="-rating">Rating Decreasing</option>
        </select>
      </div>
      <button onClick={handleApply} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        Apply Filters
      </button>
    </div>
  );
};

export default PropertyFilters;
