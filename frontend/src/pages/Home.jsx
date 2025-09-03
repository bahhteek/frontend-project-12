import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth } from '../auth'
import ChannelsSidebar from '../components/ChannelsSidebar'
import AddChannelModal from '../components/modals/AddChannelModal'
import RemoveChannelModal from '../components/modals/RemoveChannelModal'
import RenameChannelModal from '../components/modals/RenameChannelModal'
import { createSocket } from '../socket'
import { bindSocketEvents } from '../socketBindings'
import { fetchChannels } from '../store/slices/channels'
import { fetchMessages, sendMessage } from '../store/slices/messages'
import { setActiveChannel } from '../store/slices/ui'

export default function Home() {
  const dispatch = useDispatch();
  const { list: channels } = useSelector(s => s.channels);
  const { list: messages, status: msgStatus, sending, sendError } = useSelector(s => s.messages);
  const activeChannelId = useSelector(s => s.ui.activeChannelId);
  const [draft, setDraft] = useState('');
  const auth = getAuth();
  const modal = useSelector(s => s.ui.modal);
  const {t} = useTranslation();

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

  const onSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending || !activeChannelId) return;

    dispatch(
      sendMessage({
        text,
        channelId: activeChannelId,
        username: auth?.username || "user",
      })
    )
      .unwrap()
      .then(() => setDraft("")) // очищаем только если успех
      .catch(() => {}); // ошибки уже в slice
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        height: "calc(100vh - 100px)",
        gap: 16,
      }}
    >
      <ChannelsSidebar />
      <section style={{ display: "flex", flexDirection: "column" }}>
        <header
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: 8,
            marginBottom: 8,
          }}
        >
          <b>{t("home.channel")}:</b>{" "}
          {channels.find((c) => String(c.id) === String(activeChannelId))
            ?.name ?? "—"}
          <span style={{ marginLeft: 10, opacity: 0.6, fontSize: 12 }}>
            {msgStatus === "loading"
              ? t("home.messagesLoading")
              : `${channelMessages.length} ${t("home.messages")}`}
          </span>
        </header>

        <div style={{ flex: 1, overflow: "auto", paddingRight: 10 }}>
          {channelMessages.map((m) => (
            <div key={m.id} style={{ marginBottom: 8 }}>
              <b>{m.username}</b>: {m.body}
            </div>
          ))}
        </div>

        <form
          onSubmit={onSubmit}
          style={{ display: "flex", gap: 8, marginTop: 8 }}
        >
          <input
            placeholder={`${t("home.messageAs")} ${auth?.username ?? "user"}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={sending}
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 6,
            }}
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            style={{ padding: "10px 14px" }}
          >
            {sending ? t("home.sending") : t("home.send")}
          </button>
        </form>
        {sendError && (
          <div style={{ color: "#f33", marginTop: 6 }}>{sendError}</div>
        )}
      </section>
      <AddChannelModal show={modal?.type === "add"} />
      <RenameChannelModal
        show={modal?.type === "rename"}
        channel={modal?.payload}
      />
      <RemoveChannelModal
        show={modal?.type === "remove"}
        channel={modal?.payload}
      />
    </div>
  );
}
