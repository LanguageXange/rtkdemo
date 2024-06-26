import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// make sure to import query from the react one otherwise custom React hooks might not show up
// https://stackoverflow.com/questions/76411747/rtk-query-createapi-endpoints-not-showing-up-as-hooks-in-typescript

// https://www.youtube.com/watch?v=9P2IUx13MZI&list=PL0Zuz27SZ-6M1J5I1w2-uZx36Qp6qhjKo&index=7
// https://github.com/gitdagray/react_redux_toolkit/blob/main/07_lesson/src/features/api/apiSlice.js
export const apiSlice = createApi({
  reducerPath: "posts", // optional
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Post"],
  endpoints: () => ({}), // we will use injectEndpoints in postSlice.ts
});
