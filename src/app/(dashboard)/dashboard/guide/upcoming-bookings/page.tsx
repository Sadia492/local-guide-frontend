// // app/dashboard/upcoming-bookings/page.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Filter,
//   Eye,
//   Calendar,
//   Users,
//   DollarSign,
//   MapPin,
//   User,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Loader2,
//   RefreshCw,
//   MessageSquare,
//   Phone,
//   Mail,
//   ExternalLink,
//   CalendarDays,
//   TrendingUp,
//   Shield,
// } from "lucide-react";
// import Link from "next/link";
// import { useAuth } from "@/actions/useAuth";
// import { toast } from "sonner";
// import Swal from "sweetalert2";

// interface Booking {
//   _id: string;
//   listing: {
//     _id: string;
//     title: string;
//     city: string;
//     fee: number;
//     duration: number;
//     meetingPoint: string;
//     images: string[];
//     guide?: {
//       _id: string;
//       name: string;
//       email: string;
//       profilePicture?: string;
//     };
//   };
//   user: {
//     _id: string;
//     name: string;
//     email: string;
//     profilePicture?: string;
//   };
//   date: string;
//   groupSize: number;
//   totalPrice: number;
//   status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED";
//   createdAt: string;
//   updatedAt: string;
// }

// const UpcomingBookingPage = () => {
//   const { user } = useAuth();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("upcoming");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;

//   // Fetch upcoming bookings
//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/booking/upcoming`,
//         {
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch bookings: ${response.status}`);
//       }

//       const data = await response.json();
//       setBookings(data.data || []);
//     } catch (err) {
//       console.error("Error fetching bookings:", err);
//       toast.error("Failed to load bookings", {
//         description:
//           err instanceof Error ? err.message : "Please try again later",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchBookings();
//     }
//   }, [user]);

//   // Filter bookings based on status and type
//   const filteredBookings = bookings.filter((booking) => {
//     const today = new Date();
//     const bookingDate = new Date(booking.date);
//     const isUpcoming = bookingDate >= today;
//     const isPast = bookingDate < today;

//     // Status filter
//     let matchesStatus = true;
//     if (statusFilter === "upcoming") {
//       matchesStatus =
//         isUpcoming &&
//         booking.status !== "CANCELLED" &&
//         booking.status !== "REJECTED";
//     } else if (statusFilter === "past") {
//       matchesStatus = isPast || booking.status === "COMPLETED";
//     } else if (statusFilter === "cancelled") {
//       matchesStatus =
//         booking.status === "CANCELLED" || booking.status === "REJECTED";
//     } else {
//       matchesStatus = true;
//     }

//     // Type filter (for guide vs tourist)
//     let matchesType = true;
//     if (typeFilter === "asTourist") {
//       matchesType = booking.user._id === user?._id;
//     } else if (typeFilter === "asGuide") {
//       matchesType = booking.listing.guide?._id === user?._id;
//     }

//     // Search filter
//     const matchesSearch =
//       searchTerm === "" ||
//       booking.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       booking.listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       booking.user.name.toLowerCase().includes(searchTerm.toLowerCase());

//     return matchesStatus && matchesType && matchesSearch;
//   });

//   // Sort bookings by date (closest first)
//   const sortedBookings = [...filteredBookings].sort(
//     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
//   );

//   // Pagination
//   const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedBookings = sortedBookings.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   // Handle booking actions
//   const handleCancelBooking = async (bookingId: string) => {
//     const result = await Swal.fire({
//       title: "Cancel Booking",
//       text: "Are you sure you want to cancel this booking?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#ef4444",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, cancel it",
//       cancelButtonText: "No, keep it",
//     });

//     if (result.isConfirmed) {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//             body: JSON.stringify({ status: "CANCELLED" }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to cancel booking");
//         }

//         setBookings(
//           bookings.map((booking) =>
//             booking._id === bookingId
//               ? { ...booking, status: "CANCELLED" }
//               : booking
//           )
//         );

//         toast.success("Booking cancelled", {
//           description: "The booking has been cancelled successfully",
//         });
//       } catch (error) {
//         console.error("Error cancelling booking:", error);
//         toast.error("Failed to cancel booking");
//       }
//     }
//   };

//   const handleConfirmBooking = async (bookingId: string) => {
//     const result = await Swal.fire({
//       title: "Confirm Booking",
//       text: "Are you sure you want to confirm this booking?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#10b981",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, confirm",
//       cancelButtonText: "Cancel",
//     });

//     if (result.isConfirmed) {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//             body: JSON.stringify({ status: "CONFIRMED" }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to confirm booking");
//         }

//         setBookings(
//           bookings.map((booking) =>
//             booking._id === bookingId
//               ? { ...booking, status: "CONFIRMED" }
//               : booking
//           )
//         );

//         toast.success("Booking confirmed", {
//           description: "The booking has been confirmed successfully",
//         });
//       } catch (error) {
//         console.error("Error confirming booking:", error);
//         toast.error("Failed to confirm booking");
//       }
//     }
//   };

//   const handleCompleteBooking = async (bookingId: string) => {
//     const result = await Swal.fire({
//       title: "Complete Booking",
//       text: "Mark this booking as completed? This will finalize the tour.",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#10b981",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, complete",
//       cancelButtonText: "Cancel",
//     });

//     if (result.isConfirmed) {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/booking/${bookingId}`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//             body: JSON.stringify({ status: "COMPLETED" }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to complete booking");
//         }

