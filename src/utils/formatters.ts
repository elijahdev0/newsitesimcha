export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateRange = (startDateString: string, endDateString: string): string => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  
  const startMonth = startDate.toLocaleString('en-US', { month: 'short' });
  const endMonth = endDate.toLocaleString('en-US', { month: 'short' });
  
  if (startMonth === endMonth && startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.getDate()} - ${endDate.getDate()} ${startMonth} ${startDate.getFullYear()}`;
  } else if (startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.getDate()} ${startMonth} - ${endDate.getDate()} ${endMonth} ${startDate.getFullYear()}`;
  } else {
    return `${startDate.getDate()} ${startMonth} ${startDate.getFullYear()} - ${endDate.getDate()} ${endMonth} ${endDate.getFullYear()}`;
  }
};