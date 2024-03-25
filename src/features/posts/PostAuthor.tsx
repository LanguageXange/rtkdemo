import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/userSlice";

type AuthorProp = {
  userId: string;
};

const PostAuthor = ({ userId }: AuthorProp) => {
  const users = useSelector(selectAllUsers);
  const author = users.find((user) => user.id === userId);
  return <span>Written by {author ? author.name : "Unknown Author"}</span>;
};

export default PostAuthor;
