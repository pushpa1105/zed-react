import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AuthProvider, LoginPage, RegisterPage } from '@/features/auth';
import { GuestRoute } from '@/features/auth/components/GuestRoute';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { Dashboard } from '@/features/dashboard';
import { Pana } from '@/features/pana';
import { CreateWorkspace, WorkspaceProvider } from '@/features/workspaces';

import { ROUTES } from '@/shared/constants';
import MainLayout from '@/shared/layouts/main-layout';
import WorkspaceLayout from '@/shared/layouts/workspace-layout';
import NotFound from '@/shared/pages/NotFound';

import '@/App.css';
import '@/index.css';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <WorkspaceProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route element={<ProtectedRoute />}>
                  <Route element={<WorkspaceLayout />}>
                    <Route path={ROUTES.ROOT} element={<Dashboard />} />
                    <Route path={ROUTES.PANA} element={<Pana />} />
                  </Route>
                  {/* Workspace Section --- BEGIN ---*/}
                  <Route
                    path={ROUTES.CREATE_WORKSPACE}
                    element={<CreateWorkspace />}
                  />
                  {/* Workspace Section --- END ---*/}
                </Route>

                <Route element={<GuestRoute />}>
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </WorkspaceProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
