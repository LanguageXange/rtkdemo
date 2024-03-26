import {
  createSlice,
  nanoid,
  PayloadAction,
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
    // console.log(posts.data[0],'post data')
    //return posts.data.sort(() => Math.random() - 0.5).slice(0, 5);
    return posts.data.slice(0,10)
  } catch (err) {
    return err.message;
  }
});



export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    try {
      const response = await axios.post(POST_URL, initialPost);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

const initialState = {
  posts: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed",
  error: null,
};

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

    // addPost: {
    //   reducer(state, action: PayloadAction<SinglePost>) {
    //     state.posts.push(action.payload);
    //   },
    //   prepare(title, content, userId) {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         title,
    //         content,
    //         userId,
    //         postedOn: new Date().toISOString(),
    //         reactions: {
    //           thumbsUp: 0,
    //           heart: 0,
    //           coffee: 0,
    //         },
    //       },
    //     };
    //   },
    // },
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
        action.payload.id = nanoid(); // make sure id is unique otherwise updatin reactions will update previous post
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
export const getPostById = (state: RootState, postId:number) => {
  const posts: SinglePost[] = state.posts.posts;
  return posts.find((post) => post.id === postId);
};

export const { addPost, addReaction } = postsSlice.actions;

export default postsSlice.reducer;
