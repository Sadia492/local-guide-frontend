import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface BookingStatusBadgeProps {
  status: string;
}

export default function BookingStatusBadge({
  status,
}: BookingStatusBadgeProps) {
  const config = {
    PENDING: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <AlertCircle className="w-3 h-3" />,
      text: "Pending",
    },
    CONFIRMED: {
      color: "bg-blue-100 text-blue-800",
      icon: <CheckCircle className="w-3 h-3" />,
      text: "Confirmed",
    },
    COMPLETED: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="w-3 h-3" />,
      text: "Completed",
    },
    CANCELLED: {
      color: "bg-red-100 text-red-800",
      icon: <XCircle className="w-3 h-3" />,
      text: "Cancelled",
    },
  };

  const statusConfig = config[status as keyof typeof config] || {
    color: "bg-gray-100 text-gray-800",
    icon: <AlertCircle className="w-3 h-3" />,
    text: status,
  };

  const { color, icon, text } = statusConfig;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {icon}
      {text}
    </span>
  );
}
