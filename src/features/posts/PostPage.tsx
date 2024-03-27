import { useDispatch, useSelector } from "react-redux";
import {
  getPostById,
  getPostsStatus,
  fetchPosts,
} from "./postSlice";
import { RootState } from "../../app/store";
import { PostExerpt } from "./Post";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const PostPage = () => {
  const { postId } = useParams();
  const postsStatus = useSelector(getPostsStatus);
  const dispatch = useDispatch();
  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsStatus]);
  // when refresh the page- post not found because the post is not fetched yet
  const singlePost = useSelector((state: RootState) =>
    getPostById(state, Number(postId))
  );

  return (
    <section>
      {postsStatus === "loading" && <p>loading</p>} 
      <h1>Single Post</h1>
      {singlePost && (postsStatus === "succeeded") ? <PostExerpt post={singlePost} /> : <p>post not found</p>}
    </section>
  );
};

export default PostPage;
