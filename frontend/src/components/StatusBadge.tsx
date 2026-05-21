import type { AttendanceStatus, InvoiceStatus } from '../types';

type BadgeVariant = AttendanceStatus | InvoiceStatus | 'default';

interface StatusBadgeProps {
    status: BadgeVariant;
    label: string;
}

const variantStyles: Record<string, string> = {
    // Attendance
    PRESENT: 'bg-green-100 text-green-700',
    ABSENT: 'bg-red-100 text-red-700',
    LATE: 'bg-yellow-100 text-yellow-700',
    EARLY_LEAVE: 'bg-orange-100 text-orange-700',
    // Invoice
    PAID: 'bg-green-100 text-green-700',
    UNPAID: 'bg-red-100 text-red-700',
    OVERDUE: 'bg-gray-100 text-gray-600',
    // Default
  default: 'bg-gray-100 text-gray-600',
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
    const style = variantStyles[status] ?? variantStyles.default;
    return (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${style}`}>
            {label}
          </span>span>
        );
}
