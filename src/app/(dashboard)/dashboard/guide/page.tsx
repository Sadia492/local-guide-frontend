// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   Calendar,
//   MapPin,
//   Star,
//   DollarSign,
//   Users,
//   TrendingUp,
//   Package,
//   MessageCircle,
//   CheckCircle,
//   Clock,
//   Award,
//   BarChart3,
//   Edit,
//   Eye,
//   ThumbsUp,
//   AlertCircle,
//   Compass,
//   PlusCircle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface GuideDashboardData {
//   activeListings: Array<{
//     _id: string;
//     title: string;
//     city: string;
//     category: string;
//     images: string[];
//     fee: number;
//     duration: number;
//     maxGroupSize: number;
//     bookingsCount: number;
//     rating?: number;
//   }>;
//   upcomingBookings: Array<{
//     _id: string;
//     listing: {
//       _id: string;
//       title: string;
//     };
//     user: {
//       name: string;
//       email: string;
//     };
//     date: string;
//     groupSize: number;
//     totalPrice: number;
//     status: string;
//   }>;
//   recentReviews: Array<{
//     _id: string;
//     user: {
//       name: string;
//       profilePicture?: string;
//     };
//     rating: number;
//     comment: string;
//     createdAt: string;
//   }>;
//   stats: {
//     totalListings: number;
//     activeListings: number;
//     totalBookings: number;
//     pendingBookings: number;
//     completedBookings: number;
//     totalEarnings: number;
//     averageRating: number;
//     totalReviews: number;
//   };
//   earningsData: Array<{
//     month: string;
//     amount: number;
//   }>;
// }

// export default function GuideDashboardPage() {
//   const [dashboardData, setDashboardData] = useState<GuideDashboardData | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchGuideDashboard = async () => {
//       try {
//         setLoading(true);
//         // Fetch from your guide-specific endpoint
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/meta/dashboard`,
//           {
//             credentials: "include",
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Failed to load dashboard: ${response.status}`);
//         }

//         const result = await response.json();

