import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../store/slices/auth.js"
import channelsReducer from "../store/slices/channels.js"
import messagesReducer from "../store/slices/messages.js"
import uiReducer from "../store/slices/ui.js"

export const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    ui: uiReducer,
    auth: authReducer,
  },
});
