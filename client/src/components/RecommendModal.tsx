import { useState } from 'react';
import { api } from '../api/axios';

type Props = {
  propertyId: string;
  onClose: () => void;
};

const RecommendModal = ({ propertyId, onClose }: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!email) return setMessage('Please enter an email');
    try {
      setLoading(true);
      await api.post('/recommendations', { propertyId, email });
      setMessage('Property recommended successfully!');
      setTimeout(onClose, 1500); // auto-close after success
    } catch (err) {
      setMessage('Failed to recommend property.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">✕</button>
        <h2 className="text-lg font-semibold mb-4">Recommend Property</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter recipient's email"
          className="w-full p-2 border rounded mb-3"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
        >
          {loading ? 'Sending...' : 'Send Recommendation'}
        </button>

        {message && <p className="text-sm text-center mt-3 text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default RecommendModal;
