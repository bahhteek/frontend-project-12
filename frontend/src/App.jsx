import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Signup from './pages/Signup.jsx'
import { logout } from './store/slices/auth.js'

export default function App() {
  const user = useSelector(s => s.auth.user)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <Link className="navbar-brand" to="/">
            {t('nav.home')}
          </Link>
          {user && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => dispatch(logout())}
            >
              {t('nav.logout')}
            </button>
          )}
        </div>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            (
            <RequireAuth>
              <Home />
            </RequireAuth>
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
