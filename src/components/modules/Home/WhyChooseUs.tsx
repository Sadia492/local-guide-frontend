import React from "react";
import { Shield, Users, Globe, Heart } from "lucide-react";
export function WhyChooseUs() {
  const benefits = [
    {
      icon: Shield,
      title: "Verified Guides",
      description:
        "All guides are verified with reviews from real travelers to ensure quality and safety.",
    },
    {
      icon: Users,
      title: "Local Expertise",
      description:
        "Connect with passionate locals who know their city inside and out.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Find authentic experiences in over 100 cities worldwide.",
    },
    {
      icon: Heart,
      title: "Personalized Tours",
      description: "Every tour is customized to match your interests and pace.",
    },
  ];
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose LocalGuide?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We connect you with authentic experiences and trusted local experts
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <div className="bg-gradient-to-br from-blue-100 to-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <benefit.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