//         setBookings(
//           bookings.map((booking) =>
//             booking._id === bookingId
//               ? { ...booking, status: "COMPLETED" }
//               : booking
//           )
//         );

//         toast.success("Booking completed", {
//           description: "The tour has been marked as completed",
//         });
//       } catch (error) {
//         console.error("Error completing booking:", error);
//         toast.error("Failed to complete booking");
//       }
//     }
//   };

//   // Status badge component
//   const StatusBadge = ({
//     status,
//     date,
//   }: {
//     status: Booking["status"];
//     date: string;
//   }) => {
//     const bookingDate = new Date(date);
//     const today = new Date();
//     const isUpcoming = bookingDate >= today;

//     const statusConfig = {
//       PENDING: {
//         color: "bg-yellow-100 text-yellow-800",
//         icon: <Clock className="w-3 h-3" />,
//         text: "Pending",
//       },
//       CONFIRMED: {
//         color: "bg-blue-100 text-blue-800",
//         icon: <CheckCircle className="w-3 h-3" />,
//         text: "Confirmed",
//       },
//       COMPLETED: {
//         color: "bg-green-100 text-green-800",
//         icon: <CheckCircle className="w-3 h-3" />,
//         text: "Completed",
//       },
//       CANCELLED: {
//         color: "bg-red-100 text-red-800",
//         icon: <XCircle className="w-3 h-3" />,
//         text: "Cancelled",
//       },
//       REJECTED: {
//         color: "bg-gray-100 text-gray-800",
//         icon: <XCircle className="w-3 h-3" />,
//         text: "Rejected",
//       },
//     };

//     const config = statusConfig[status];

//     return (
//       <span
//         className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
//       >
//         {config.icon}
//         {config.text}
//         {isUpcoming && status === "CONFIRMED" && (
//           <span className="ml-1 text-xs">(Upcoming)</span>
//         )}
//       </span>
//     );
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "short",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Get days until booking
//   const getDaysUntil = (dateString: string) => {
//     const bookingDate = new Date(dateString);
//     const today = new Date();
//     const diffTime = bookingDate.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return "Today";
//     if (diffDays === 1) return "Tomorrow";
//     if (diffDays > 0) return `In ${diffDays} days`;
//     return `${Math.abs(diffDays)} days ago`;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
//             <p className="text-gray-600 mt-1">
//               Manage your upcoming and past tour bookings
//             </p>
//           </div>
//           <button
//             onClick={fetchBookings}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Refresh
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-blue-700 font-medium">Upcoming</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {
//                     bookings.filter((b) => {
//                       const date = new Date(b.date);
//                       const today = new Date();
//                       return date >= today && b.status === "CONFIRMED";
//                     }).length
//                   }
//                 </p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <Calendar className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-5 rounded-xl border border-yellow-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-yellow-700 font-medium">Pending</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {bookings.filter((b) => b.status === "PENDING").length}
//                 </p>
//               </div>
//               <div className="p-3 bg-yellow-100 rounded-lg">
//                 <Clock className="w-6 h-6 text-yellow-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-green-700 font-medium">Completed</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   {bookings.filter((b) => b.status === "COMPLETED").length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <CheckCircle className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-purple-700 font-medium">
//                   Total Spent
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900 mt-2">
//                   $
//                   {bookings
//                     .filter((b) => b.status === "COMPLETED")
//                     .reduce((sum, b) => sum + b.totalPrice, 0)}
//                 </p>
//               </div>
//               <div className="p-3 bg-purple-100 rounded-lg">
//                 <DollarSign className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-lg border p-4 mb-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search by tour, city, or name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//             />
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
//             >
//               <option value="upcoming">Upcoming</option>
//               <option value="pending">Pending</option>
//               <option value="past">Past & Completed</option>
//               <option value="cancelled">Cancelled</option>
//               <option value="all">All Status</option>
//             </select>

