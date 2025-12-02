import React, { memo } from "react";
import { Star, Quote } from "lucide-react";
export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
      rating: 5,
      text: "Marie showed us parts of Paris we never would have found on our own. The hidden cafes and local art galleries were incredible. Best tour experience ever!",
    },
    {
      name: "David Chen",
      location: "Toronto, Canada",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      rating: 5,
      text: "Kenji's food tour in Tokyo was phenomenal. His knowledge of local cuisine and culture made the experience truly authentic and memorable.",
    },
    {
      name: "Emma Williams",
      location: "London, UK",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
      rating: 5,
      text: "Sofia's architecture tour in Barcelona was fascinating. She brought Gaudí's work to life with stories and insights you won't find in guidebooks.",
    },
  ];
  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Travelers Say
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Real experiences from real travelers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-colors"
            >
              <Quote className="w-10 h-10 text-blue-300 mb-4" />

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <p className="text-blue-50 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-blue-200">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
