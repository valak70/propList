import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Favorites from './pages/Favorites';
import Recommendations from './pages/Recommendations';
import AddProperty from './pages/AddProperty';
import MyProperties from './pages/MyProperties';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
        <Route path="/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
        <Route path="/my-properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
