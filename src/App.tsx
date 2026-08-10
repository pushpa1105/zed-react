import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AuthProvider } from '@/features/auth';
import { GuestRoute } from '@/features/auth/components/GuestRoute';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { WorkspaceProvider } from '@/features/workspaces';

import { AppLoader } from '@/shared/components/loaders/AppLoader';
import { ROUTES } from '@/shared/constants';
import MainLayout from '@/shared/layouts/main-layout';
import WorkspaceLayout from '@/shared/layouts/workspace-layout';

import '@/App.css';
import '@/index.css';

const LoginPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.RegisterPage }))
);
const Dashboard = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.Dashboard }))
);
const Pana = lazy(() =>
  import('@/features/pana').then((m) => ({ default: m.Pana }))
);
const CreateWorkspace = lazy(() =>
  import('@/features/workspaces').then((m) => ({ default: m.CreateWorkspace }))
);
const NotFound = lazy(() => import('@/shared/pages/NotFound'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <WorkspaceProvider>
          <Suspense fallback={<AppLoader />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route element={<ProtectedRoute />}>
                  <Route element={<WorkspaceLayout />}>
                    <Route path={ROUTES.ROOT} element={<Dashboard />} />
                    <Route path={ROUTES.PANA} element={<Pana />} />
                  </Route>
                  <Route
                    path={ROUTES.CREATE_WORKSPACE}
                    element={<CreateWorkspace />}
                  />
                </Route>

                <Route element={<GuestRoute />}>
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </WorkspaceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
