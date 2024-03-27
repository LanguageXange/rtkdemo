import {
  createSlice,
  nanoid,
  PayloadAction,
  createSelector,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from "date-fns";
import axios from "axios";
const POST_URL = "https://jsonplaceholder.typicode.com/posts";

// thunk middle ware 1919
// https://redux-toolkit.js.org/api/createAsyncThunk

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const posts = await axios.get(POST_URL);
    // console.log(posts.data[0], "post data");
    //return posts.data.sort(() => Math.random() - 0.5).slice(0, 30);
    return posts.data.slice(0, 30);
  } catch (err) {
    return err.message;
  }
});

// update post title thunk
// unable to update post if the ID exceeds 100 (the api only provides 100 posts)
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POST_URL}/${id}`, initialPost);
      return response.data;
    } catch (err) {
      //return err.message;
      throw Error("unable to update your post sorry!");
      // return { id: Number(id), error: 500, title: "noooo error" };
    }
  }
);

// delete post thunk
export const deletePost = createAsyncThunk("posts/deletePost", async (data) => {
  const { id } = data;
  try {
    const response = await axios.delete(`${POST_URL}/${id}`);
    if (response?.status === 200) {
      return { id: Number(id), message: "sucessfully delete the post" };
    }

    return { id: Number(id), message: "unable to delete the post" };
  } catch (err) {
    // if we try to delete a post that doesn't exist
    // /myposts/edit/200
    return { id, message: err?.message };
  }
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    try {
      const response = await axios.post(POST_URL, initialPost);
      //console.log(response,'what is response in addNewPost')
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

// const initialState = [
//   {
//     id: "1",
//     title: "First Title",
//     content: "some content",
//     postedOn: sub(new Date(), { minutes: 10 }).toISOString(),
//     userId: "1",
//     reactions: {
//       thumbsUp: 0,
//       heart: 0,
//       coffee: 0,
//     },
//   },
//   {
//     id: "2",
//     title: "Second Title",
//     content: "some more content",
//     postedOn: sub(new Date(), { minutes: 10 }).toISOString(),
//     userId: "1",
//     reactions: {
//       thumbsUp: 0,
//       heart: 0,
//       coffee: 0,
//     },
//   },
// ];

export interface SinglePost {
  id: string;
  title: string;
  content: string;
  userId: string;
  postedOn: string;
  reactions: { thumbsUp: number; heart: number; coffee: number };
}
const initialState = {
  posts: [] as SinglePost[],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed",
  error: null,
  count: 0, // for demonstrating optimization
};
// https://redux-toolkit.js.org/api/createslice#customizing-generated-action-creators
export const postsSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addReaction(
      state,
      action: PayloadAction<{
        postId: string;
        reaction: "thumbsUp" | "heart" | "coffee";
      }>
    ) {
      const { postId, reaction } = action.payload;
      //console.log(action.payload, "what is action payalod");
      const existPost = state.posts.find((post) => post.id == postId);
      if (existPost) {
        existPost.reactions[reaction]++;
      }
    },
    increaseCount(state) {
      state.count++;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        // console.log(action,'what is action')
        // the json placeholder api doesn't include postedOn and reactions
        const loadedPosts = action.payload.map((post) => {
          post.postedOn = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            heart: 0,
            coffee: 0,
          };
          return post;
        });

        state.posts = loadedPosts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.error.message);
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // action.payload.id = nanoid(); // make sure id is unique otherwise updatin reactions will update previous post
        action.payload.userId = Number(action.payload.userId);
        action.payload.postedOn = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          heart: 0,
          coffee: 0,
        };
        console.log(
          action.payload,
          "what is action payload in addNewPost Thunk"
        );
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const { id, title } = action.payload;
        const existPost = state.posts.find((post) => post.id === id);
        if (existPost) {
          existPost.title = title;
        }
      })
      .addCase(updatePost.pending, (state, action) => {
        console.log(action, "what is action in pending");
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const { id } = action.payload;
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = posts;
        console.log(action, "action in deletePost fulfilled");
      });
  },
});
// https://redux-toolkit.js.org/api/createslice#extrareducers

// extraReducers allows createSlice to respond and update its own state
// in response to other action types besides the types it has generated.
// each individual case reducer inside of extraReducers
// will NOT generate a new action type or action creator.

// SELECTORS
export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;
export const getPostById = (state: RootState, postId: number) => {
  const posts: SinglePost[] = state.posts.posts;
  return posts.find((post) => post.id === postId);
};

export const getCount = (state: RootState) => state.posts.count;

// memoized selector
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

export const { addReaction, increaseCount } = postsSlice.actions;

export default postsSlice.reducer;
