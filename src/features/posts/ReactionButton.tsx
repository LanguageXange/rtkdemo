import { SinglePost, useAddRectionMutation } from "./postSlice";

type PostProp = {
  post: SinglePost;
};
type EmojiName = "thumbsUp" | "heart" | "coffee";

const ReactionButton = ({ post }: PostProp) => {
  const emojis: Record<EmojiName, string> = {
    thumbsUp: "👍",
    heart: "❤️",
    coffee: "☕",
  };

  const [addReaction] = useAddRectionMutation();

  const reactionBtns = Object.entries(emojis).map(([name, emoji]) => {
    return (
      <button
        key={name}
        onClick={async () => {
          const newVal = post.reactions[name]+1
          await addReaction({
            postId: post.id,
            reactions: { ...post.reactions, [name]: newVal },
          });
        }}
      >
        {emoji} {post.reactions[name as EmojiName]}
      </button>
    );
  });
  return <div>{reactionBtns}</div>;
};

export default ReactionButton;
