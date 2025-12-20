// "use client";

// import { useEffect, useState } from "react";
// import {
//   Users,
//   MapPin,
//   Calendar,
//   DollarSign,
//   Star,
//   Package,
//   CreditCard,
//   Clock,
//   CheckCircle,
//   UserCheck,
//   AlertCircle,
// } from "lucide-react";
// import Link from "next/link";
// import dynamic from "next/dynamic";

// // Dynamically import charts
// const BarChart = dynamic<{
//   data: { month: string; count: number }[];
//   xKey: string;
//   bars: { key: string; color: string; label: string }[];
// }>(() => import("@/components/shared/Charts/BarChart"), {
//   ssr: false,
//   loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />,
// });
// const PieChart = dynamic<{
//   data: Array<{ name: string; value: number }>;
//   colors?: string[];
// }>(() => import("@/components/shared/Charts/PieChart"), {
//   ssr: false,
//   loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />,
// });

// interface DashboardStats {
//   totalListings: number;
//   activeListings: number;
//   totalBookings: number;
//   pendingBookings: number;
//   totalUsers: number;
//   totalGuides: number;
//   totalTourists: number;
//   totalRevenue: number;
//   averageRating: number;
//   recentBookings: any[];
//   recentReviews: any[];
// }

// interface ChartData {
//   barChartData: Array<{
//     _id: { year: number; month: number };
//     count: number;
//     revenue: number;
//     month: string;
//   }>;
//   pieChartData: {
//     bookingStatus: Array<{ _id: string; count: number }>;
//     listingCategories: Array<{ _id: string; count: number }>;
//     userRoles: Array<{ _id: string; count: number }>;
//   };
// }

// export default function AdminDashboardPage() {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [chartData, setChartData] = useState<ChartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch stats from your admin endpoint
//         const statsResponse = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/meta/dashboard/admin`,
//           {
//             credentials: "include",
//           }
//         );
//         console.log(statsResponse);
//         if (!statsResponse.ok) {
//           throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
//         }

//         const statsResult = await statsResponse.json();

//         if (statsResult.success) {
//           setStats(statsResult.data);

//           // Now fetch chart data separately
//           try {
//             const chartsResponse = await fetch(
//               `${process.env.NEXT_PUBLIC_API_URL}/api/meta/charts`,
//               {
//                 credentials: "include",
//               }
//             );

