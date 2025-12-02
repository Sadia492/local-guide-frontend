import React from "react";
import {
  Utensils,
  Camera,
  Landmark,
  Music,
  ShoppingBag,
  Mountain,
} from "lucide-react";
export function Categories() {
  const categories = [
    {
      icon: Utensils,
      name: "Food & Drink",
      count: 342,
    },
    {
      icon: Camera,
      name: "Photography",
      count: 189,
    },
    {
      icon: Landmark,
      name: "History & Culture",
      count: 267,
    },
    {
      icon: Music,
      name: "Nightlife",
      count: 156,
    },
    {
      icon: ShoppingBag,
      name: "Shopping",
      count: 198,
    },
    {
      icon: Mountain,
      name: "Adventure",
      count: 223,
    },
  ];
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Interest
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find experiences that match your passion
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group bg-gray-50 hover:bg-blue-50 rounded-2xl p-6 text-center cursor-pointer transition-all hover:shadow-lg"
            >
              <div className="bg-white group-hover:bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <category.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.count} tours</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
