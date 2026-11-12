import { NavLink } from "react-router-dom";
import Brand from "./Brand";
import Avatar from "./Avatar";
import ThemeToggle from "./ThemeToggle";
import useAuth from "../hooks/useAuth";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/transactions", label: "Transactions" },
  { to: "/categories", label: "Categories" },
  { to: "/budgets", label: "Budgets" },
  { to: "/reports", label: "Reports" },
];

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <Brand />

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/profile" className="user-chip" title="Your profile">
          <Avatar name={user.name} color={user.color} />
          <span className="user-text">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </span>
        </NavLink>
        <div className="sidebar-actions">
          <ThemeToggle />
          <button type="button" className="btn btn-small" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
