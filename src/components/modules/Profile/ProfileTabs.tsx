"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface ProfileTabsProps {
  activeTab: string;
  isGuide: boolean;
  isTourist: boolean;
  listingsCount: number;
  reviewsCount: number;
}

export default function ProfileTabs({
  activeTab,
  isGuide,
  isTourist,
  listingsCount,
  reviewsCount,
}: ProfileTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="border-t border-gray-200">
      <nav className="flex overflow-x-auto">
        <button
          onClick={() => handleTabChange("about")}
          className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "about"
              ? isGuide
                ? "border-green-600 text-green-600"
                : "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          About
        </button>

        {isGuide && (
          <button
            onClick={() => handleTabChange("tours")}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "tours"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Tours ({listingsCount})
          </button>
        )}

        {(isGuide || isTourist) && (
          <button
            onClick={() => handleTabChange("reviews")}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "reviews"
                ? isGuide
                  ? "border-green-600 text-green-600"
                  : "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {isGuide ? "Reviews" : "Reviews Written"} ({reviewsCount})
          </button>
        )}
      </nav>
    </div>
  );
}
