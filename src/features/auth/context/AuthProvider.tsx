import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants';
import { useLoader } from '@/shared/context/loader';
import { withAsyncHandler } from '@/shared/utils';

import { fetchAuthenticatedUser, login, logout } from '../api';
import type { AuthUserType, LoginFormType } from '../types';

import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUserType | null>(null);
  const { setAppLoading } = useLoader();
  const navigate = useNavigate();

  const signOut = useCallback(async () => {
    await withAsyncHandler(() => logout(), {
      onSuccess: () => {
        setCurrentUser(null);
        navigate(ROUTES.LOGIN);
      },
    });
  }, [navigate]);

  const signIn = useCallback(
    async (data: LoginFormType) => {
      await withAsyncHandler(() => login(data), {
        onSuccess: (res) => {
          const data = res?.data?.data;
          setCurrentUser(data?.user);
          navigate('/');
        },
      });
    },
    [navigate]
  );

  useEffect(() => {
    setAppLoading(true);
    fetchAuthenticatedUser()
      .then((res) => {
        const data = res?.data?.data;
        setCurrentUser(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setAppLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, signOut, signIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
