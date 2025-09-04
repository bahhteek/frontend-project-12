import { Field, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../api'
import { login } from '../store/slices/auth'

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || '/';
  const {t} = useTranslation();

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src="https://frontend-chat-ru.hexlet.app/assets/avatar-DIE1AEpS.jpg"
                  className="rounded-circle"
                  alt="Войти"
                ></img>
              </div>
              <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setSubmitting, setStatus }) => {
                  setStatus(null);
                  try {
                    const { data } = await api.post("/api/v1/login", values);
                    dispatch(
                      login({ token: data.token, username: data.username })
                    );
                    navigate(from, { replace: true });
                  } catch (error) {
                    console.log(error);
                    setStatus(t("login.invalid"));
                  } finally {
                    setSubmitting(false);
                  }
                }}
                validate={(v) => {
                  const errors = {};
                  if (!v.username) errors.username = t("login.enterUsername");
                  if (!v.password) errors.password = t("login.enterPassword");
                  return errors;
                }}
              >
                {({ isSubmitting, status }) => (
                  <Form className="col-12 col-md-6 mt-3 mt-md-0">
                    <h1 className="text-center mb-4">{t("login.submit")}</h1>
                    <div className="form-floating mb-3">
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        required
                        placeholder={t("login.username")}
                        className={`form-control ${status && "is-invalid"}`}
                      />
                      <label htmlFor="username">{t("login.username")}</label>
                    </div>

                    <div className="form-floating mb-4">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder={t("login.password")}
                        className={`form-control ${status && "is-invalid"}`}
                      />
                      <label className="form-label" htmlFor="password">
                        {t("login.password")}
                      </label>
                      {status && (
                        <div className="invalid-tooltip">
                          {t("login.invalid")}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-100 mb-3 btn btn-outline-primary"
                    >
                      {t("login.submit")}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t("login.noAccaunt")}</span>{" "}
                <Link to="/signup">{t("login.register")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
