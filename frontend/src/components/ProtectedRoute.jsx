import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import TransactionProvider from "../context/TransactionProvider";

// Guards every page that needs a logged-in user.
function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Remember where they were going, so login can send them back
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // key={user.id}: a different account gets a brand-new provider with its own data
  return (
    <TransactionProvider key={user.id} userId={user.id}>
      <Outlet />
    </TransactionProvider>
  );
}

export default ProtectedRoute;
