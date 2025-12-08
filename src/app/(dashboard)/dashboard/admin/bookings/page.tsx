"use client";

import { useAdminBookings } from "@/actions/useAdminBooking";
import BookingsFilters from "@/components/modules/Admin/Bookings/BookingsFilters";
import BookingsHeader from "@/components/modules/Admin/Bookings/BookingsHeader";
import BookingsPagination from "@/components/modules/Admin/Bookings/BookingsPagination";
import BookingsTable from "@/components/modules/Admin/Bookings/BookingsTable";
import { getUserBookings } from "@/services/booking/booking.service";
import { Loader2 } from "lucide-react";

export default function ManageBookingsPage() {
  const {
    loading,
    paginatedBookings,
    filteredBookings,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    handleConfirmBooking,
    handleCancelBooking,
    refreshBookings,
  } = useAdminBookings();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <BookingsHeader />

      <BookingsFilters
        filters={filters}
        onFilterChange={setFilters}
        onRefresh={refreshBookings}
      />

      <BookingsTable
        bookings={paginatedBookings}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
      />

      {filteredBookings.length > 0 && (
        <BookingsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredBookings.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
