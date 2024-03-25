import { SetStateAction, Dispatch, useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "./postSlice";
import { selectAllUsers, User } from "../users/userSlice";


const PostForm: React.FC = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

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

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(addPost(title, content, userId));
      setTitle("");
      setContent("");
      setUserId("")
    }
  };

  const canSave = Boolean(title) && Boolean(content) && Boolean(userId);

  const usersOptions = users.map((user: User) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));
  return (
    <section style={{border:"2px solid #555"}}>
      <h2>Add a New Post</h2>
      <form style={{display:"flex", flexDirection:"column", gap:"5px",width:"85%"}}>
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
          Save Post
        </button>
      </form>
    </section>
  );
};

export default PostForm;
