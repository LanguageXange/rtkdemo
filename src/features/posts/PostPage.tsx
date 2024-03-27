import {  useSelector } from "react-redux";
import {
  getPostById,
} from "./postSlice";
import { RootState } from "../../app/store";
import { PostExerpt } from "./Post";
import { useParams } from "react-router-dom";

const PostPage = () => {
  const { postId } = useParams();

  const singlePost = useSelector((state: RootState) =>
    getPostById(state, Number(postId))
  );

  return (
    <section>
      <h1>Single Post</h1>
      {singlePost  ? <PostExerpt post={singlePost} /> : <p>post not found</p>}
    </section>
  );
};

export default PostPage;
