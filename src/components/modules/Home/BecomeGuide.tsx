import React from "react";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
export function BecomeGuide() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Earn Extra Income",
      description: "Set your own rates and schedule",
    },
    {
      icon: Calendar,
      title: "Flexible Schedule",
      description: "Work when it suits you",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Build your reputation and client base",
    },
  ];
  return (
    <section
      id="become-guide"
      className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Share Your City, Earn Money
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Turn your local knowledge into income. Join thousands of guides
              who are sharing their passion and earning on their own terms.
            </p>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-white/20 rounded-lg p-3 mr-4">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-green-100">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="lg"
              className="bg-white text-green-700 hover:bg-green-50 border-0"
            >
              Start Earning Today
            </Button>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
              alt="Happy local guide with tourists"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
