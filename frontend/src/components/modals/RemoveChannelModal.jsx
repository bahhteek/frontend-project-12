import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { removeChannel } from '../../store/slices/channels'
import { closeModal } from '../../store/slices/ui'

export default function RemoveChannelModal({ show, channel }) {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const onRemove = async (e) => {
    e.preventDefault()
    try {
      await dispatch(removeChannel(channel.id)).unwrap();
      dispatch(closeModal())
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal show={show} onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('removeChannelModal.deleteChannel')}</Modal.Title>
      </Modal.Header>
      <form onSubmit={onRemove}>
        <Modal.Body>
          <p className='lead'>{t('removeChannelModal.agreeDelete')}</p>
          <div className='d-flex justify-content-end'>
            <Button
              variant='secondary'
              onClick={() => dispatch(closeModal())}
              className='me-2 btn btn-secondary'
            >
              {t('removeChannelModal.cancel')}
            </Button>
            <Button type='submit' variant='danger' className='btn btn-danger'>
              {t('removeChannelModal.delete')}
            </Button>
          </div>
        </Modal.Body>
      </form>
    </Modal>
  )
}
