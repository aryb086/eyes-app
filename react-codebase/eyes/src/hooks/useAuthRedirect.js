import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to handle authentication redirects
 * @param {boolean} requireAuth - Whether authentication is required (true) or forbidden (false)
 * @param {string} redirectPath - Path to redirect to if condition is not met
 */
function useAuthRedirect(requireAuth = true, redirectPath = '/login') {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // If we require auth but user is not logged in, redirect to login
      if (requireAuth && !currentUser) {
        navigate(redirectPath, { 
          state: { from: window.location.pathname },
          replace: true 
        });
      }
      // If we don't require auth but user is logged in, redirect away (e.g., from login/register)
      else if (!requireAuth && currentUser) {
        navigate(redirectPath || '/feed', { replace: true });
      }
    }
  }, [currentUser, loading, requireAuth, redirectPath, navigate]);

  return { currentUser, loading };
}

export default useAuthRedirect;
