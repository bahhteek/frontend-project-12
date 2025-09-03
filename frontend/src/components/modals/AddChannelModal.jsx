import { Form as F, Field, Formik } from 'formik'
import { useEffect, useRef } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { addChannel } from '../../store/slices/channels'
import { closeModal } from '../../store/slices/ui'

export default function AddChannelModal({ show }) {
  const dispatch = useDispatch();
  const channels = useSelector(s => s.channels.list);
  const inputRef = useRef(null);
  const {t} = useTranslation();

  useEffect(() => { if (show) { setTimeout(() => { inputRef.current?.focus(); }, 0); } }, [show]);

  const names = new Set(channels.map(c => c.name.trim().toLowerCase()));
  const Schema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, t("addChannelModal.fromThreeSym"))
      .max(20, t("addChannelModal.toTwentySym"))
      .notOneOf([...names], t("addChannelModal.nameIsBusy"))
      .required(t("addChannelModal.requiredField")),
  });

  return (
    <Modal show={show} onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>{t("addChannelModal.newChannel")}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: "" }}
        validationSchema={Schema}
        onSubmit={async ({ name }, { setSubmitting, setStatus }) => {
          try {
            await dispatch(addChannel(name.trim())).unwrap();
            dispatch(closeModal());
          } catch (error){
            console.log(error);
            setStatus(t("addChannelModal.creatingError"));
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting, status }) => (
          <F>
            <Modal.Body>
              <Form.Group>
                <Form.Label htmlFor="name">
                  {t("addChannelModal.name")}
                </Form.Label>
                <Field
                  innerRef={inputRef}
                  id="name"
                  name="name"
                  className={`form-control ${
                    touched.name && errors.name ? "is-invalid" : ""
                  }`}
                />
                {touched.name && errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
                {status && <div className="text-danger mt-2">{status}</div>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => dispatch(closeModal())}
              >
                {t("addChannelModal.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {t("addChannelModal.create")}
              </Button>
            </Modal.Footer>
          </F>
        )}
      </Formik>
    </Modal>
  );
}
