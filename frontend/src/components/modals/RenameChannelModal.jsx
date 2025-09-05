import { Form as F, Field, Formik } from 'formik'
import { useEffect, useRef } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { renameChannel } from '../../store/slices/channels'
import { closeModal } from '../../store/slices/ui'

export default function RenameChannelModal({ show, channel }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const channels = useSelector(s => s.channels.list)
  const inputRef = useRef(null)
  useEffect(() => { 
    if (show) setTimeout(() => { 
      inputRef.current?.select();
    }, 0)
  }, [show])

  const otherNames = new Set(channels.filter(c => c.id !== channel?.id).map(c => c.name.trim().toLowerCase()))
  const Schema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, t('renameChannelModal.shortName'))
      .max(20, t('renameChannelModal.shortName'))
      .notOneOf([...otherNames], t('renameChannelModal.nameIsBusy'))
      .required(t('renameChannelModal.required')),
  })

  return (
    <Modal show={show} onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("renameChannelModal.renemaChannel")}</Modal.Title>
      </Modal.Header>
      <Formik
        enableReinitialize
        initialValues={{ name: channel?.name ?? "" }}
        validationSchema={Schema}
        onSubmit={async ({ name }, { setSubmitting, setStatus }) => {
          try {
            await dispatch(
              renameChannel({ id: channel.id, name: name.trim() })
            ).unwrap();
            dispatch(closeModal());
          } catch (error) {
            console.log(error);
            setStatus(t("renameChannelModal.error"));
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting, status }) => (
          <F>
            <Modal.Body>
              <Form.Group>
                <Field
                  innerRef={inputRef}
                  id="name"
                  name="name"
                  className={`form-control mb-2 ${
                    touched.name && errors.name ? "is-invalid" : ""
                  }`}
                />
                <label className="visually-hidden" htmlFor="name">
                  {t("renameChannelModal.name")}
                </label>
                {touched.name && errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
                {status && <div className="invalid-feedback">{status}</div>}
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    onClick={() => dispatch(closeModal())}
                    className="me-2 btn btn-secondary"
                  >
                    {t("renameChannelModal.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    {t("renameChannelModal.send")}
                  </Button>
                </div>
              </Form.Group>
            </Modal.Body>
          </F>
        )}
      </Formik>
    </Modal>
  );
}
