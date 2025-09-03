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
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <div style={{ padding: 16 }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">{t("nav.home")}</Link>
        {!user ? (
          <>
            <Link to="/login">{t("nav.login")}</Link>
            <Link to="/signup">{t("nav.signup")}</Link>
          </>
        ) : (
          <button onClick={() => dispatch(logout())}>{t("nav.logout")}</button>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
