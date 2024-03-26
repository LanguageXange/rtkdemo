import { useSelector, useDispatch } from "react-redux";
import {
  selectAllPosts,
  getPostsError,
  getPostsStatus,
  fetchPosts,
} from "./postSlice";
import PostForm from "./PostForm";
import PostAuthor from "./PostAuthor";
import { parseISO, formatDistanceToNow } from "date-fns";
import ReactionButton from "./ReactionButton";
import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

const TimeAgo = ({ timestamp }: { timestamp: string }) => {
  let timeAgo = ``;
  if (timestamp) {
    const date = parseISO(timestamp);
    const period = formatDistanceToNow(date);
    timeAgo = `posted ${period} ago ...`;
  }
  return <p> {timeAgo}</p>;
};

export const PostExerpt = ({ post }) => {
  return (
    <article style={{ border: "1px solid #999", marginBottom: "10px" }}>
      <Link to={`${post.id}`}>
        <h2>
          {post.title} with post id {post.id}
        </h2>
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
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const postsError = useSelector(getPostsError);
  const dispatch = useDispatch();

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postsStatus, dispatch]);

  let content;
  if (postsStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (postsStatus === "succeeded") {
    const orderedPosts = [...posts].sort((a, b) =>
      b.postedOn.localeCompare(a.postedOn)
    );
    content = orderedPosts.map((post) => (
      <PostExerpt post={post} key={post.title} />
    ));
  } else if (postsStatus === "failed") {
    content = <p>{postsError}</p>;
  }

  // new posts to appear at the top
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
  // `refString.localeCompare(compareString)` if negative value, refString occurs before compareString
  // const orderedPosts = [...posts].sort((a, b) =>
  //   b.postedOn.localeCompare(a.postedOn)
  // );

  return (
    <>
      <PostForm />
      <h2>My Post</h2>
      {content}
      <Outlet/>
    </>
  );
};

export default Post;
