import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Hook to check if user has premium features
export const usePremium = () => {
  const { user } = useAuth();
  
  // Check if user has premium access
  const hasPremium = user?.premium_unlocks?.length > 0 || false;
  
  // Check specific premium features
  const hasFeature = (featureName) => {
    if (!user?.premium_unlocks) return false;
    return user.premium_unlocks.some(unlock => unlock.feature === featureName);
  };
  
  return {
    hasPremium,
    hasFeature,
    premiumFeatures: user?.premium_unlocks || []
  };
};

// Hook to check authentication status
export const useAuthStatus = () => {
  const { user, loading } = useAuth();
  
  return {
    isAuthenticated: !!user,
    isLoading: loading,
    user
  };
};

export default useAuth;
