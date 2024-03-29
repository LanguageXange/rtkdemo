import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

// https://www.youtube.com/watch?v=9P2IUx13MZI&list=PL0Zuz27SZ-6M1J5I1w2-uZx36Qp6qhjKo&index=7
// https://github.com/gitdagray/react_redux_toolkit/blob/main/07_lesson/src/features/api/apiSlice.js
export const apiSlice = createApi({
    reducerPath:"api",// optional
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:3500'}),
    tagTypes:['Posts'],
    endpoints: builder => ({
       getPosts: builder.query({
        query:() => "/posts",
        providesTags:["Posts"]
       })
    })
})