import { User } from "lucide-react";
import Link from "next/link";
import { Guide } from "@/types/listing";

interface ListingGuideInfoProps {
  guide: Guide | string;
}

export default function ListingGuideInfo({ guide }: ListingGuideInfoProps) {
  const guideData =
    typeof guide === "object"
      ? guide
      : {
          _id: guide,
          name: "Local Guide",
          languages: ["English"],
        };

  return (
    <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        About Your Guide
      </h3>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{guideData.name}</h4>
          <p className="text-gray-600 text-sm mt-1">
            Passionate local expert with in-depth knowledge
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {guideData.languages?.map((lang) => (
              <span
                key={lang}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {lang}
              </span>
            ))}
          </div>
          <Link
            href={`/profile/${guideData._id}`}
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View full profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
