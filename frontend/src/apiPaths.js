const apiBase = import.meta.env.VITE_API

export default {
  channels: `${apiBase}/channels`,
  messages: `${apiBase}/messages`,
  login: `${apiBase}/login`,
  signup: `${apiBase}/signup`,
};
