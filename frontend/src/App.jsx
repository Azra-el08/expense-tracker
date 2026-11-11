import { Routes, Route } from "react-router-dom";
import TransactionProvider from "./context/TransactionProvider";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";

function App() {
  return (
    // Everything inside can read and change the shared transactions
    <TransactionProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </TransactionProvider>
  );
}

export default App;
