import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useUserContext } from '@/context/AuthProvider';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useUserContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate()
  const [adminLoading, setAdminLoading] = useState(requireAdmin);
  
  

 
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
   return navigate('/landing')
  }


 

  return <>{children}</>;
};

export default ProtectedRoute;