// components/stats-display.tsx
"use client";

import { Users, Star, Globe, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroStats {
  happyTravelers: string; // "50K+"
  localGuides: string; // "2K+"
  cities: string; // "500+"
  fiveStarReviews: number; // 98
}

interface StatsDisplayProps {
  stats: HeroStats;
  loading?: boolean;
  className?: string;
}

export function StatsDisplay({
  stats,
  loading = false,
  className,
}: StatsDisplayProps) {
  const statsData = [
    {
      label: "Happy Travelers",
      value: stats.happyTravelers,
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "Local Guides",
      value: stats.localGuides,
      icon: <Star className="w-4 h-4" />,
    },
    {
      label: "Cities",
      value: stats.cities,
      icon: <Globe className="w-4 h-4" />,
    },
    {
      label: "5 Star Reviews",
      value: `${stats.fiveStarReviews}%`,
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  if (loading) {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <div className="animate-pulse">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-4 h-4 bg-white/20 rounded"></div>
                <div className="h-8 w-16 bg-white/20 rounded"></div>
              </div>
              <div className="h-4 w-20 mx-auto bg-white/20 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {statsData.map((stat, index) => (
        <motion.div
          key={index}
          className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 * index }}
          whileHover={{
            y: -5,
            backgroundColor: "rgba(255,255,255,0.1)",
            transition: { duration: 0.2 },
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {stat.icon}
            <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
          </div>
          <div className="text-sm text-blue-200">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
