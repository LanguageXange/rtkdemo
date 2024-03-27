import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { fetchUsers } from "./features/users/userSlice.ts";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import PostPage from "./features/posts/PostPage.tsx";
import Post from "./features/posts/Post.tsx";
import EditPostForm from "./features/posts/EditPostForm.tsx";
import { fetchPosts } from "./features/posts/postSlice.ts";
import UsersList from "./features/users/UserList.tsx";
import UserPage from "./features/users/UserPage.tsx";



// we want to load users immediately when app loads
store.dispatch(fetchUsers());
store.dispatch(fetchPosts());



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<App />} />
            <Route path="myposts">
              <Route index element={<Post/>} />
              <Route path=":postId" element={<PostPage/>} />
              <Route path="edit/:postId" element={<EditPostForm/>} />
            </Route>

            <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>
            <Route path="*" element={<p>this is a 404 page</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
