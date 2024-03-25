import { useSelector } from "react-redux";
import { selectAllPosts } from "./postSlice";
import PostForm from "./PostForm";
import PostAuthor from "./PostAuthor";
import { parseISO, formatDistanceToNow } from "date-fns";
import ReactionButton from "./ReactionButton";

const TimeAgo = ({ timestamp }: { timestamp: string }) => {
  let timeAgo = ``;
  if (timestamp) {
    const date = parseISO(timestamp);
    const period = formatDistanceToNow(date);
    timeAgo = `posted ${period} ago ...`;
  }
  return <p> {timeAgo}</p>;
};

// https://date-fns.org/v3.6.0/docs/sub
const Post = () => {
  const posts = useSelector(selectAllPosts);

  // new posts to appear at the top
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
  // `refString.localeCompare(compareString)` if negative value, refString occurs before compareString
  const orderedPosts = [...posts].sort((a, b) =>
    b.postedOn.localeCompare(a.postedOn)
  );

  const renderPost = orderedPosts.map((post) => {
    return (
      <div
        key={post.id}
        style={{ border: "1px solid #999", marginBottom: "10px" }}
      >
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <ReactionButton post={post}/>
        <TimeAgo timestamp={post.postedOn} />
        <PostAuthor userId={post.userId} />
      </div>
    );
  });

  return (
    <>
      <h2>My Post</h2>

      {renderPost}

      <PostForm />
    </>
  );
};

export default Post;
