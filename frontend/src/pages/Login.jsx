import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api'
import { login } from '../store/slices/auth'

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || '/';
  const {t} = useTranslation();

  return (
    <div style={{ maxWidth: 360 }}>
      <h1>{t("login.title")}</h1>

      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(null);
          try {
            const { data } = await api.post('/api/v1/login', values);
            dispatch(login({ token: data.token, username: data.username }));
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
        {({ isSubmitting, touched, errors, status }) => (
          <Form>
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="username">{t('login.username')}</label>
              <Field id="username" name="username" type="text" placeholder={t("login.username")}
                style={{ display:'block', width:'100%', padding:8, marginTop:4,
                  border:`1px solid ${touched.username && errors.username ? '#f33' : '#ccc'}`, borderRadius:6 }}/>
              <div style={{ color:'#f33', fontSize:12, marginTop:4 }}>
                <ErrorMessage name="username" />
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label htmlFor="password">{t("login.password")}</label>
              <Field id="password" name="password" type="password" placeholder={t("login.password")}
                style={{ display:'block', width:'100%', padding:8, marginTop:4,
                  border:`1px solid ${touched.password && errors.password ? '#f33' : '#ccc'}`, borderRadius:6 }}/>
              <div style={{ color:'#f33', fontSize:12, marginTop:4 }}>
                <ErrorMessage name="password" />
              </div>
            </div>

            {status && <div style={{ color:'#f33', marginBottom:8 }}>{status}</div>}

            <button type="submit" disabled={isSubmitting} style={{ padding:'8px 12px' }}>
              {t('login.submit')}
            </button>
            <div style={{ fontSize:12, opacity:0.7, marginTop:8 }}>
              {t('login.testCreds')}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
