import { useEffect, useState } from 'react';
import { api } from '../api/axios';

const EditPropertyForm = ({
    propertyId,
    onClose,
}: {
    propertyId: string;
    onClose: () => void;
}) => {
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        price: '',
        city: '',
        state: '',
        areaSqFt: '',
        bedrooms: '',
        bathrooms: '',
        amenities: '',
        furnished: false,
        listedBy: '',
        availableFrom: '',
        listingType: '',
        tags: '',
        rating: '',
        colorTheme: '',
        isVerified: false,
    });

    useEffect(() => {
        api.get(`/properties/${propertyId}`)
            .then(res => {
                const property = res.data;
                setFormData({
                    ...property,
                    price: property.price.toString(),
                    areaSqFt: property.areaSqFt.toString(),
                    bedrooms: property.bedrooms.toString(),
                    bathrooms: property.bathrooms.toString(),
                    rating: property.rating.toString(),
                    amenities: property.amenities.join(', '),
                    tags: property.tags.join(', '),
                });
            })
            .catch(() => alert('Failed to fetch property data'));
    }, [propertyId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? target.checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                areaSqFt: Number(formData.areaSqFt),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                rating: Number(formData.rating),
                amenities: formData.amenities.split(',').map(a => a.trim()),
                tags: formData.tags.split(',').map(t => t.trim()),
            };

            await api.put(`/properties/${propertyId}`, payload);
            location.reload(); // Reload to reflect changes
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update property');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Property</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" required />
                <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="Type (e.g., Apartment)" className="w-full p-2 border rounded" required />
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" required />
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded" required />
                <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full p-2 border rounded" required />
                <input type="number" name="areaSqFt" value={formData.areaSqFt} onChange={handleChange} placeholder="Area (SqFt)" className="w-full p-2 border rounded" />
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" className="w-full p-2 border rounded" />
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Bathrooms" className="w-full p-2 border rounded" />
                <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Amenities (comma separated)" className="w-full p-2 border rounded" />
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full p-2 border rounded" />
                <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="number" name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating (0-5)" className="w-full p-2 border rounded" />
                <select name="listingType" value={formData.listingType} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Listing Type</option>
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                </select>
                <select name="listedBy" value={formData.listedBy} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Listed By</option>
                    <option value="owner">Owner</option>
                    <option value="builder">Builder</option>
                    <option value="agent">Agent</option>
                </select>
                <div className="flex items-center space-x-2">
                    <input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} />
                    <label>Furnished</label>
                </div>
                {/* <div className="flex items-center space-x-2">
                    <input type="checkbox" name="verified" checked={formData.isVerified} onChange={handleChange} />
                    <label>Verified</label>
                </div> */}
                <input type='text' name='colorTheme' value={formData.colorTheme} onChange={handleChange} placeholder='Color Theme #abcdef' className='w-full p-2 border rounded' />
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
                    <button type="submit" className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800">Update</button>
                </div>
            </form>
        </div>

    );
};

export default EditPropertyForm;
