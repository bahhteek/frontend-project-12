import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'
import './i18n.js'
import i18n from './i18n.js'
import { withRollbar } from './rollbar.jsx'
import { store } from './store'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <BrowserRouter>
          {withRollbar(
            <>
              <App />
              <ToastContainer position="top-right" autoClose={3000} />
            </>
          )}
        </BrowserRouter>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);