//             if (chartsResponse.ok) {
//               const chartsResult = await chartsResponse.json();
//               if (chartsResult.success) {
//                 setChartData(chartsResult.data);
//               }
//             }
//           } catch (chartsError) {
//             console.log("Charts data not available:", chartsError);
//             // Continue without charts if they fail
//           }
//         } else {
//           throw new Error(statsResult.message || "Invalid data received");
//         }
//       } catch (error) {
//         console.error("Error loading dashboard:", error);
//         setError(
//           error instanceof Error
//             ? error.message
//             : "Failed to load dashboard data"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="p-6 space-y-6">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
//           <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
//             >
//               <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
//               <div className="h-10 bg-gray-200 rounded w-1/2"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error || !stats) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//           <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertCircle className="w-6 h-6 text-red-600" />
//           </div>
//           <h2 className="text-xl font-bold text-gray-900 mb-2">
//             Error Loading Dashboard
//           </h2>
//           <p className="text-gray-600 mb-4">
//             {error || "Failed to load dashboard data"}
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Prepare REAL data for stat cards - NO FAKE DATA
//   const statCards = [
//     {
//       title: "Total Users",
//       value: stats.totalUsers,
//       icon: Users,
//       color: "bg-gradient-to-br from-blue-500 to-blue-600",
//       secondaryValue: `${stats.totalGuides} guides, ${stats.totalTourists} tourists`,
//       link: "/dashboard/admin/users",
//       description: "Registered platform users",
//     },
//     {
//       title: "Total Tours",
//       value: stats.totalListings,
//       icon: MapPin,
//       color: "bg-gradient-to-br from-green-500 to-emerald-600",
//       secondaryValue: `${stats.activeListings} active`,
//       link: "/dashboard/admin/listings",
//       description: "Tour listings created",
//     },
//     {
//       title: "Total Bookings",
//       value: stats.totalBookings,
//       icon: Calendar,
//       color: "bg-gradient-to-br from-amber-500 to-orange-600",
//       secondaryValue: `${stats.pendingBookings} pending`,
//       link: "/dashboard/admin/bookings",
//       description: "All reservations",
//     },
//     {
//       title: "Completed Bookings",
//       value: stats.totalBookings - stats.pendingBookings,
//       icon: CheckCircle,
//       color: "bg-gradient-to-br from-teal-500 to-teal-600",
//       secondaryValue: `${stats.pendingBookings} pending`,
//       link: "/dashboard/admin/bookings?status=completed",
//       description: "Fulfilled experiences",
//     },
//     {
//       title: "Active Tours",
//       value: stats.activeListings,
//       icon: Package,
//       color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
//       secondaryValue: `${stats.totalListings} total`,
//       link: "/dashboard/admin/listings?status=active",
//       description: "Currently available",
//     },
//     {
//       title: "Average Rating",
//       value: stats.averageRating.toFixed(1),
//       icon: Star,
//       color: "bg-gradient-to-br from-pink-500 to-rose-600",
//       secondaryValue: `${stats.recentReviews.length} recent reviews`,
//       link: "/dashboard/admin/reviews",
//       description: "Platform satisfaction",
//     },
//     {
//       title: "Pending Bookings",
//       value: stats.pendingBookings,
//       icon: Clock,
//       color: "bg-gradient-to-br from-rose-500 to-rose-600",
//       secondaryValue: "Awaiting confirmation",
//       link: "/dashboard/admin/bookings?status=pending",
//       description: "Needs action",
//     },
//     {
//       title: "Verified Guides",
//       value: stats.totalGuides,
//       icon: UserCheck,
//       color: "bg-gradient-to-br from-purple-500 to-purple-600",
//       secondaryValue: `${stats.totalTourists} tourists`,
//       link: "/dashboard/admin/guides",
//       description: "Local experts",
//     },
//   ];

//   // Prepare REAL chart data from backend
//   const bookingChartData =
//     chartData?.barChartData?.map((item) => ({
//       month: item.month.split("-")[1], // Get month number
//       count: item.count,
//       // Removed revenue since you said to ignore it
//     })) || [];

//   const categoryChartData =
//     chartData?.pieChartData?.listingCategories?.map((item) => ({
//       name: item._id,
//       value: item.count,
//     })) || [];

//   const userRoleData =
//     chartData?.pieChartData?.userRoles?.map((item) => ({
//       name: item._id,
//       value: item.count,
//     })) || [];

//   const bookingStatusData =
//     chartData?.pieChartData?.bookingStatus?.map((item) => ({
//       name: item._id,
//       value: item.count,
//     })) || [];

//   const managementSections = [
//     {
//       title: "User Management",
//       description: `Manage ${stats.totalUsers} user accounts`,
//       icon: Users,
//       link: "/dashboard/admin/users",
//       linkText: "Manage Users",
//       color: "bg-blue-50 border-blue-100",
//     },
//     {
//       title: "Tour Management",
//       description: `Manage ${stats.totalListings} tour listings`,
//       icon: MapPin,
//       link: "/dashboard/admin/listings",
//       linkText: "Manage Tours",
//       color: "bg-green-50 border-green-100",
//     },
//     {
//       title: "Booking Management",
//       description: `Manage ${stats.totalBookings} bookings`,
//       icon: Calendar,
//       link: "/dashboard/admin/bookings",
//       linkText: "View Bookings",
//       color: "bg-amber-50 border-amber-100",
//     },
//   ];

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           Admin Dashboard
//         </h1>
//         <p className="text-gray-600">
//           Real-time platform overview • Last updated:{" "}
//           {new Date().toLocaleTimeString()}
//         </p>
//       </div>

