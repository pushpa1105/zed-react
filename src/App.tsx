import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import '@/App.css'
import '@/index.css'
import MainLayout from '@/layouts/MainLayout'
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute'
import LoginPage from '@/pages/auth/login'
import { GuestRoute } from '@/lib/auth/GuestRoute'
import { AuthProvider } from '@/context/auth/AuthProvider'
import NotFound from '@/pages/not-found'
import TestPage from '@/pages/test'
import RegisterPage from '@/pages/auth/register'
import { WorkspaceProvider } from '@/context/workspace/WorkspaceProvider'
import CreateWorkspacePage from '@/pages/workspaces/create'
import { ROUTES } from '@/constants'
import Op from '@/pages/op'
import Dashboard from '@/pages/dashboard'
import WorkspaceLayout from '@/layouts/WorkspaceLayout'
import Pana from '@/pages/pana'


function App() {

  return (
    <>
      <Router>
        <AuthProvider>
          <WorkspaceProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route element={<ProtectedRoute />} >
                  <Route element={<WorkspaceLayout />} >
                    <Route path={ROUTES.ROOT} element={<Dashboard />} />
                    <Route path={ROUTES.PANA} element={<Pana />} />

                  </Route>
                  {/* Workspace Section --- BEGIN ---*/}
                  <Route path={ROUTES.CREATE_WORKSPACE} element={<CreateWorkspacePage />} />
                  {/* Workspace Section --- END ---*/}

                </Route>

                <Route element={<GuestRoute />} >
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                </Route>
              </Route>

              <Route path="/test" element={<TestPage />} />
              <Route path="/test2" element={<Op />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </WorkspaceProvider>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
