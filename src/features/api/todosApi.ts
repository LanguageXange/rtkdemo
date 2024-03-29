import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// https://github.com/gitdagray/react_redux_toolkit/blob/main/06_lesson/src/features/api/apiSlice.js

export interface ToDo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
type Response = ToDo[]
export const todosApi = createApi({
  reducerPath: "mytodos",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query<Response, void>({
      query: () => "/todos",
      transformResponse: (res: Response) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Todos"],
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: "/todos",
        method: "POST",
        body: todo,
      }),
      invalidatesTags: ["Todos"], // THIS IS IMPORTANT otherwise it shows the cached data
    }),
    toggleTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PATCH",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),

    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Todos"],
    }),
  }),
});

//console.log(apiSlice,'what is apiSlice')
export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useToggleTodoMutation,

  useDeleteTodoMutation,
} = todosApi;