//       {/* Stats Grid - ALL REAL DATA */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statCards.map((card) => (
//           <Link
//             href={card.link}
//             key={card.title}
//             className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100 block"
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">
//                   {card.title}
//                 </p>
//                 <p className="text-2xl font-bold mt-2 text-gray-900">
//                   {card.value}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">{card.description}</p>
//               </div>
//               <div className={`${card.color} p-3 rounded-xl`}>
//                 <card.icon className="w-6 h-6 text-white" />
//               </div>
//             </div>

//             <div className="pt-4 border-t border-gray-50">
//               <span className="text-sm font-medium text-gray-600">
//                 {card.secondaryValue}
//               </span>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {/* Charts Section - REAL CHART DATA */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Monthly Bookings Chart */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-lg font-bold text-gray-900">
//                 Monthly Bookings
//               </h3>
//               <p className="text-sm text-gray-500">
//                 {bookingChartData.length > 0
//                   ? `Showing ${bookingChartData.length} months of data`
//                   : "No booking data available"}
//               </p>
//             </div>
//             <div className="flex space-x-2">
//               <span className="inline-flex items-center text-sm">
//                 <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
//                 Bookings
//               </span>
//             </div>
//           </div>
//           <div className="h-64">
//             {chartData && bookingChartData.length > 0 ? (
//               <BarChart
//                 data={bookingChartData}
//                 xKey="month"
//                 bars={[{ key: "count", color: "#3b82f6", label: "Bookings" }]}
//               />
//             ) : (
//               <div className="h-full flex items-center justify-center text-gray-400">
//                 No booking data available yet
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Tour Categories Distribution */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="mb-6">
//             <h3 className="text-lg font-bold text-gray-900">Tour Categories</h3>
//             <p className="text-sm text-gray-500">
//               {categoryChartData.length > 0
//                 ? `${categoryChartData.length} categories`
//                 : "No category data"}
//             </p>
//           </div>
//           <div className="h-64">
//             {chartData && categoryChartData.length > 0 ? (
//               <PieChart
//                 data={categoryChartData}
//                 colors={[
//                   "#3b82f6",
//                   "#10b981",
//                   "#f59e0b",
//                   "#8b5cf6",
//                   "#ef4444",
//                   "#ec4899",
//                 ]}
//               />
//             ) : (
//               <div className="h-full flex items-center justify-center text-gray-400">
//                 No category data available
//               </div>
//             )}
//           </div>
//           <div className="mt-4 space-y-2">
//             {categoryChartData.slice(0, 3).map((item, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">{item.name}</span>
//                 <span className="text-sm font-medium text-gray-900">
//                   {item.value} tours
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity & Management - REAL DATA */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Recent Bookings - REAL DATA */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-lg font-bold text-gray-900">
//                 Recent Bookings
//               </h3>
//               <p className="text-sm text-gray-500">
//                 {stats.recentBookings?.length > 0
//                   ? `${stats.recentBookings.length} recent bookings`
//                   : "No recent bookings"}
//               </p>
//             </div>
//             <Link
//               href="/admin/bookings"
//               className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//             >
//               View all →
//             </Link>
//           </div>

