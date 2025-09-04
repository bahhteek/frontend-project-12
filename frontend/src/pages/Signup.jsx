import { Field, Form, Formik } from "formik"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import api from "../api"
import { login } from "../store/slices/auth"

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .trim()
      .required(t("signup.errors.required"))
      .min(3, t("signup.errors.shortLogin"))
      .max(20, t("signup.errors.shortLogin")),
    password: Yup.string()
      .min(6, t("signup.errors.shortPassword"))
      .required(t("signup.errors.required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("signup.errors.passwordsMustMatch")),
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  src="https://frontend-chat-ru.hexlet.app/assets/avatar_1-D7Cot-zE.jpg"
                  className="rounded-circle"
                  alt={t("signup.title")}
                />
              </div>

              <Formik
                initialValues={{
                  username: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={SignupSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  try {
                    const res = await api.post("/api/v1/signup", {
                      username: values.username,
                      password: values.password,
                    });
                    dispatch(login(res.data));
                    navigate("/");
                  } catch (error) {
                    if (error?.response?.status === 409) {
                      setErrors({
                        username: " ",
                        password: " ",
                        confirmPassword: t("signup.errors.userExists"),
                      });
                    } else {
                      setErrors({ username: t("signup.errors.generic") });
                    }
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, touched, errors }) => (
                  <Form className="w-50">
                    <h1 className="text-center mb-4">
                      {t("signup.title") ?? "Sign up"}
                    </h1>

                    <div className="form-floating mb-3">
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        autoFocus
                        placeholder={t("signup.username")}
                        required
                        className={`form-control ${
                          touched.username && errors.username
                            ? "is-invalid"
                            : ""
                        }`}
                        autoComplete="username"
                      />
                      <label htmlFor="username">{t("signup.username")}</label>
                      {touched.username && errors.username && (
                        <div className="invalid-tooltip">{errors.username}</div>
                      )}
                    </div>

                    <div className="form-floating mb-3">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder={t("signup.password")}
                        className={`form-control ${
                          touched.password && errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                        autoComplete="new-password"
                      />
                      <label htmlFor="password">{t("signup.password")}</label>
                      {touched.password && errors.password && (
                        <div className="invalid-tooltip">{errors.password}</div>
                      )}
                    </div>

                    <div className="form-floating mb-4">
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder={t("signup.confirmPassword")}
                        className={`form-control ${
                          touched.confirmPassword && errors.confirmPassword
                            ? "is-invalid"
                            : ""
                        }`}
                        autoComplete="new-password"
                      />
                      <label htmlFor="confirmPassword">
                        {t("signup.confirmPassword")}
                      </label>
                      {touched.confirmPassword && errors.confirmPassword && (
                        <div className="invalid-tooltip">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-100 btn btn-outline-primary"
                    >
                      {t("signup.submit")}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
