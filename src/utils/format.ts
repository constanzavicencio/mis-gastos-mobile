import { ScheduledItem } from '../types';

export const formatCurrency = (value: number, currency = 'ARS') => {
  if (Number.isNaN(value)) {
    return '-';
  }

  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    return `${currency} ${value.toFixed(2)}`;
  }
};

export const formatDate = (date: string | Date) => {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatSchedule = (
  scheduleType?: string,
  options: Partial<ScheduledItem> = {}
) => {
  if (!scheduleType) {
    return '';
  }

  switch (scheduleType) {
    case 'FIXED_DATE':
      return `Cada mes el día ${options.dayOfMonth ?? ''}`.trim();
    case 'BUSINESS_DAY':
      return `Cada mes el día hábil ${options.businessDay ?? ''}`.trim();
    case 'DATE_RANGE':
      return `Entre los días ${options.startDay ?? ''} y ${options.endDay ?? ''} de cada mes`;
    case 'BUSINESS_DAY_RANGE':
      return `Entre los días hábiles ${options.startBusinessDay ?? ''} y ${options.endBusinessDay ?? ''}`;
    default:
      return scheduleType;
  }
};

export const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const toISODate = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().split('T')[0];
};
