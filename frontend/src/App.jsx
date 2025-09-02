import { Link, Route, Routes } from 'react-router-dom'
import { clearAuth, getAuth } from './auth'
import RequireAuth from './components/RequireAuth.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const auth = getAuth();

  return (
    <div style={{ padding: 16 }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
        {!auth ? <Link to="/login">Login</Link> : (
          <button onClick={() => { clearAuth(); location.href = '/login'; }}>
            Logout
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }/>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
