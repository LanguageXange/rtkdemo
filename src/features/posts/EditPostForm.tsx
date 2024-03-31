import { ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "./postSlice";
import { RootState } from "../../app/store";

// For simplicity, update the post title only
const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const singlePost = useSelector((state: RootState) =>
    getPostById(state, Number(postId))
  );

  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [title, setTitle] = useState(singlePost?.title);

  if (!singlePost) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const canSave = Boolean(title) && !isLoading;
  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const onSavePostClick = async () => {
    if (!title) return;
    try {
      await updatePost({ title, id: postId }).unwrap();
      setTitle("");
      navigate(`/myposts/${postId}`);
    } catch (error) {
      console.error(error.message, "save post error");
    }
  };

  const onDeletePost = async () => {
    try {
      await deletePost(postId).unwrap();
      navigate(`/myposts`);
    } catch (error) {
      console.error(error);
    } 
  };
  return (
    <div>
      <h2>
        Edit Post#{postId} - {title}
      </h2>

      <form style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        <label htmlFor="postTitle"> Post title</label>
        <input
          type="text"
          name="postTitle"
          id="postTitle"
          value={title}
          onChange={onTitleChanged}
        />

        <button type="button" onClick={onSavePostClick} disabled={!canSave}>
          Update Post
        </button>
        <button
          type="button"
          onClick={onDeletePost}
          disabled={isLoading}
        >
          Delete Post
        </button>
      </form>
    </div>
  );
};

export default EditPostForm;
