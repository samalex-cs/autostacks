/**
 * Format price in Indian Rupee format
 */
export function formatPrice(price: number): string {
  if (price >= 10000000) {
    // 1 Crore and above
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    // 1 Lakh and above
    return `₹${(price / 100000).toFixed(2)} Lakh`;
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }
}

/**
 * Format price with full number (no abbreviation)
 */
export function formatPriceFull(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format date to readable string
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    return formatRelativeDate(dateObj);
  }

  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' };

  return dateObj.toLocaleDateString('en-IN', options);
}

/**
 * Format date relative to now
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

/**
 * Format date for input fields
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
}

/**
 * Format time
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format mileage with unit
 */
export function formatMileage(mileage: string | number): string {
  if (typeof mileage === 'number') {
    return `${mileage} km/l`;
  }
  return mileage.includes('km') ? mileage : `${mileage} km/l`;
}

/**
 * Format engine capacity
 */
export function formatEngineCapacity(cc: string | number): string {
  if (typeof cc === 'number') {
    return `${cc} cc`;
  }
  return cc.includes('cc') ? cc : `${cc} cc`;
}

/**
 * Format power
 */
export function formatPower(power: string | number): string {
  if (typeof power === 'number') {
    return `${power} bhp`;
  }
  return power.includes('bhp') || power.includes('HP') ? power : `${power} bhp`;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

/**
 * Slugify text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format car title
 */
export function formatCarTitle(brand: string, model: string, year?: number): string {
  const base = `${brand} ${model}`;
  return year ? `${year} ${base}` : base;
}

/**
 * Format status badge text
 */
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    requested: 'Requested',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    pending: 'Pending',
    active: 'Active',
  };
  return statusMap[status.toLowerCase()] || toTitleCase(status);
}

