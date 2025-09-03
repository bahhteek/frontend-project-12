import { Button, ButtonGroup, Dropdown, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { openModal, setActiveChannel } from '../store/slices/ui'

export default function ChannelsSidebar() {
  const dispatch = useDispatch();
  const { list, status } = useSelector(s => s.channels);
  const activeId = useSelector(s => s.ui.activeChannelId);
  const {t} = useTranslation();

  return (
    <aside className="pe-3 border-end" style={{ width: 260 }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="m-0">{t("sidebar.channels")}</h5>
        <Button size="sm" onClick={() => dispatch(openModal({ type: "add" }))}>
          + {t("sidebar.add")}
        </Button>
      </div>

      {status === "loading" && <Spinner animation="border" size="sm" />}

      <div className="d-grid gap-2">
        {list.map((c) => (
          <ButtonGroup key={c.id}>
            <Button
              variant={String(c.id) === String(activeId) ? "primary" : "light"}
              className="text-start w-100 text-truncate"
              onClick={() => dispatch(setActiveChannel(c.id))}
              title={`# ${c.name}`}
            >
              # {c.name}
            </Button>
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle
                split
                variant={
                  String(c.id) === String(activeId) ? "primary" : "light"
                }
              />
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    dispatch(openModal({ type: "rename", payload: c }))
                  }
                >
                  {t("sidebar.rename")}
                </Dropdown.Item>
                <Dropdown.Item
                  disabled={!c.removable}
                  onClick={() =>
                    dispatch(openModal({ type: "remove", payload: c }))
                  }
                >
                  {t("sidebar.delete")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
        ))}
      </div>
    </aside>
  );
}
