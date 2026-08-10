import { createContext } from 'react';

import type { AuthUserType, LoginFormType } from '../types';

export const AuthContext = createContext({
  currentUser: null as AuthUserType | null,
  setCurrentUser: (_: AuthUserType | null) => {},
  signOut: () => {},
  signIn: (_: LoginFormType) => {},
});
