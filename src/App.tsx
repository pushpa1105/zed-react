import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import '@/App.css'
import '@/index.css'
import MainLayout from '@/layouts/MainLayout'
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute'
import LoginPage from '@/pages/auth/login'
import { GuestRoute } from '@/lib/auth/GuestRoute'
import Demo from '@/pages/demo'
import { AuthProvider } from '@/context/auth/AuthProvider'
import NotFound from '@/pages/not-found'

function App() {

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route element={<ProtectedRoute />} >
                <Route path='/' element={<Demo />} />
              </Route>

              <Route element={<GuestRoute />} >
                <Route path='/login' element={<LoginPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
