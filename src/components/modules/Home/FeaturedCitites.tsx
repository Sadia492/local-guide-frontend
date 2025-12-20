"use client";

import React, { useState, useEffect } from "react";
import { MapPin, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function FeaturedCities() {
  type City = {
    _id: string;
    city: string;
    country: string;
    guides: number;
    image: string;
    tourData?: any;
  };

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Your target cities
  const targetCities = ["Paris", "Tokyo", "Barcelona", "New York"];

  // Static fallback data (used when API fails or during initial load)
  const fallbackCities = [
    {
      _id: "1",
      city: "Paris",
      country: "France",
      guides: 124,
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    },
    {
      _id: "2",
      city: "Tokyo",
      country: "Japan",
      guides: 98,
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    },
    {
      _id: "3",
      city: "Barcelona",
      country: "Spain",
      guides: 156,
      image:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    },
    {
      _id: "4",
      city: "New York",
      country: "USA",
      guides: 203,
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    },
  ];

  useEffect(() => {
    const fetchCitiesFromAPI = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/listing`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        // Check if the response has the expected structure
        if (!result.success || !result.data) {
          throw new Error("Invalid API response structure");
        }

        // Use the data property from the response
        const apiData = result.data;

        // Filter for only the 4 target cities and transform the data
        const filteredCities = apiData
          .filter((item: any) => targetCities.includes(item.city))
          .map((item: any) => ({
            _id: item._id,
            city: item.city,
            // Get country from your helper function
            country: getCountryFromCity(item.city),
            // Count how many tours this guide has for this city
            // Or use a default value if you don't have guide count
            guides: countToursPerCity(apiData, item.city),
            image: item.images?.[0] || getCityImage(item.city),
            // Keep the full tour data if you need it later
            tourData: item,
          }));

        console.log("Filtered cities:", filteredCities);

        // Ensure we have exactly 4 cities, use fallback for any missing
        const finalCities = targetCities.map((cityName) => {
          const apiCity = filteredCities.find((c: any) => c.city === cityName);
          if (apiCity) return apiCity;

          // Fallback if API doesn't have this city
          return (
            fallbackCities.find((c) => c.city === cityName) || {
              _id: cityName,
              city: cityName,
              country: getCountryFromCity(cityName),
              guides: Math.floor(Math.random() * 100) + 50,
              image: getCityImage(cityName),
            }
          );
        });

        console.log("Final cities to display:", finalCities);
        setCities(finalCities);
      } catch (err: any) {
        console.error("Failed to fetch cities from API:", err);
        setError(err.message);
        // Use fallback data if API fails
        setCities(fallbackCities);
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesFromAPI();
  }, []);

  // Helper function to count tours per city
  const countToursPerCity = (data: any[], cityName: string) => {
    // Count how many active tours are in this city
    const cityTours = data.filter(
      (item: any) => item.city === cityName && item.isActive !== false
    );
    return cityTours.length;
  };

  // Helper function to get country based on city
  const getCountryFromCity = (city: string) => {
    const countryMap: Record<string, string> = {
      Paris: "France",
      Tokyo: "Japan",
      Barcelona: "Spain",
      "New York": "USA",
    };
    return countryMap[city] || "Unknown";
  };

  // Helper function to get image based on city
  const getCityImage = (city: string) => {
    const imageMap: Record<string, string> = {
      Paris:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
      Tokyo:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
      Barcelona:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
      "New York":
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    };
    return (
      imageMap[city] ||
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80"
    );
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discovering amazing experiences...
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-200 rounded-2xl"></div>
                <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  console.log(cities);
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing experiences in cities around the world
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Using fallback data: {error}</span>
            </motion.div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((city: any, index) => (
            <motion.div
              key={city._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <Link
                href={`/tours/${city.tourData?._id}`}
                className="block h-full"
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src={city.image}
                    alt={`${city.city}, ${city.country}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{city.city}</h3>
                    <p className="text-blue-200 mb-2">{city.country}</p>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{city.guides} local tours available</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
