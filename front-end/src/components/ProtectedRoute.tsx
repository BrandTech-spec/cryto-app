import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(requireAdmin);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user || !requireAdmin) {
        setAdminLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('admin_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

       
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, requireAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

 

  return <>{children}</>;
};

export default ProtectedRoute;