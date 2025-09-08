const apiBase = import.meta.env.VITE_API

export default {
  channels: `${import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN}/channels`,
  messages: `${apiBase}/messages`,
  login: `${apiBase}/login`,
  signup: `${apiBase}/signup`,
}
