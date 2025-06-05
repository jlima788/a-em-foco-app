
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user && location.pathname !== '/auth') {
        // Redirect to auth page if authentication is required but user is not logged in
        navigate('/auth');
      } else if (!requireAuth && user && location.pathname === '/auth') {
        // Redirect to home if user is logged in but trying to access auth page
        navigate('/');
      }
    }
  }, [user, loading, navigate, location.pathname, requireAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
