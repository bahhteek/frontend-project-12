import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import * as Yup from "yup"
import api from "../api"
import { login } from "../store/slices/auth"

const SignupSchema = Yup.object().shape({
  username: Yup.string().min(3).max(20).required("Обязательное поле"),
  password: Yup.string().min(6, "Не менее 6 символов").required("Обязательное поле"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Пароли должны совпадать")
    .required("Обязательное поле"),
});

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { username: "", password: "", confirmPassword: "" },
    validationSchema: SignupSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await api.post("/api/v1/signup", {
          username: values.username,
          password: values.password,
        });
        dispatch(login(res.data));
        navigate("/");
      } catch (err) {
        if (err.response?.status === 409) {
          setErrors({ username: "Такой пользователь уже существует" });
        } else {
          setErrors({ username: "Ошибка регистрации, попробуйте снова" });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Регистрация</h2>
      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            name="username"
            placeholder="Имя пользователя"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          {formik.errors.username && formik.touched.username && (
            <div style={{ color: "red" }}>{formik.errors.username}</div>
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.errors.password && formik.touched.password && (
            <div style={{ color: "red" }}>{formik.errors.password}</div>
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Подтверждение пароля"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <div style={{ color: "red" }}>{formik.errors.confirmPassword}</div>
          )}
        </div>
        <button type="submit" disabled={formik.isSubmitting}>
          Зарегистрироваться
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}
