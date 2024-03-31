import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <main>
      <nav
        style={{
          width: "100%",
          height: "50px",
          background: "#555",
          display: "flex",
          gap: "20px",
        }}
      >
        i am a nav bar
        <Link to="/">Home</Link>
        <Link to="/myposts">Post </Link>
        <Link to="/user">User </Link>
      </nav>
      <section className="container">
        <Outlet />
      </section>

      <footer style={{ width: "100%", height: "50px", background: "#555" }}>
        I am a footer
      </footer>
    </main>
  );
};

export default Layout;
