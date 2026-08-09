import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants';
import { useLoader } from '@/shared/context/loader';
import { withAsyncHandler } from '@/shared/utils';

import { fetchAuthenticatedUser, login, logout } from '../api';
import type { AuthUserType, LoginFormType } from '../types';

import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const { setAppLoading } = useLoader();
  const location = useLocation();
  const navigate = useNavigate();

  const setLoginInfo = (data: AuthUserType) => {
    if (!data) return;
    localStorage.setItem('isLoggedIn', 'true');
  };

  const clearAuthInfo = () => {
    localStorage.removeItem('isLoggedIn');
  };

  const signOut = async () => {
    await withAsyncHandler(() => logout(), {
      onSuccess: () => {
        clearAuthInfo();
        navigate(ROUTES.LOGIN);
      },
    });
  };

  const signIn = async (data: LoginFormType) => {
    await withAsyncHandler(() => login(data), {
      onSuccess: (res) => {
        const data = res?.data?.data;
        setCurrentUser(data?.user);
        navigate('/');
      },
    });
  };

  useEffect(() => {
    if ([ROUTES.LOGIN, ROUTES.REGISTER].includes(location.pathname)) {
      setAppLoading(false);
      return;
    }

    setAppLoading(true);
    fetchAuthenticatedUser()
      .then((res) => {
        const data = res?.data?.data;
        setCurrentUser(data);
        setLoginInfo(data);
      })
      .catch(() => {
        clearAuthInfo();
      })
      .finally(() => setAppLoading(false));
  }, [setCurrentUser, setAppLoading, location]);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, signOut, signIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
