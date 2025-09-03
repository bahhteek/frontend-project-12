import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { removeChannel } from '../../store/slices/channels'
import { closeModal } from '../../store/slices/ui'

export default function RemoveChannelModal({ show, channel }) {
  const dispatch = useDispatch();

  const onRemove = async (e) => {
    e.preventDefault();
    try {
      await dispatch(removeChannel(channel.id)).unwrap();
      dispatch(closeModal());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={show} onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton><Modal.Title>Удалить канал</Modal.Title></Modal.Header>
      <form onSubmit={onRemove}>
        <Modal.Body>
          Точно удалить канал <b>#{channel?.name}</b>? Его сообщения будут удалены.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => dispatch(closeModal())}>Отмена</Button>
          <Button type="submit" variant="danger">Удалить</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
