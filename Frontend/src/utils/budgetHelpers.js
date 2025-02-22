export const handleExport = (expenditures, eventDetails) => {
  // Export to CSV/Excel logic
};

export const handlePrint = (expenditures, eventDetails) => {
  // Print report logic
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}; 