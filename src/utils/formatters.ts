export const formatCurrency = (amount: number): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'EUR',
  };

  if (amount > 10) {
    options.minimumFractionDigits = 0;
    options.maximumFractionDigits = 0;
  } else {
    options.minimumFractionDigits = 2;
    options.maximumFractionDigits = 2;
  }

  return new Intl.NumberFormat('en-US', options).format(amount);
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