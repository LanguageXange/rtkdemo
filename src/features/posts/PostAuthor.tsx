import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/userSlice";

// TO DO
// fake json api userId is number type
// need to update postSlice as well
type AuthorProp = {
  userId: number;
};

const PostAuthor = ({ userId }: AuthorProp) => {
  const users = useSelector(selectAllUsers);
  const author = users.find((user) => user.id == userId);
  return (
    <span>
      Written by {author ? author.name : "Unknown Author"} userId: {userId}
    </span>
  );
};

export default PostAuthor;
