// app/faq/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  User,
  Calendar,
  DollarSign,
  Shield,
  Compass,
  MessageSquare,
  CheckCircle,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

const faqCategories = [
  { id: "general", name: "General", icon: HelpCircle },
  { id: "bookings", name: "Bookings", icon: Calendar },
  { id: "guides", name: "For Guides", icon: User },
  { id: "safety", name: "Safety", icon: Shield },
];

const faqs = {
  general: [
    {
      question: "What is LocalGuide?",
      answer:
        "LocalGuide connects travelers with authentic local experiences guided by verified locals. Discover hidden gems and create memorable travel experiences beyond typical tourist attractions.",
    },
    {
      question: "How do I create an account?",
      answer:
        "Click 'Sign Up' in the top navigation or visit the registration page. Sign up with email or social media (Google/Facebook). The process takes less than 2 minutes.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Yes! Download from the App Store (iOS) or Google Play (Android). The app includes all features plus push notifications for booking updates.",
    },
  ],
  bookings: [
    {
      question: "How do I book a tour?",
      answer:
        "1. Browse tours on Explore page 2. Select date and group size 3. Click 'Book Now' and complete payment 4. Receive confirmation email with guide contact info.",
    },
    {
      question: "Can I cancel or reschedule?",
      answer:
        "Cancellations free up to 48 hours before. Rescheduling free up to 24 hours before. Contact the guide directly or use booking management.",
    },
    {
      question: "What happens if it rains?",
      answer:
        "Most tours operate rain or shine. Guides provide rain gear or adjust itinerary. Severe weather = rescheduling or full refund.",
    },
  ],
  guides: [
    {
      question: "How do I become a guide?",
      answer:
        "Apply through 'Become a Guide' page. Submit info, proposed experiences, complete verification (background check + interview). Reviewed in 3-5 business days.",
    },
    {
      question: "How much can I earn?",
      answer:
        "$200-500/week part-time. Top guides with popular tours: $2000+/month. 15% commission covers platform costs.",
    },
    {
      question: "What support do you provide?",
      answer:
        "Marketing materials, insurance, payment processing, 24/7 emergency support, guide community forum, training resources.",
    },
  ],
  safety: [
    {
      question: "How do you verify guides?",
      answer:
        "4-step verification: 1) Identity 2) Background check 3) Experience validation 4) Training. Only 30% of applicants pass.",
    },
    {
      question: "What safety measures?",
      answer:
        "24/7 emergency support, GPS tracking, secure messaging, verified reviews, $1M liability insurance, emergency training.",
    },
    {
      question: "Can I report safety concerns?",
      answer:
        "Yes. Safety concerns reviewed within 24 hours. Multiple concerns = immediate suspension pending investigation.",
    },
  ],
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = faqs[activeCategory as keyof typeof faqs].filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Fixed spacing */}
      <div className="relative bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center">
            <div className="inline-flex p-3 bg-white/10 rounded-xl backdrop-blur-sm mb-6">
              <HelpCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
              Find answers to common questions about LocalGuide
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-white outline-none ring-2 ring-blue-500 "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Fixed container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Categories - Fixed positioning */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setExpandedItems([]);
                  setSearchQuery("");
                }}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            ))}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {faqCategories.find((c) => c.id === activeCategory)?.name}{" "}
              Questions
            </h2>
            <p className="text-gray-600">
              {searchQuery
                ? `Found ${filteredFaqs.length} result${
                    filteredFaqs.length !== 1 ? "s" : ""
                  } for "${searchQuery}"`
                : "Browse common questions and answers"}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ List - Main content */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-4 sm:px-5 py-4 text-left flex items-center justify-between hover:bg-blue-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900 text-left pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                          expandedItems.includes(index)
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`px-4 sm:px-5 overflow-hidden transition-all duration-300 ${
                        expandedItems.includes(index)
                          ? "py-4 border-t border-gray-100"
                          : "max-h-0"
                      }`}
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600">
                    Try different keywords or browse categories
                  </p>
                </div>
              )}
            </div>

            {/* Popular Topics */}
            <div className="mt-12 bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Popular Topics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Booking", icon: Calendar },
                  { label: "Payment", icon: DollarSign },
                  { label: "Safety", icon: Shield },
                  { label: "Cancellation", icon: CheckCircle },
                ].map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(topic.label)}
                    className="bg-white rounded-lg p-4 text-center hover:border-blue-300 hover:shadow-sm transition-all duration-300 border border-gray-200"
                  >
                    <topic.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {topic.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">
                      support@localguide.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri: 9AM-6PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="text-center">
                <Compass className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Ready to Explore?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Find your next adventure
                </p>
                <Link
                  href="/explore"
                  className="inline-block w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Tours
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-blue-50 py-12 border-t border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still Need Help?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Can't find what you're looking for? Contact our support team
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              <Compass className="w-5 h-5 mr-2" />
              Browse Tours
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
