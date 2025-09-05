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
  const dispatch = useDispatch()
  const { list: channels } = useSelector(s => s.channels)
  const { list: messages, status: msgStatus, sending } = useSelector(s => s.messages)
  const activeChannelId = useSelector(s => s.ui.activeChannelId)
  const [draft, setDraft] = useState('')
  const auth = getAuth()
  const modal = useSelector(s => s.ui.modal)
  const { t } = useTranslation()

  useEffect(() => {
    dispatch(fetchChannels()).then((res) => {
      const items = res.payload || []
      const general = items.find(c => c.name?.toLowerCase() === 'general')
      if (general) dispatch(setActiveChannel(general.id))
      else if (items[0]) dispatch(setActiveChannel(items[0].id))
    })
    dispatch(fetchMessages())
  }, [dispatch])

  useEffect(() => {
    const socket = createSocket()
    bindSocketEvents(socket, dispatch)
    return () => { 
      socket.close()
    }
  }, [dispatch])

  const channelMessages = useMemo(
    () => messages.filter((m) => String(m.channelId) === String(activeChannelId)),
    [messages, activeChannelId]
  )

  const onSubmit = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || sending || !activeChannelId) return

    dispatch(
      sendMessage({
        text,
        channelId: activeChannelId,
        username: auth?.username || 'user',
      })
    )
      .unwrap()
      .then(() => setDraft(''))
      .catch(() => {}); 
  }

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <ChannelsSidebar />
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>
                  #{' '}
                  {channels.find(
                    (c) => String(c.id) === String(activeChannelId)
                  )?.name ?? '—'}
                </b>
              </p>
              <span className="text-muted">
                {msgStatus === 'loading'
                  ? t('home.messagesLoading')
                  : `${channelMessages.length} ${t('home.messages')}`}
              </span>
            </div>
            <div
              id="messages-box"
              className="chat-messages overflow-auto px-5"
            >
              {channelMessages.map((m) => (
                <div className="text-break mb-2" key={m.id}>
                  <b>{m.username}</b>: {m.body}
                </div>
              ))}
            </div>
            <div className="mt-auto px-5 py-3">
              <form onSubmit={onSubmit} className="py-1 border rounded-2">
                <div className="input-group has-validation">
                  <input
                    placeholder={t('home.enterMessage')}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    disabled={sending}
                    className="border-0 p-0 ps-2 form-control"
                    aria-label={t('home.newMessage')}
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    className="btn btn-group-vertical"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-arrow-right-square"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
                      ></path>
                    </svg>
                    <span className="visually-hidden">{t('home.send')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <AddChannelModal show={modal?.type === 'add'} />
      <RenameChannelModal
        show={modal?.type === 'rename'}
        channel={modal?.payload}
      />
      <RemoveChannelModal
        show={modal?.type === 'remove'}
        channel={modal?.payload}
      />
    </div>
  )
}
