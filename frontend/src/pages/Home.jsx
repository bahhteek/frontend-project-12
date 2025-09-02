import { useEffect, useState } from 'react'
import api from '../api'
import { getAuth } from '../auth'

export default function Home() {
  const { username } = getAuth() ?? {};
  const [status, setStatus] = useState('Загрузка каналов...');

  useEffect(() => {
    api.get('/api/v1/channels')
      .then(({ data }) => setStatus(`Каналы: ${data.length}`))
      .catch(() => setStatus('Не удалось загрузить каналы'));
  }, []);

  return (
    <>
      <h1>Чат (заглушка)</h1>
      <p>Вы вошли как: <b>{username}</b></p>
      <p>{status}</p>
    </>
  );
}
