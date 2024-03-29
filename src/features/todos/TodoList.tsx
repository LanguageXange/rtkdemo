import {
  useGetTodosQuery,
  useDeleteTodoMutation,
  useAddTodoMutation,
  ToDo,
  useToggleTodoMutation,
} from "../api/apiSlice";
import { useState } from "react";

// make sure to run json server
// npx json-server data/db.json -p 3500
const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");

  // {currentData, data, endpointName, isError, isFetching, isLoading, isSuccess, status, ...}

  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTodosQuery();
  // mutation returns an array [fn , object]
  const [addMyTodo, { isLoading: isLoadingNewTodo }] = useAddTodoMutation();
  const [toggleTodo] = useToggleTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo) {
      addMyTodo({ userId: 1, title: newTodo, completed: false });
      setNewTodo("");
    }
  };

  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new todo item</label>
      <div className="new-todo">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
      </div>
      <button className="submit">
        {isLoadingNewTodo ? "submit ..." : "submit"}
      </button>
    </form>
  );

  let content;
  if (isLoading) {
    content = <p>Loading to dos...</p>;
  } else if (isSuccess) {
    content = todos.map((todo: ToDo) => {
      //JSON.stringify(todos)
      return (
        <article key={todo.id}>
          <div className="todo">
            <input
              type="checkbox"
              checked={todo.completed}
              id={`${todo.id}`}
              onChange={() =>
                toggleTodo({ ...todo, completed: !todo.completed })
              }
            />
            <label htmlFor={`${todo.id}`}>
              {todo.title} #{todo.id}
            </label>
          </div>
          <button className="trash" onClick={() => deleteTodo({ id: todo.id })}>
            delete
          </button>
        </article>
      );
    });
  } else if (isError) {
    content = <p>{error.message}</p>;
  }

  return (
    <main>
      <h1>Todo List</h1>
      {newItemSection}
      {content}
    </main>
  );
};
export default TodoList;
