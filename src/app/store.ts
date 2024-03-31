import { configureStore, Middleware } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

import usersReducer from "../features/users/userSlice";
import { logger } from "./mylogger";
import { todosApi } from "../features/api/todosApi";
import { apiSlice } from "../features/api/postApi";

// https://redux-toolkit.js.org/api/getDefaultMiddleware

// https://github.com/reduxjs/redux-toolkit/issues/368
const middlewares: Middleware[] = [todosApi.middleware, apiSlice.middleware];

// https://vitejs.dev/guide/env-and-mode
// if it's development mode
if (import.meta.env.DEV) {
  middlewares.push(logger);
}

// https://redux-toolkit.js.org/tutorials/rtk-query#add-the-service-to-your-store
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    users: usersReducer,
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
