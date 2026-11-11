import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        {/* Outlet is where the current page (Dashboard, Transactions...) appears */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
