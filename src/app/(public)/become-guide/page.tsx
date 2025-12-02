"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  Star,
  Users,
  DollarSign,
  Globe,
  Award,
  Shield,
  Heart,
} from "lucide-react";
import Link from "next/link";

// Mock stats - replace with real data
const guideStats = {
  totalGuides: 2450,
  totalEarnings: "$8.2M+",
  averageRating: 4.8,
  happyTravelers: "98K+",
};

const requirements = [
  "At least 18 years old",
  "Good knowledge of your city/region",
  "Passion for sharing your culture",
  "Good communication skills",
  "Valid government ID",
  "Bank account for payments",
];

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Sign up and complete your guide profile with photos and bio",
  },
  {
    number: "02",
    title: "Design Your Tours",
    description: "Create unique tour experiences that showcase your expertise",
  },
  {
    number: "03",
    title: "Get Verified",
    description:
      "Complete our verification process to build trust with travelers",
  },
  {
    number: "04",
    title: "Start Earning",
    description: "Accept bookings and share amazing experiences while earning",
  },
];

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

const featuredGuides = [
  {
    name: "Maria Rodriguez",
    city: "Barcelona",
    specialty: "Food & Wine",
    earnings: "$42,580",
    rating: 4.9,
    image: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Kenji Tanaka",
    city: "Tokyo",
    specialty: "Traditional Arts",
    earnings: "$38,920",
    rating: 4.8,
    image: "https://i.pravatar.cc/150?img=9",
  },
  {
    name: "Sophie Dubois",
    city: "Paris",
    specialty: "Art History",
    earnings: "$51,230",
    rating: 4.9,
    image: "https://i.pravatar.cc/150?img=10",
  },
];

export default function BecomeAGuidePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    experience: "",
    languages: [] as string[],
    interests: [] as string[],
  });

  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Japanese",
    "Chinese",
    "Arabic",
  ];
  const interestOptions = [
    "Food & Dining",
    "History",
    "Art & Culture",
    "Nightlife",
    "Adventure",
    "Shopping",
    "Nature",
    "Photography",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    type: "languages" | "interests",
    value: string
  ) => {
    setFormData((prev) => {
      const currentArray = prev[type];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [type]: newArray };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Redirect to registration or show success message
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Become a Local Guide
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Share your passion, meet amazing people, and earn money doing what
              you love
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {guideStats.totalGuides}
                </div>
                <p className="text-blue-200">Active Guides</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {guideStats.totalEarnings}
                </div>
                <p className="text-blue-200">Total Earned</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-3xl md:text-4xl font-bold mb-2">
                  <Star className="w-6 h-6 mr-2 fill-current text-yellow-400" />
                  {guideStats.averageRating}
                </div>
                <p className="text-blue-200">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {guideStats.happyTravelers}
                </div>
                <p className="text-blue-200">Happy Travelers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-blue-200 transform translate-x-8"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
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

        {/* Requirements */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              Requirements to Get Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Successful Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredGuides.map((guide, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={guide.image}
                      alt={guide.name}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{guide.name}</h3>
                      <p className="text-gray-600">{guide.city}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {guide.specialty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{guide.rating}</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {guide.earnings}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-blue-100">
                  Join our community of passionate local guides
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City & Region *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Where will you be guiding?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Languages */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Languages You Speak *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {languageOptions.map((language) => (
                      <div key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`lang-${language}`}
                          checked={formData.languages.includes(language)}
                          onChange={() =>
                            handleCheckboxChange("languages", language)
                          }
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`lang-${language}`} className="ml-2">
                          {language}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Areas of Interest / Expertise *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {interestOptions.map((interest) => (
                      <div key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`interest-${interest}`}
                          checked={formData.interests.includes(interest)}
                          onChange={() =>
                            handleCheckboxChange("interests", interest)
                          }
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`interest-${interest}`}
                          className="ml-2"
                        >
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to become a guide? *
                  </label>
                  <textarea
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about your experience, passion for your city, and why you'd make a great guide..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-12 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Apply Now - It's Free!
                  </button>
                  <p className="text-gray-600 mt-4 text-sm">
                    By applying, you agree to our Terms of Service and Privacy
                    Policy
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "How much can I earn as a guide?",
                a: "Earnings vary based on your tour prices, availability, and ratings. Most guides earn between $50-200 per tour, with top guides earning $5,000+ monthly.",
              },
              {
                q: "How do I get paid?",
                a: "We process payments securely through our platform. You'll receive payments directly to your bank account after each completed tour.",
              },
              {
                q: "How long does verification take?",
                a: "The verification process typically takes 2-3 business days after you submit all required documents.",
              },
              {
                q: "Can I work as a guide part-time?",
                a: "Absolutely! Many of our guides work part-time while studying, working other jobs, or raising families.",
              },
              {
                q: "What support do you provide to guides?",
                a: "We offer 24/7 support, marketing tools, insurance coverage, and resources to help you succeed.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your Journey Today
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of guides who are sharing their passion and earning
              money
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all"
              >
                Apply Now
              </button>
              <Link href="/contact">
                <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-all">
                  Contact Support
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