//           <div className="space-y-4">
//             {stats.recentBookings && stats.recentBookings.length > 0 ? (
//               stats.recentBookings.map((booking) => (
//                 <div
//                   key={booking._id}
//                   className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div
//                       className={`p-2 rounded-lg ${
//                         booking.status === "COMPLETED"
//                           ? "bg-green-100 text-green-600"
//                           : booking.status === "PENDING"
//                           ? "bg-amber-100 text-amber-600"
//                           : "bg-blue-100 text-blue-600"
//                       }`}
//                     >
//                       <Calendar className="w-5 h-5" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="font-medium text-gray-900 truncate">
//                         {booking.listing?.title || "Unknown Tour"}
//                       </p>
//                       <p className="text-sm text-gray-500 truncate">
//                         {booking.user?.name || "Unknown User"} • $
//                         {booking.totalPrice || 0}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <span
//                       className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
//                         booking.status === "COMPLETED"
//                           ? "bg-green-100 text-green-800"
//                           : booking.status === "PENDING"
//                           ? "bg-amber-100 text-amber-800"
//                           : "bg-blue-100 text-blue-800"
//                       }`}
//                     >
//                       {booking.status || "UNKNOWN"}
//                     </span>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {booking.date
//                         ? new Date(booking.date).toLocaleDateString()
//                         : "No date"}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8 text-gray-400">
//                 No recent bookings found
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Quick Management & Stats */}
//         <div className="space-y-6">
//           {/* Management Cards */}
//           {managementSections.map((section) => (
//             <Link
//               href={section.link}
//               key={section.title}
//               className={`group p-6 rounded-xl border-2 ${section.color} hover:border-blue-300 transition-all duration-300 block`}
//             >
//               <div className="flex items-center space-x-4">
//                 <div
//                   className={`p-3 rounded-lg ${section.color
//                     .replace("50", "100")
//                     .replace("border-", "bg-")}`}
//                 >
//                   <section.icon className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-gray-900">{section.title}</h4>
//                   <p className="text-sm text-gray-600 mt-1">
//                     {section.description}
//                   </p>
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-800">
//                 <span className="text-sm font-medium">{section.linkText}</span>
//                 <span className="ml-2 group-hover:translate-x-1 transition-transform">
//                   →
//                 </span>
//               </div>
//             </Link>
//           ))}

//           {/* User Role Distribution - REAL DATA */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <h4 className="font-bold text-gray-900 mb-4">User Distribution</h4>
//             <div className="space-y-3">
//               {userRoleData.map((role, index) => (
//                 <div key={index} className="flex items-center justify-between">
//                   <span className="text-sm text-gray-600">{role.name}</span>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-gray-900">
//                       {role.value}
//                     </span>
//                     <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <div
//                         className={`h-full ${
//                           index === 0
//                             ? "bg-blue-500"
//                             : index === 1
//                             ? "bg-green-500"
//                             : "bg-purple-500"
//                         }`}
//                         style={{
//                           width:
//                             stats.totalUsers > 0
//                               ? `${(role.value / stats.totalUsers) * 100}%`
//                               : "0%",
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Recent Reviews - REAL DATA */}
//           {stats.recentReviews && stats.recentReviews.length > 0 && (
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//               <h4 className="font-bold text-gray-900 mb-4">Recent Reviews</h4>
//               <div className="space-y-3">
//                 {stats.recentReviews.slice(0, 3).map((review, index) => (
//                   <div key={index} className="flex items-center space-x-3">
//                     <div className="flex items-center">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-4 h-4 ${
//                             i < review.rating
//                               ? "text-yellow-400 fill-current"
//                               : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-sm text-gray-900 truncate">
//                         {review.comment || "No comment"}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {review.user?.name || "Anonymous"}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {stats.recentReviews.length > 3 && (
//                 <Link
//                   href="/admin/reviews"
//                   className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 inline-block"
//                 >
//                   View all {stats.recentReviews.length} reviews →
//                 </Link>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// app/dashboard/admin/page.tsx
// app/dashboard/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  getAdminDashboardStats,
  getChartData,
} from "@/services/meta/meta.service";
import AdminDashboardClient from "@/components/modules/Admin/AdminDashboardClient";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [chartData, setChartData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both in parallel
        const [statsData, chartData] = await Promise.all([
          getAdminDashboardStats(),
          getChartData(),
        ]);

        setStats(statsData);
        setChartData(chartData);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 text-red-600">⚠️</div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "Failed to load dashboard data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const bookingChartData =
    chartData?.barChartData?.map((item: any) => ({
      month: item.month.split("-")[1],
      count: item.count,
    })) || [];

  const categoryChartData =
    chartData?.pieChartData?.listingCategories?.map((item: any) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const userRoleData =
    chartData?.pieChartData?.userRoles?.map((item: any) => ({
      name: item._id,
      value: item.count,
    })) || [];

  return (
    <AdminDashboardClient
      stats={stats}
      bookingChartData={bookingChartData}
      categoryChartData={categoryChartData}
      userRoleData={userRoleData}
      hasChartData={!!chartData}
    />
  );
}
