import { useSelector } from "react-redux";
import { selectUserById } from "./userSlice";
import { useGetPostByUserIdQuery } from "../posts/postSlice";
import { Link, useParams } from "react-router-dom";

const UserPage = () => {
  const { userId } = useParams();
  const user = useSelector((state) => selectUserById(state, Number(userId)));

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostByUserIdQuery(userId);

  let content;
  if (isLoading) {
    content = <p>Loading ...</p>;
  } else if (isSuccess) {
    const { ids, entities } = postsForUser;
    content = ids.map((id) => (
      <li key={id}>
        <Link to={`/myposts/${id}`}>{entities[id].title}</Link>
      </li>
    ));
  } else if (isError) {
    content = <p>{error?.data}</p>;
  }

  return (
    <section>
      <h2>{user?.name}</h2>

      <ol>{content}</ol>
    </section>
  );
};

export default UserPage;
