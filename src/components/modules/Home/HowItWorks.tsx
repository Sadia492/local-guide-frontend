import React from "react";
import { Search, MessageCircle, MapPin } from "lucide-react";
export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Find Your Guide",
      description:
        "Browse local experts by destination, interests, and language. Read reviews and check their expertise.",
    },
    {
      icon: MessageCircle,
      title: "Book & Connect",
      description:
        "Request a tour date and communicate directly with your guide to customize your experience.",
    },
    {
      icon: MapPin,
      title: "Explore Together",
      description:
        "Meet your guide and discover hidden gems, local stories, and authentic experiences.",
    },
  ];
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to your next authentic adventure
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-0.5 bg-blue-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
