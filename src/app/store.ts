import {configureStore,Middleware} from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import postsReducer from '../features/posts/postSlice'
import usersReducer from '../features/users/userSlice'
import { logger } from './mylogger'
import { apiSlice } from '../features/api/apiSlice'



// https://redux-toolkit.js.org/api/getDefaultMiddleware

// https://github.com/reduxjs/redux-toolkit/issues/368
const middlewares: Middleware[] = [apiSlice.middleware]

// https://vitejs.dev/guide/env-and-mode
// if it's development mode
if(import.meta.env.DEV){
    middlewares.push(logger)
}

// TO DO -
// add our todosSlice to the store
// https://redux-toolkit.js.org/tutorials/rtk-query#add-the-service-to-your-store
export const store = configureStore({
    reducer:{
        counter: counterReducer,
        posts: postsReducer,
        users:usersReducer,
        [apiSlice.reducerPath]:apiSlice.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(middlewares),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch