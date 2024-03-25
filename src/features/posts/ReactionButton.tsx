import { useDispatch } from "react-redux";
import { addReaction, SinglePost } from "./postSlice";

type PostProp = {
  post: SinglePost
}
type EmojiName = "thumbsUp" | "heart" | "coffee"; 
const ReactionButton = ({ post }:PostProp) => {
  const dispatch = useDispatch();

  const emojis: Record<EmojiName, string> = {
    thumbsUp: "👍",
    heart: "❤️",
    coffee: "☕",
  };

  const reactionBtns = Object.entries(emojis).map(([name, emoji]) => {
    return (
      <button
        key={name}
        onClick={() =>
          dispatch(addReaction({ postId: post.id, reaction: name as EmojiName }))
        }
      >
        {emoji} {post.reactions[name as EmojiName]}
      </button>
    );
  });
  return <div>{reactionBtns}</div>;
};

export default ReactionButton;
