import { useSelector } from "react-redux";
import {
  selectPostIds,
  getPostById,
  SinglePost,
  useGetPostsQuery
} from "./postSlice";
import PostForm from "./PostForm";
import PostAuthor from "./PostAuthor";
import { parseISO, formatDistanceToNow } from "date-fns";
import ReactionButton from "./ReactionButton";

import { Link } from "react-router-dom";

const TimeAgo = ({ timestamp }: { timestamp: string }) => {
  let timeAgo = ``;
  if (timestamp) {
    const date = parseISO(timestamp);
    const period = formatDistanceToNow(date);
    timeAgo = `posted ${period} ago ...`;
  }
  return <p> {timeAgo}</p>;
};

export const PostExerpt = ({ postId }) => {
  // console.log(useSelector(state => state.posts.entities))
  const post: SinglePost = useSelector((state) => getPostById(state, postId));

  return (
    <article style={{ border: "1px solid #999", marginBottom: "10px" }}>
      <Link to={`${post.id}`}>
        <h2>{post.title}</h2>
      </Link>

      <p>{post.body}</p>
      <Link to={`/myposts/edit/${post.id}`}>Edit this Post</Link>
      <ReactionButton post={post} />
      <TimeAgo timestamp={post.postedOn} />
      <PostAuthor userId={post.userId} />
    </article>
  );
};

// https://date-fns.org/v3.6.0/docs/sub

const Post = () => {
  const {isLoading, isSuccess, isError, error} = useGetPostsQuery()
  const orderedPostIds = useSelector(selectPostIds);

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    // we've already sorted the posts in createEntityAdapter
    content = orderedPostIds.map((postId) => (
      <PostExerpt postId={postId} key={postId} />
    ));
  } else if (isError) {
    content = <p>{error}</p>;
  }
  return (
    <>
      <PostForm />
      <h2>My Post</h2>
      {content}
    </>
  );
};

export default Post;
