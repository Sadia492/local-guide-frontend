import { Clock, CheckCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    PENDING: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="w-3 h-3" />,
    },
    CONFIRMED: {
      color: "bg-blue-100 text-blue-800",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    CANCELLED: {
      color: "bg-red-100 text-red-800",
      icon: <XCircle className="w-3 h-3" />,
    },
    COMPLETED: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="w-3 h-3" />,
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
