import { createContext } from "react";

// The "shared box" that any component can read from.
const TransactionContext = createContext(null);

export default TransactionContext;