//             {user?.role === "GUIDE" && (
//               <select
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
//               >
//                 <option value="all">All Bookings</option>
//                 <option value="asTourist">As Tourist</option>
//                 <option value="asGuide">As Guide</option>
//               </select>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Bookings Grid */}
//       {paginatedBookings.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {paginatedBookings.map((booking) => {
//             const isTourist = booking.user._id === user?._id;
//             const isGuide = booking.listing.guide?._id === user?._id;
//             const bookingDate = new Date(booking.date);
//             const today = new Date();
//             const isUpcoming = bookingDate >= today;

//             return (
//               <div
//                 key={booking._id}
//                 className="bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition-all"
//               >
//                 {/* Booking Header */}
//                 <div className="p-5 border-b">
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <h3 className="font-bold text-gray-900 line-clamp-1">
//                         {booking.listing.title}
//                       </h3>
//                       <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
//                         <MapPin className="w-3 h-3" />
//                         {booking.listing.city}
//                       </div>
//                     </div>
//                     <StatusBadge status={booking.status} date={booking.date} />
//                   </div>

//                   {/* Date and Time Badge */}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2 text-sm">
//                       <CalendarDays className="w-4 h-4 text-blue-500" />
//                       <span className="font-medium">
//                         {formatDate(booking.date)}
//                       </span>
//                     </div>
//                     <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
//                       {getDaysUntil(booking.date)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Booking Details */}
//                 <div className="p-5 space-y-4">
//                   {/* Price and Group Size */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-1">
//                       <div className="text-xs text-gray-500">Total Price</div>
//                       <div className="flex items-center text-lg font-bold text-gray-900">
//                         <DollarSign className="w-4 h-4 mr-1" />
//                         {booking.totalPrice}
//                         <span className="text-sm font-normal text-gray-600 ml-1">
//                           ({booking.groupSize} × ${booking.listing.fee})
//                         </span>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <div className="text-xs text-gray-500">Group Size</div>
//                       <div className="flex items-center text-gray-900">
//                         <Users className="w-4 h-4 mr-2" />
//                         {booking.groupSize} people
//                       </div>
//                     </div>
//                   </div>

//                   {/* Meeting Point */}
//                   <div>
//                     <div className="text-xs text-gray-500 mb-1">
//                       Meeting Point
//                     </div>
//                     <div className="text-sm text-gray-700 flex items-start gap-1">
//                       <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
//                       <span className="line-clamp-2">
//                         {booking.listing.meetingPoint}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Duration */}
//                   {booking.listing.duration && (
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <Clock className="w-4 h-4" />
//                       <span>{booking.listing.duration} hours</span>
//                     </div>
//                   )}

