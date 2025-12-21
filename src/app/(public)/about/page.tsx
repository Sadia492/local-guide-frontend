// app/about/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Users,
  Shield,
  Heart,
  Award,
  Compass,
  MapPin,
  Star,
  CheckCircle,
  Calendar,
  Target,
  Sparkles,
} from "lucide-react";
import { getHeroStats } from "@/services/meta/meta.service"; // Import the service

interface HeroStats {
  happyTravelers: string;
  localGuides: string;
  cities: string;
  fiveStarReviews: number;
}

const teamMembers = [
  { name: "Alex Johnson", role: "Founder & CEO" },
  { name: "Maria Garcia", role: "Head of Guides" },
  { name: "David Chen", role: "Product Lead" },
  { name: "Sarah Williams", role: "Community Manager" },
];

const values = [
  {
    title: "Authentic Experiences",
    description: "Genuine local experiences over tourist traps",
    icon: Target,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Community First",
    description: "Supporting local economies & empowering guides",
    icon: Users,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Trust & Safety",
    description: "Verified guides with comprehensive insurance",
    icon: Shield,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Sustainable Travel",
    description: "Eco-friendly practices in all our tours",
    icon: Globe,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Quality Excellence",
    description: "Rigorous standards for unforgettable experiences",
    icon: Award,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Innovation Driven",
    description: "Constantly improving the travel experience",
    icon: Sparkles,
    color: "text-blue-600 bg-blue-50",
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("mission");
  const [stats, setStats] = useState<HeroStats>({
    happyTravelers: "50K+",
    localGuides: "2K+",
    cities: "500+",
    fiveStarReviews: 98,
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getHeroStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Keep default values if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Dynamic stats configuration
  const dynamicStats = [
    {
      label: "Active Guides",
      value: stats.localGuides,
      icon: Users,
      description: "Verified local guides",
    },
    {
      label: "Cities Covered",
      value: stats.cities,
      icon: MapPin,
      description: "Cities worldwide",
    },
    {
      label: "Happy Travelers",
      value: stats.happyTravelers,
      icon: Heart,
      description: "Satisfied travelers",
    },
    {
      label: "Avg. Rating",
      value: `${stats.fiveStarReviews}%`,
      icon: Star,
      description: "5-star experiences",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Fixed Blue Theme */}
      <div className="relative bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-8">
              <Compass className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Discover Local Experiences
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
              Connecting curious travelers with passionate local guides since
              2020
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300"
            >
              <Compass className="w-5 h-5 mr-2" />
              Explore Tours
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section - Dynamic */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dynamicStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  {loading ? (
                    // Skeleton loading state
                    <>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
                      <div className="h-8 w-16 sm:h-10 sm:w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 w-20 sm:w-24 bg-gray-100 rounded animate-pulse"></div>
                    </>
                  ) : (
                    <>
                      <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mb-3" />
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 font-medium mb-1">
                          {stat.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {stat.description}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12">
          {[
            { id: "mission", label: "Our Mission", icon: Target },
            { id: "story", label: "Our Story", icon: Calendar },
            { id: "values", label: "Values", icon: Award },
            { id: "team", label: "Team", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 sm:px-5 sm:py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content - Updated to show dynamic stats */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {activeTab === "mission" && (
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Redefining Travel Experiences
                  </h2>
                  <p className="text-gray-600 mb-6">
                    At LocalGuide, we believe the best travel experiences come
                    from connecting with locals who know their cities
                    intimately. We're on a mission to make authentic,
                    sustainable tourism accessible to everyone.
                  </p>

                  {/* Dynamic Stats Highlight */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Our Impact
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {loading ? "..." : stats.happyTravelers}
                        </div>
                        <div className="text-xs text-blue-700">Travelers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {loading ? "..." : stats.localGuides}
                        </div>
                        <div className="text-xs text-blue-700">
                          Local Guides
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Create meaningful connections between travelers and
                        local guides
                      </span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Support local economies and promote sustainable tourism
                      </span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Make travel more accessible, personal, and memorable
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 sm:p-8">
                  <div className="text-center">
                    <Globe className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 mx-auto mb-4" />
                    <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                      "Travel isn't about places, it's about perspectives"
                    </p>
                    <p className="text-gray-600 text-sm italic">
                      - Our Philosophy
                    </p>

                    {/* Additional Dynamic Stats */}
                    <div className="mt-6 pt-6 border-t border-blue-200">
                      <div className="flex justify-center space-x-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-700">
                            {loading ? "..." : stats.cities}
                          </div>
                          <div className="text-xs text-blue-600">Cities</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-700">
                            {loading ? "..." : `${stats.fiveStarReviews}%`}
                          </div>
                          <div className="text-xs text-blue-600">
                            Satisfaction
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "story" && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Our Journey
              </h2>

              {/* Timeline with dynamic stats */}
              <div className="space-y-6">
                {[
                  {
                    year: "2020",
                    title: "The Beginning",
                    description:
                      "Founded by travel enthusiasts who wanted to bridge the gap between tourists and authentic local experiences. Started with just 5 guides in 2 cities.",
                  },
                  {
                    year: "2022",
                    title: "Rapid Growth",
                    description: `Expanded to ${
                      loading ? "..." : stats.cities
                    } across 3 countries. Featured in Travel+ Magazine as 'The Future of Authentic Tourism'.`,
                  },
                  {
                    year: "2024",
                    title: "Today & Beyond",
                    description: `Serving ${
                      loading ? "..." : stats.happyTravelers
                    } travelers with ${
                      loading ? "..." : stats.localGuides
                    } verified guides across ${
                      loading ? "..." : stats.cities
                    } cities worldwide. Continuously innovating to make travel more meaningful.`,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded font-semibold text-sm mr-4 flex-shrink-0">
                      {item.year}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Growth Stats Section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Our Growth Milestones
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dynamicStats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-3 bg-white/70 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-blue-600">
                        {loading ? "..." : stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "values" && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                Our Core Values
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all duration-300"
                  >
                    <div
                      className={`inline-flex p-3 rounded-lg mb-4 ${value.color}`}
                    >
                      <value.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>

              {/* Trust Badge with Dynamic Rating */}
              <div className="mt-12 p-6 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl text-center">
                <div className="inline-flex items-center justify-center p-4 bg-white rounded-full mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Trusted by Travelers Worldwide
                </h3>
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-lg font-bold text-gray-900">
                    {loading ? "..." : `${stats.fiveStarReviews}%`}
                  </span>
                </div>
                <p className="text-gray-600">
                  Based on reviews from {loading ? "..." : stats.happyTravelers}{" "}
                  happy travelers
                </p>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                Meet Our Leadership
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {member.name.charAt(0)}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                ))}
              </div>

              {/* Team Stats */}
              <div className="mt-12 p-6 bg-blue-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Driving Our Success
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dynamicStats.map((stat, index) => (
                    <div key={index} className="text-center p-3">
                      <div className="text-2xl font-bold text-blue-700">
                        {loading ? "..." : stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section - Updated with dynamic stats */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 py-12 sm:py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-6">
            <Compass className="w-12 h-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Be part of the {loading ? "..." : stats.happyTravelers} travelers
            who've discovered authentic local experiences with our{" "}
            {loading ? "..." : stats.localGuides} verified guides
          </p>

          {/* Mini Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.cities}
              </div>
              <div className="text-sm text-blue-200">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {loading ? "..." : `${stats.fiveStarReviews}%`}
              </div>
              <div className="text-sm text-blue-200">Satisfaction Rate</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/explore"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
            >
              <Compass className="w-5 h-5 mr-2" />
              Browse Experiences
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Become a Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
