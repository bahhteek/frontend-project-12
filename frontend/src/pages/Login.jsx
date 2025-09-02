import { ErrorMessage, Field, Form, Formik } from 'formik'

export default function Login() {
  return (
    <div style={{ maxWidth: 360 }}>
      <h1>Вход</h1>

      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values, { setSubmitting }) => {
          console.log('Submit disabled on step 2. Values:', values);
          setSubmitting(false);
        }}
        validate={(values) => {
          const errors = {};
          if (!values.username) errors.username = 'Укажите имя пользователя';
          if (!values.password) errors.password = 'Укажите пароль';
          return errors;
        }}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form>
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="username">Имя пользователя</label>
              <Field
                id="username"
                name="username"
                type="text"
                placeholder="Ваш логин"
                style={{ display: 'block', width: '100%', padding: 8, marginTop: 4,
                  border: `1px solid ${touched.username && errors.username ? '#f33' : '#ccc'}`, borderRadius: 6 }}
              />
              <div style={{ color: '#f33', fontSize: 12, marginTop: 4 }}>
                <ErrorMessage name="username" />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label htmlFor="password">Пароль</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Ваш пароль"
                style={{ display: 'block', width: '100%', padding: 8, marginTop: 4,
                  border: `1px solid ${touched.password && errors.password ? '#f33' : '#ccc'}`, borderRadius: 6 }}
              />
              <div style={{ color: '#f33', fontSize: 12, marginTop: 4 }}>
                <ErrorMessage name="password" />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} style={{ padding: '8px 12px' }}>
              Войти
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