//         if (result.success) {
//           // Transform the data for guide dashboard
//           const userData = result.data;
//           const guideData: GuideDashboardData = {
//             activeListings: [], // You'll need this from listings endpoint
//             upcomingBookings:
//               userData.recentBookings?.filter(
//                 (b: any) => b.status === "PENDING" || b.status === "CONFIRMED"
//               ) || [],
//             recentReviews: userData.recentReviews || [],
//             stats: {
//               totalListings: userData.totalListings || 0,
//               activeListings: userData.activeListings || 0,
//               totalBookings: userData.totalBookings || 0,
//               pendingBookings: userData.pendingBookings || 0,
//               completedBookings:
//                 (userData.totalBookings || 0) - (userData.pendingBookings || 0),
//               totalEarnings: userData.totalRevenue || 0,
//               averageRating: userData.averageRating || 0,
//               totalReviews: userData.recentReviews?.length || 0,
//             },
//             earningsData: [], // You'll need this from payments endpoint
//           };
//           setDashboardData(guideData);
//         }
//       } catch (err) {
//         console.error("Error loading guide dashboard:", err);
//         setError(
//           err instanceof Error ? err.message : "Failed to load your dashboard"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGuideDashboard();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white p-6">
//         <div className="animate-pulse mx-auto">
//           <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
//                 <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
//                 <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !dashboardData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white flex items-center justify-center p-6">
//         <div className="max-w-md w-full">
//           <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
//             <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <AlertCircle className="w-8 h-8 text-amber-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">
//               Unable to load dashboard
//             </h2>
//             <p className="text-gray-600 mb-8">{error || "Please try again"}</p>
//             <div className="space-y-3">
//               <Button
//                 onClick={() => window.location.reload()}
//                 className="w-full"
//                 variant="primary"
//               >
//                 Try Again
//               </Button>
//               <Link href="/dashboard/guide/my-listings" className="block">
//                 <Button className="w-full" variant="outline">
//                   Manage Listings
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const stats = [
//     {
//       title: "Active Tours",
//       value: dashboardData.stats.activeListings,
//       icon: MapPin,
//       color: "bg-gradient-to-br from-emerald-500 to-green-600",
//       textColor: "text-emerald-600",
//       link: "/dashboard/guide/my-listings",
//       description: "Live experiences",
//     },
//     {
//       title: "Upcoming Bookings",
//       value: dashboardData.stats.pendingBookings,
//       icon: Calendar,
//       color: "bg-gradient-to-br from-blue-500 to-blue-600",
//       textColor: "text-blue-600",
//       link: "/dashboard/guide/upcoming-bookings",
//       description: "Needs confirmation",
//     },
//     {
//       title: "Total Earnings",
//       value: `$${dashboardData.stats.totalEarnings}`,
//       icon: DollarSign,
//       color: "bg-gradient-to-br from-amber-500 to-yellow-600",
//       textColor: "text-amber-600",
//       link: "/dashboard/guide",
//       description: "Platform earnings",
//     },
//     {
//       title: "Avg. Rating",
//       value: dashboardData.stats.averageRating.toFixed(1),
//       icon: Star,
//       color: "bg-gradient-to-br from-purple-500 to-purple-600",
//       textColor: "text-purple-600",
//       link: "/dashboard/guide",
//       description: `${dashboardData.stats.totalReviews} reviews`,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white p-4 sm:p-6 lg:p-8">
//       {/* Welcome Header */}
//       <div className="mb-10">
//         <div className=" mx-auto">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
//                 Welcome back, Guide! 🗺️
//               </h1>
//               <p className="text-lg text-gray-600 mb-4 max-w-2xl">
//                 Manage your tours, bookings, and connect with travelers from
//                 around the world.
//               </p>
//               <div className="flex items-center space-x-2">
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-5 h-5 ${
//                         i < Math.floor(dashboardData.stats.averageRating)
//                           ? "text-amber-400 fill-current"
//                           : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-gray-700 font-medium">
//                   {dashboardData.stats.averageRating.toFixed(1)} •{" "}
//                   {dashboardData.stats.totalReviews} reviews
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
//           {stats.map((stat) => (
//             <Link
//               href={stat.link}
//               key={stat.title}
//               className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500 mb-2">
//                     {stat.title}
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {stat.value}
//                   </p>
//                   <p className="text-xs text-gray-400 mt-2">
//                     {stat.description}
//                   </p>
//                 </div>
//                 <div
//                   className={`${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}
//                 >
//                   <stat.icon className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Upcoming Bookings */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="p-6 border-b border-gray-100">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//                       <Calendar className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-gray-900">
//                         Upcoming Bookings
//                       </h2>
//                       <p className="text-sm text-gray-500">
//                         {dashboardData.upcomingBookings.length}{" "}
//                         {dashboardData.upcomingBookings.length === 1
//                           ? "booking"
//                           : "bookings"}{" "}
//                         pending
//                       </p>
//                     </div>
//                   </div>
//                   {dashboardData.upcomingBookings.length > 0 && (
//                     <Link
//                       href="/dashboard/guide/upcoming-bookings"
//                       className="text-sm font-medium text-blue-600 hover:text-blue-800"
//                     >
//                       Manage all
//                     </Link>
//                   )}
//                 </div>
//               </div>

//               <div className="p-6">
//                 {dashboardData.upcomingBookings.length > 0 ? (
//                   <div className="space-y-4">
//                     {dashboardData.upcomingBookings
//                       .slice(0, 3)
//                       .map((booking) => (
//                         <div
//                           key={booking._id}
//                           className="group flex items-center p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-blue-50/30 hover:from-blue-100/50 hover:to-blue-100/30 transition-all duration-300 border border-blue-100 hover:border-blue-200"
//                         >
//                           <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-4">
//                             <Users className="w-6 h-6 text-white" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-bold text-gray-900 truncate mb-1">
//                               {booking.listing?.title}
//                             </h3>
//                             <div className="flex items-center space-x-4 text-sm text-gray-600">
//                               <span className="flex items-center">
//                                 <Users className="w-4 h-4 mr-1" />
//                                 {booking.user?.name}
//                               </span>
//                               <span className="flex items-center">
//                                 <Users className="w-4 h-4 mr-1" />
//                                 {booking.groupSize} people
//                               </span>
//                               <span className="font-medium text-gray-900">
//                                 ${booking.totalPrice}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="flex flex-col items-end space-y-2">
//                             <span
//                               className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                 booking.status === "CONFIRMED"
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-amber-100 text-amber-800"
//                               }`}
//                             >
//                               {booking.status}
//                             </span>
//                             <span className="text-sm text-gray-500">
//                               {new Date(booking.date).toLocaleDateString()}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
//                       <Calendar className="w-10 h-10 text-blue-600" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       No upcoming bookings
//                     </h3>
//                     <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                       You don't have any upcoming bookings. Promote your tours
//                       to get more visibility.
//                     </p>
//                     <Link href="/dashboard/guide/my-listings">
//                       <Button variant="primary" size="lg">
//                         <Edit className="w-5 h-5 mr-2" />
//                         Edit Your Tours
//                       </Button>
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Recent Reviews */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="p-6 border-b border-gray-100">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
//                       <Star className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-gray-900">
//                         Recent Reviews
//                       </h2>
//                       <p className="text-sm text-gray-500">
//                         {dashboardData.recentReviews.length}{" "}
//                         {dashboardData.recentReviews.length === 1
//                           ? "review"
//                           : "reviews"}{" "}
//                         received
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6">
//                 {dashboardData.recentReviews.length > 0 ? (
//                   <div className="space-y-6">
//                     {dashboardData.recentReviews.slice(0, 2).map((review) => (
//                       <div
//                         key={review._id}
//                         className="pb-6 border-b border-gray-100 last:border-0 last:pb-0"
//                       >
//                         <div className="flex items-start justify-between mb-3">
//                           <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
//                               <span className="text-white font-medium text-sm">
//                                 {review.user?.name?.charAt(0) || "U"}
//                               </span>
//                             </div>
//                             <div>
//                               <h4 className="font-semibold text-gray-900">
//                                 {review.user?.name || "Anonymous"}
//                               </h4>
//                               <div className="flex items-center mt-1">
//                                 <div className="flex items-center">
//                                   {[...Array(5)].map((_, i) => (
//                                     <Star
//                                       key={i}
//                                       className={`w-4 h-4 ${
//                                         i < review.rating
//                                           ? "text-amber-400 fill-current"
//                                           : "text-gray-300"
//                                       }`}
//                                     />
//                                   ))}
//                                 </div>
//                                 <span className="ml-2 text-sm text-gray-500">
//                                   {new Date(
//                                     review.createdAt
//                                   ).toLocaleDateString()}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <p className="text-gray-700 italic">
//                           "{review.comment}"
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
//                       <Star className="w-10 h-10 text-purple-600" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       No reviews yet
//                     </h3>
//                     <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                       Reviews will appear here after your first completed tours.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-8">
//             {/* Guide Statistics */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-6">
//                 Your Statistics
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
//                       <Package className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         Total Listings
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {dashboardData.stats.totalListings} tours created
//                       </p>
//                     </div>
//                   </div>
//                   <Link
//                     href="/dashboard/guide/my-listings"
//                     className="text-emerald-600 hover:text-emerald-800"
//                   >
//                     <Eye className="w-5 h-5" />
//                   </Link>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//                       <CheckCircle className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         Completed Bookings
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {dashboardData.stats.completedBookings} experiences
//                       </p>
//                     </div>
//                   </div>
//                   <Link
//                     href="/dashboard/guide/upcoming-bookings?status=completed"
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     <Eye className="w-5 h-5" />
//                   </Link>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
//                       <MessageCircle className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Response Rate</p>
//                       <p className="text-sm text-gray-500">
//                         Respond quickly to inquiries
//                       </p>
//                     </div>
//                   </div>
//                   <span className="text-amber-600 font-medium">100%</span>
//                 </div>
//               </div>
//             </div>

//             {/* Guide Level */}
//             <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-6">
//               <div className="flex items-center space-x-4 mb-4">
//                 <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
//                   <Award className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-gray-900">Guide Level</h4>
//                   <p className="text-sm text-gray-600">Rising Star</p>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <div className="flex justify-between text-sm text-gray-600 mb-1">
//                   <span>Progress to next level</span>
//                   <span>65%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full"
//                     style={{ width: "65%" }}
//                   ></div>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-700 mb-4">
//                 Complete 5 more tours to reach "Experienced Guide" level and
//                 unlock premium features.
//               </p>
//             </div>

//             {/* Support CTA */}
//             <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
//                 <MessageCircle className="w-6 h-6 text-white" />
//               </div>
//               <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
//               <p className="text-sm text-gray-600 mb-4">
//                 Our support team is here to help you succeed as a guide.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// app/dashboard/guide/page.tsx
// app/dashboard/guide/page.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchDashboard } from "@/services/meta/meta.service";
import GuideDashboardClient from "@/components/modules/Guide/GuideDashboardClient";

export default function GuideDashboardPage() {
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading guide dashboard:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load guide dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white p-6">
        <div className="animate-pulse mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 text-amber-600">⚠️</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Unable to load dashboard
            </h2>
            <p className="text-gray-600 mb-8">{error || "Please try again"}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
              >
                Try Again
              </button>
              <a
                href="/dashboard/guide/my-listings"
                className="block px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
              >
                Manage Listings
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <GuideDashboardClient dashboardData={dashboardData} />;
}
