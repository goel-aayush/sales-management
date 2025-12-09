export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹0";
  return `₹${amount.toLocaleString("en-IN")}`;
};

// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
