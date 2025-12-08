"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Profile page error:", error);
  }, [error]);

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto text-gray-400 mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Error Loading Profile
      </h2>
      <p className="text-gray-600 mb-4">
        {error.message || "Something went wrong while loading the profile"}
      </p>
      <button
        onClick={reset}
        className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
