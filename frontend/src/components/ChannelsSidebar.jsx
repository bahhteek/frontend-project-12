import { Button, ButtonGroup, Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { openModal, setActiveChannel } from '../store/slices/ui'

export default function ChannelsSidebar() {
  const dispatch = useDispatch()
  const { list } = useSelector(s => s.channels)
  const activeId = useSelector(s => s.ui.activeChannelId)
  const { t } = useTranslation()

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('sidebar.channels')}</b>
        <button
          onClick={() => dispatch(openModal({ type: 'add' }))}
          className="p-0 text-primary btn btn-group-vertical"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-plus-square"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {list.map((c) => {
          const isActive = String(c.id) === String(activeId)
          const baseBtnClass = `w-100 rounded-0 text-start text-truncate btn ${
            isActive ? 'btn-secondary' : ''
          }`

          if (!c.removable) {
            return (
              <li key={c.id} className="nav-item w-100">
                <button
                  type="button"
                  className={baseBtnClass}
                  onClick={() => dispatch(setActiveChannel(c.id))}
                  title={`# ${c.name}`}
                >
                  <span className="me-1">#</span>
                  {c.name}
                </button>
              </li>
            )
          }

          return (
            <li key={c.id} className="nav-item w-100">
              <Dropdown as={ButtonGroup} className="d-flex dropdown btn-group">
                <Button
                  type="button"
                  className={baseBtnClass}
                  variant={isActive ? 'secondary' : 'light'}
                  onClick={() => dispatch(setActiveChannel(c.id))}
                  title={`# ${c.name}`}
                >
                  <span className="me-1">#</span>
                  {c.name}
                </Button>

                <Dropdown.Toggle
                  split
                  className="flex-grow-0"
                  variant={isActive ? 'secondary' : 'light'}
                >
                  <span className="visually-hidden">
                    {t('sidebar.channelManagement')}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => dispatch(openModal({ type: 'rename', payload: c }))}
                  >
                    {t('sidebar.rename')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    disabled={!c.removable}
                    onClick={() => dispatch(openModal({ type: 'remove', payload: c }))}
                  >
                    {t('sidebar.delete')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
