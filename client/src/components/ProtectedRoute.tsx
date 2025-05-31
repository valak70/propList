// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import type { JSX } from 'react';

type Props = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
