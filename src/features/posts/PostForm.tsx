import { SetStateAction, Dispatch, useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";

import { selectAllUsers, User } from "../users/userSlice";
import { useAddNewPostMutation } from "./postSlice";

const PostForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const [addNewPost, { isLoading }] = useAddNewPostMutation();
  const users = useSelector(selectAllUsers);

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) =>
      setter(e.target.value);

  const onTitleChanged = handleChange(setTitle);
  const onContentChanged = handleChange(setContent);
  const onAuthorChanged = handleChange(setUserId);

  // refactor
  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  // https://redux-toolkit.js.org/api/createAsyncThunk#unwrapping-result-actions
  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await addNewPost({ title, body: content, userId }).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
      } catch (error) {
        console.error("failed to save", error);
      }
    }
  };

  const usersOptions = users.map((user: User) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));
  return (
    <section style={{ border: "2px solid #555" }}>
      <h2>Add a New Post</h2>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          width: "85%",
        }}
      >
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          {isLoading ? "Saving ..." : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default PostForm;
