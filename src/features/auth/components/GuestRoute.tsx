import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth';

export const GuestRoute = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to={'/'} />;
  }

  return <Outlet />;
};
