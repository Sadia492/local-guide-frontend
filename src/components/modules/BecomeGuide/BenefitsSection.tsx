import { DollarSign, Globe, Award, Shield, Heart, Users } from "lucide-react";

const benefits = [
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: "Earn Extra Income",
    description: "Turn your local knowledge into a flexible source of income",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Meet People Worldwide",
    description:
      "Connect with travelers from different cultures and backgrounds",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Build Your Brand",
    description: "Establish yourself as an expert guide in your city",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Share Your Passion",
    description: "Showcase what you love about your city or region",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure Payments",
    description: "Get paid reliably through our secure payment system",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Flexible Schedule",
    description: "Work when you want and set your own availability",
  },
];

export default function BenefitsSection() {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-12">
        Why Become a Guide
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-blue-600 mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
