import { useContext } from "react";
import TransactionContext from "../context/TransactionContext";

// A custom hook so components can write: const { transactions } = useTransactions();
function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used inside <TransactionProvider>");
  }
  return context;
}

export default useTransactions;
