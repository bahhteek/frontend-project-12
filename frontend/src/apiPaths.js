const apiBase = import.meta.env.VITE_API ?? "/api/v1";

export const routes = {
  channels: `${apiBase}/channels`,
  messages: `${apiBase}/messages`,
  login: `${apiBase}/login`,
  signup: `${apiBase}/signup`,
};
