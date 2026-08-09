import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/features/auth';

import { AppLoader } from '@/shared/components/loaders/AppLoader';
import { ROUTES } from '@/shared/constants';
import { useLoader } from '@/shared/context/loader';

export const ProtectedRoute = () => {
  const { currentUser } = useAuth();
  const { appLoading } = useLoader();

  if (appLoading) return <AppLoader />;

  if (!currentUser) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return <Outlet />;
};
