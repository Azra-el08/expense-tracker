import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/transactions", label: "Transactions" },
  { to: "/categories", label: "Categories" },
  { to: "/budgets", label: "Budgets" },
  { to: "/reports", label: "Reports" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">ExpenseTracker</div>
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
    </aside>
  );
}

export default Sidebar;
