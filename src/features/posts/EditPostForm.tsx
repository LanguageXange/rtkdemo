import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost, deletePost } from "./postSlice";
import { RootState } from "../../app/store";

// For simplicity, update the post title only
const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const singlePost = useSelector((state: RootState) =>
    getPostById(state, Number(postId))
  );
  const [requestStatus, setRequestStatus] = useState("idle");
  const dispatch = useDispatch();
  const [title, setTitle] = useState(singlePost?.title);

  if (!singlePost) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const canSave = Boolean(title) && requestStatus === "idle";
  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const onSavePostClick = async () => {
    if (!title) return;
    try {
      setRequestStatus("pending");
      await dispatch(updatePost({ title, id: postId })).unwrap();
      setTitle("");
      navigate(`/myposts/${postId}`);
    } catch (error) {
      console.error(error, "save post error");
    } finally {
      setRequestStatus("idle");
    }
  };

  const onDeletePost = async () => {
    try {
      setRequestStatus("pending");
      const result = await dispatch(deletePost({ id: postId })).unwrap();
      //console.log(result, "what is dispatch deletePost unwrap");

      navigate(`/myposts`);
    } catch (error) {
      console.error(error);
    } finally {
      setRequestStatus("idle");
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
          disabled={requestStatus !== "idle"}
        >
          Delete Post
        </button>
      </form>
    </div>
  );
};

export default EditPostForm;