//                   {/* User/Guest Info */}
//                   <div className="pt-4 border-t">
//                     <div className="text-xs text-gray-500 mb-2">
//                       {isTourist ? "Guide" : "Guest"}
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
//                         {isTourist
//                           ? booking.listing.guide?.name?.charAt(0) || "G"
//                           : booking.user.name?.charAt(0) || "U"}
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-900">
//                           {isTourist
//                             ? booking.listing.guide?.name
//                             : booking.user.name}
//                         </div>
//                         <div className="text-xs text-gray-600">
//                           {isTourist
//                             ? booking.listing.guide?.email
//                             : booking.user.email}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="p-5 border-t bg-gray-50">
//                   <div className="flex flex-col gap-2">
//                     {/* Status-based actions */}
//                     {isUpcoming && booking.status === "PENDING" && isGuide && (
//                       <>
//                         <button
//                           onClick={() => handleConfirmBooking(booking._id)}
//                           className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
//                         >
//                           Confirm Booking
//                         </button>
//                         <button
//                           onClick={() => handleCancelBooking(booking._id)}
//                           className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
//                         >
//                           Reject Booking
//                         </button>
//                       </>
//                     )}

//                     {isUpcoming &&
//                       booking.status === "CONFIRMED" &&
//                       isGuide && (
//                         <button
//                           onClick={() => handleCompleteBooking(booking._id)}
//                           className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
//                         >
//                           Mark as Completed
//                         </button>
//                       )}

//                     {isUpcoming &&
//                       booking.status === "CONFIRMED" &&
//                       isTourist && (
//                         <button
//                           onClick={() => handleCancelBooking(booking._id)}
//                           className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
//                         >
//                           Cancel Booking
//                         </button>
//                       )}

//                     {/* Common actions */}
//                     <div className="flex gap-2 pt-2 border-t">
//                       <Link
//                         href={`/bookings/${booking._id}`}
//                         className="flex-1 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-center"
//                         title="View Details"
//                       >
//                         <Eye className="w-4 h-4 mx-auto" />
//                         <span className="text-xs mt-1">Details</span>
//                       </Link>

//                       <Link
//                         href={`/tours/${booking.listing._id}`}
//                         className="flex-1 p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors text-center"
//                         title="View Tour"
//                       >
//                         <ExternalLink className="w-4 h-4 mx-auto" />
//                         <span className="text-xs mt-1">Tour</span>
//                       </Link>

//                       <button
//                         onClick={() =>
//                           window.open(
//                             `mailto:${
//                               isTourist
//                                 ? booking.listing.guide?.email
//                                 : booking.user.email
//                             }`
//                           )
//                         }
//                         className="flex-1 p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-center"
//                         title="Send Message"
//                       >
//                         <Mail className="w-4 h-4 mx-auto" />
//                         <span className="text-xs mt-1">Message</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow border p-12 text-center">
//           <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No bookings found
//           </h3>
//           <p className="text-gray-600 mb-6">
//             {searchTerm || statusFilter !== "upcoming" || typeFilter !== "all"
//               ? "Try adjusting your search or filters"
//               : user?.role === "TOURIST"
//               ? "You haven't booked any tours yet"
//               : user?.role === "GUIDE"
//               ? "You don't have any tour bookings yet"
//               : "No bookings available"}
//           </p>
//           <Link
//             href="/dashboard/guide/my-listings"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <ExternalLink className="w-5 h-5" />
//             View Your Listings
//           </Link>
//         </div>
//       )}

//       {/* Pagination */}
//       {sortedBookings.length > itemsPerPage && (
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
//           <div className="text-sm text-gray-700">
//             Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
//             <span className="font-medium">
//               {Math.min(startIndex + itemsPerPage, sortedBookings.length)}
//             </span>{" "}
//             of <span className="font-medium">{sortedBookings.length}</span>{" "}
//             bookings
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             <div className="flex items-center gap-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`w-10 h-10 rounded-lg text-sm font-medium ${
//                       currentPage === page
//                         ? "bg-blue-600 text-white"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 )
//               )}
//             </div>
//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingBookingPage;
import { cookies } from "next/headers";
import { getUpcomingBookings } from "@/services/booking/upcomingBooking.service";
import UpcomingBookingsClient from "@/components/modules/Guide/Booking/UpcomingBookingsClient";

export default async function UpcomingBookingsPage() {
  // Get cookies from the server request
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  // Fetch upcoming bookings on the server
  const bookings = await getUpcomingBookings(cookieHeader);

  return <UpcomingBookingsClient initialBookings={bookings} />;
}
