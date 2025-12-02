import React from "react";
import { Star, MapPin, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
export function TopGuides() {
  const guides = [
    {
      name: "Marie Laurent",
      city: "Paris",
      rating: 4.9,
      reviews: 127,
      languages: ["English", "French"],
      specialty: "Art & History",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      rate: "$45/hour",
    },
    {
      name: "Kenji Tanaka",
      city: "Tokyo",
      rating: 5.0,
      reviews: 89,
      languages: ["English", "Japanese"],
      specialty: "Food & Culture",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      rate: "$50/hour",
    },
    {
      name: "Sofia Rodriguez",
      city: "Barcelona",
      rating: 4.8,
      reviews: 156,
      languages: ["English", "Spanish", "Catalan"],
      specialty: "Architecture",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
      rate: "$40/hour",
    },
  ];
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top-Rated Local Guides
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our most experienced and beloved guides
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-sm">{guide.rating}</span>
                  <span className="text-gray-500 text-sm">
                    ({guide.reviews})
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {guide.name}
                </h3>

                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{guide.city}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <Languages className="w-4 h-4 mr-1" />
                  <span className="text-sm">{guide.languages.join(", ")}</span>
                </div>

                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {guide.specialty}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-lg font-bold text-gray-900">
                    {guide.rate}
                  </span>
                  <Button variant="primary" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
