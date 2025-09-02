import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api'
import { getAuth } from '../auth'
import { createSocket } from '../socket'
import { bindSocketEvents } from '../socketBindings'
import { fetchChannels } from '../store/slices/channels'
import { fetchMessages, setSendError, setSending } from '../store/slices/messages'
import { setActiveChannel } from '../store/slices/ui'

export default function Home() {
  const dispatch = useDispatch();
  const { list: channels, status: chStatus } = useSelector(s => s.channels);
  const { list: messages, status: msgStatus, sending, sendError } = useSelector(s => s.messages);
  const activeChannelId = useSelector(s => s.ui.activeChannelId);
  const [draft, setDraft] = useState('');
  const auth = getAuth();

  useEffect(() => {
    dispatch(fetchChannels()).then((res) => {
      const items = res.payload || [];
      const general = items.find(c => c.name?.toLowerCase() === 'general');
      if (general) dispatch(setActiveChannel(general.id));
      else if (items[0]) dispatch(setActiveChannel(items[0].id));
    });
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    const socket = createSocket();
    bindSocketEvents(socket, dispatch);
    return () => { socket.close(); };
  }, [dispatch]);

  const channelMessages = useMemo(
    () => messages.filter((m) => String(m.channelId) === String(activeChannelId)),
    [messages, activeChannelId]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending || !activeChannelId) return;

    dispatch(setSending(true));
    try {
      await api.post('/api/v1/messages', {
        body: text,
        channelId: String(activeChannelId),
        username: auth?.username || 'user',
      });
      setDraft('');
    } catch (err) {
      dispatch(setSendError('Не удалось отправить сообщение. Проверьте сеть.'));
    } finally {
      dispatch(setSending(false));
    }
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', height:'calc(100vh - 100px)', gap:16 }}>
      <aside style={{ borderRight:'1px solid #eee', paddingRight:12 }}>
        <h3 style={{ marginTop:0 }}>Каналы</h3>
        {chStatus === 'loading' && <div>Загрузка...</div>}
        <ul style={{ listStyle:'none', padding:0, margin:0 }}>
          {channels.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => dispatch(setActiveChannel(c.id))}
                style={{
                  width:'100%', textAlign:'left', padding:'8px 10px', marginBottom:6,
                  borderRadius:6, border:'1px solid #ddd',
                  background: String(c.id) === String(activeChannelId) ? '#f4f6ff' : '#fff'
                }}
              >
                #{c.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section style={{ display:'flex', flexDirection:'column' }}>
        <header style={{ borderBottom:'1px solid #eee', paddingBottom:8, marginBottom:8 }}>
          <b>Канал:</b> {channels.find(c => String(c.id) === String(activeChannelId))?.name ?? '—'}
          <span style={{ marginLeft:10, opacity:.6, fontSize:12 }}>
            {msgStatus === 'loading' ? 'Загрузка сообщений…' : `${channelMessages.length} сообщений`}
          </span>
        </header>

        <div style={{ flex:1, overflow:'auto', paddingRight:10 }}>
          {channelMessages.map((m) => (
            <div key={m.id} style={{ marginBottom:8 }}>
              <b>{m.username}</b>: {m.body}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} style={{ display:'flex', gap:8, marginTop:8 }}>
          <input
            placeholder={`Сообщение как ${auth?.username ?? 'user'}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={sending}
            style={{ flex:1, padding:'10px 12px', border:'1px solid #ddd', borderRadius:6 }}
          />
          <button type="submit" disabled={!draft.trim() || sending} style={{ padding:'10px 14px' }}>
            {sending ? 'Отправка…' : 'Отправить'}
          </button>
        </form>
        {sendError && <div style={{ color:'#f33', marginTop:6 }}>{sendError}</div>}
      </section>
    </div>
  );
}
