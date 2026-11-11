export const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "e_wallet", label: "E-wallet" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "other", label: "Other" },
];

export function getPaymentLabel(value) {
  const method = paymentMethods.find((m) => m.value === value);
  return method ? method.label : value;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

// "2026-11-05" -> "Nov 5, 2026"
export function formatDate(dateString) {
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
