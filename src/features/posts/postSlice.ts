import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from "date-fns";

const initialState = [
  {
    id: "1",
    title: "First Title",
    content: "some content",
    postedOn: sub(new Date(), { minutes: 10 }).toISOString(),
    userId: "1",
    reactions: {
      thumbsUp: 0,
      heart: 0,
      coffee: 0,
    },
  },
  {
    id: "2",
    title: "Second Title",
    content: "some more content",
    postedOn: sub(new Date(), { minutes: 10 }).toISOString(),
    userId: "1",
    reactions: {
      thumbsUp: 0,
      heart: 0,
      coffee: 0,
    },
  },
];
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
      const existPost = state.find((post) => post.id === postId);
      if (existPost) {
        existPost.reactions[reaction]++;
      }
    },

    addPost: {
      reducer(state, action: PayloadAction<SinglePost>) {
        state.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            userId,
            postedOn: new Date().toISOString(),
            reactions: {
              thumbsUp: 0,
              heart: 0,
              coffee: 0,
            },
          },
        };
      },
    },
  },
});

export const selectAllPosts = (state: RootState) => state.posts;

export const { addPost, addReaction } = postsSlice.actions;

export default postsSlice.reducer;
