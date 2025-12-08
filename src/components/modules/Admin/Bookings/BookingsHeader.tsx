interface BookingsHeaderProps {
  title?: string;
  description?: string;
}

export default function BookingsHeader({
  title = "Manage Bookings",
  description = "View and manage all tour bookings",
}: BookingsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
}
