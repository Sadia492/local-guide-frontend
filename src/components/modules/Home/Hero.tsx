"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Globe,
  Users,
  Star,
  ChevronRight,
  Play,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Hero() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [pulse, setPulse] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "Authentic Local Experiences",
      color: "text-yellow-300",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      text: "500+ Cities Worldwide",
      color: "text-green-300",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Verified Local Guides",
      color: "text-blue-300",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Secure Booking",
      color: "text-purple-300",
    },
  ];

  // Auto-rotate features - Only start after component mounts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Pulse animation for CTA
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleBecomeGuide = () => {
    // Animation feedback
    const button = document.querySelector("#become-guide-btn");
    if (button) {
      button.classList.add("scale-95");
      setTimeout(() => {
        button.classList.remove("scale-95");
      }, 150);
    }
  };

  const handlePrimaryButtonClick = () => {
    // Add ripple effect
    const button = document.querySelector("#primary-cta-btn");
    if (button) {
      const ripple = document.createElement("div");
      ripple.className =
        "absolute inset-0 bg-white/30 rounded-full scale-0 animate-ripple";
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 bg-yellow-300 rounded-full opacity-30"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-6 h-6 bg-blue-300 rounded-full opacity-20"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-1/4 w-3 h-3 bg-green-300 rounded-full opacity-40"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title with Staggered Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Explore{" "}
              <motion.span
                className="inline-block text-yellow-300"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Cities
              </motion.span>{" "}
              Like a{" "}
              <span className="relative">
                Local
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                  animate={{ width: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
            </h1>
          </motion.div>

          {/* Subtitle with Fade In */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl mb-12 text-blue-100"
          >
            Connect with passionate local guides for authentic, personalized
            experiences that go beyond the tourist trail
          </motion.p>

          {/* Animated Features */}
          <motion.div
            ref={featuresRef}
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20",
                  currentFeature === index && "bg-white/20"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={currentFeature === index ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5 }}
                  className={feature.color}
                >
                  {feature.icon}
                </motion.div>
                <span className="text-sm md:text-base">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              {
                label: "Happy Travelers",
                value: "50K+",
                icon: <Users className="w-4 h-4" />,
              },
              {
                label: "Local Guides",
                value: "2K+",
                icon: <Star className="w-4 h-4" />,
              },
              {
                label: "Cities",
                value: "500+",
                icon: <Globe className="w-4 h-4" />,
              },
              {
                label: "5 Star Reviews",
                value: "98%",
                icon: <Sparkles className="w-4 h-4" />,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {stat.icon}
                  <div className="text-2xl md:text-3xl font-bold">
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs with Enhanced Feedback */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              animate={{
                scale: pulse ? [1, 1.05, 1] : 1,
                boxShadow: pulse
                  ? [
                      "0 0 0 0 rgba(59, 130, 246, 0)",
                      "0 0 0 10px rgba(59, 130, 246, 0.3)",
                      "0 0 0 0 rgba(59, 130, 246, 0)",
                    ]
                  : "none",
              }}
              transition={{
                scale: { duration: 0.3 },
                boxShadow: { duration: 1 },
              }}
            >
              <Link href="/explore" className="block">
                <Button
                  id="primary-cta-btn"
                  variant="primary"
                  size="lg"
                  className="relative overflow-hidden group w-full"
                  onClick={handlePrimaryButtonClick}
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative flex items-center justify-center">
                    Find Your Guide
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="ml-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </span>
                </Button>
              </Link>
            </motion.div>

            <Link href="/become-guide" className="block">
              <motion.button
                type="button"
                id="become-guide-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBecomeGuide}
                className="bg-white hover:bg-gray-50 border-2 border-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg relative group overflow-hidden w-full sm:w-auto"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative flex items-center">
                  <Play className="w-4 h-4 mr-2" />
                  Become a Guide
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <motion.path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            initial={{ pathLength: 0, opacity: 0.5 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s linear;
        }
      `}</style>
    </section>
  );
}
