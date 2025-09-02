import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
