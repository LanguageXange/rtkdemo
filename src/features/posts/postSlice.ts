import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/postApi";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.postedOn.localeCompare(a.postedOn),
});

// {ids: [], entities:{}}
const initialState = postsAdapter.getInitialState();

export interface SinglePost {
  id: number;
  title: string;
  body: string;
  userId: number;
  postedOn: string;
  reactions: { thumbsUp: number; heart: number; coffee: number };
}

// replace createSlice with createApi.injectEndPoints
// code splitting
// https://redux-toolkit.js.org/rtk-query/usage/code-splitting

type PostResponse = SinglePost[];

// https://github.com/gitdagray/react_redux_toolkit/blob/main/07_lesson/src/features/posts/postsSlice.js
export const extendedPostApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PostResponse>({
      query: () => "/posts",
      transformResponse: (responseData: PostResponse) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.postedOn)
            post.postedOn = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              heart: 0,
              coffee: 0,
            };
          return post;
        });
        // https://redux-toolkit.js.org/api/createEntityAdapter#crud-functions
        // normalized data
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      // https://redux-toolkit.js.org/rtk-query/api/createApi#providestags
      providesTags: (result) =>
        result
          ? [...result.ids.map((id) => ({ type: "Post", id }))]
          : [{ type: "Post", id: "LIST" }],
    }),

    getPostByUserId: builder.query({
      query: (id) => `/posts/?userId=${id}`,
      transformResponse: (responseData) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.postedOn)
            post.postedOn = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              heart: 0,
              coffee: 0,
            };
          return post;
        });
        // https://redux-toolkit.js.org/api/createEntityAdapter#crud-functions
        // normalized data
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) =>
        result
          ? [...result.ids.map((id) => ({ type: "Post", id }))]
          : [{ type: "Post" }],
    }),

    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          postedOn: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            heart: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Post" }],
      // https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#advanced-invalidation-with-abstract-tag-ids
    }),
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          postedOn: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
        body: { postId },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg }],
    }),
    // optimistically update the cached data
    // https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#optimistic-updates
    addRection: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `/posts/${postId}`,
        method: "PATCH",
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          extendedPostApi.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            }
          )
        );
        try {
          await queryFulfilled; // wait for the promise to fulfil
        } catch {
          patchResult.undo(); // otherwise we undo the action
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByUserIdQuery,
  useUpdatePostMutation,
  useAddNewPostMutation,
  useDeletePostMutation,
  useAddRectionMutation,
} = extendedPostApi;

// returns the query result object
export const selectPostsResult = extendedPostApi.endpoints.getPosts.select();
//console.log(selectPostsResult, "selectPostsResult");
// Creates memoized selector
const selectPostsData = createSelector(
  selectPostsResult,
  (postsResult) => postsResult.data // normalized state object with ids & entities
);
console.log(selectPostsData, "what is selectPostsData");

export const {
  selectAll: selectAllPosts,
  selectById: getPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors(
  (state) => selectPostsData(state) ?? initialState
);
