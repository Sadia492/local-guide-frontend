// import { cookies } from "next/headers";
// import ProfileHeader from "@/components/modules/Profile/ProfileHeader";
// import ProfileTabs from "@/components/modules/Profile/ProfileTabs";
// import ProfileAbout from "@/components/modules/Profile/ProfileAbout";
// import ProfileTours from "@/components/modules/Profile/ProfileTours";
// import ProfileReviews from "@/components/modules/Profile/ProfileReviews";
// import { getCurrentUser } from "@/services/auth/auth.service";
// import { getUserProfile } from "@/services/user/user.service";

import ProfilePageWrapper from "@/components/modules/Profile/ProfilePageWrapper";

// export const metadata = {
//   title: "User Profile | LocalGuide",
//   description: "View user profile, reviews, and tours on LocalGuide.",
// };

// interface ProfilePageProps {
//   params: Promise<{
//     id: string;
//   }>;
//   searchParams?: Promise<{
//     tab?: string;
//   }>;
// }

// export default async function ProfilePage({
//   params,
//   searchParams,
// }: ProfilePageProps) {
//   const { id: userId } = await params;
//   const searchParamsObj = await searchParams;
//   const activeTab = searchParamsObj?.tab || "about";

//   try {
//     // Get cookies from the request
//     const cookieStore = await cookies();
//     const requestCookies = cookieStore.toString();

//     // Fetch all data in parallel
//     const [profileData, currentUser] = await Promise.all([
//       getUserProfile(userId, requestCookies),
//       getCurrentUser(),
//     ]);

//     const { user, listings = [], reviews = [], stats } = profileData;
//     const isGuide = user.role === "GUIDE";
//     const isTourist = user.role === "TOURIST";
//     const isOwnProfile = currentUser?._id === userId;

//     // Use stats from API or calculate fallback
//     const profileStats = {
//       toursGiven: stats?.completedBookings || 0,
//       averageRating: stats?.averageRating || 0,
//       totalReviews: stats?.totalReviews || reviews.length,
//       totalBookings: stats?.totalBookings || 0,
//       completedTours: stats?.completedBookings || 0,
//     };

//     return (
//       <div className="min-h-screen bg-gray-50">
//         {/* Hero Section */}
//         <div className="relative">
//           {/* Background Cover */}
//           <div
//             className={`h-64 ${
//               isGuide
//                 ? "bg-gradient-to-r from-green-600 to-emerald-600"
//                 : user.role === "ADMIN"
//                 ? "bg-gradient-to-r from-purple-600 to-indigo-600"
//                 : "bg-gradient-to-r from-blue-600 to-purple-600"
//             }`}
//           ></div>

//           {/* Profile Header Container */}
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
//             <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//               {/* Profile Header Component */}
//               <ProfileHeader
//                 user={user}
//                 stats={profileStats}
//                 listingsCount={listings.length}
//                 isOwnProfile={isOwnProfile}
//                 isGuide={isGuide}
//                 isTourist={isTourist}
//               />

//               {/* Tabs Component - Now inside the same card */}
//               <ProfileTabs
//                 activeTab={activeTab}
//                 isGuide={isGuide}
//                 isTourist={isTourist}
//                 listingsCount={listings.length}
//                 reviewsCount={reviews.length}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Tab Content - Separate container for the content */}
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {activeTab === "about" && (
//             <ProfileAbout user={user} isOwnProfile={isOwnProfile} />
//           )}

//           {activeTab === "tours" && isGuide && (
//             <ProfileTours listings={listings} isOwnProfile={isOwnProfile} />
//           )}

//           {activeTab === "reviews" && (
//             <ProfileReviews
//               reviews={reviews}
//               stats={profileStats}
//               isGuide={isGuide}
//               isOwnProfile={isOwnProfile}
//             />
//           )}
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("Error loading profile:", error);

//     // More detailed error logging
//     console.error("Error details:", {
//       message: error instanceof Error ? error.message : "Unknown error",
//       userId,
//     });

//     // Check if it's an authentication error
//     const isAuthError =
//       error instanceof Error &&
//       (error.message.includes("Authentication") ||
//         error.message.includes("auth") ||
//         error.message.includes("401"));

//     if (isAuthError) {
//       return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//           <div className="text-center py-12 max-w-md">
//             <div className="w-16 h-16 mx-auto text-gray-400 mb-4">🔒</div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-3">
//               Profile Access Restricted
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {error.message ||
//                 "You need to be logged in to view this profile. Please log in and try again."}
//             </p>
//             <div className="space-x-4">
//               <a
//                 href="/explore"
//                 className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Explore Tours
//               </a>
//               <a
//                 href="/login"
//                 className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 Login to View
//               </a>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     // Handle other errors
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center py-12">
//           <div className="w-16 h-16 mx-auto text-gray-400 mb-4">⚠️</div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             Error Loading Profile
//           </h2>
//           <p className="text-gray-600 mb-4">
//             {error instanceof Error ? error.message : "Something went wrong"}
//           </p>
//           <a
//             href="/explore"
//             className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Explore Tours
//           </a>
//         </div>
//       </div>
//     );
//   }
// }

// app/profile/[id]/page.tsx

export const metadata = {
  title: "User Profile | LocalGuide",
  description: "View user profile, reviews, and tours on LocalGuide.",
};

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    tab?: string;
  }>;
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  // We still need to unwrap the params for metadata generation
  const { id } = await params;

  return <ProfilePageWrapper />;
}
