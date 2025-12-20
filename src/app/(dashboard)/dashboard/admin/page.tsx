"use client";

import { useState, useEffect } from "react";
import {
  getAdminDashboardStats,
  getChartData,
} from "@/services/meta/meta.service";
import AdminDashboardClient from "@/components/modules/Admin/AdminDashboardClient";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [chartData, setChartData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both in parallel
        const [statsData, chartData] = await Promise.all([
          getAdminDashboardStats(),
          getChartData(),
        ]);

        setStats(statsData);
        setChartData(chartData);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 text-red-600">⚠️</div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "Failed to load dashboard data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const bookingChartData =
    chartData?.barChartData?.map((item: any) => ({
      month: item.month.split("-")[1],
      count: item.count,
    })) || [];

  const categoryChartData =
    chartData?.pieChartData?.listingCategories?.map((item: any) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const userRoleData =
    chartData?.pieChartData?.userRoles?.map((item: any) => ({
      name: item._id,
      value: item.count,
    })) || [];

  return (
    <AdminDashboardClient
      stats={stats}
      bookingChartData={bookingChartData}
      categoryChartData={categoryChartData}
      userRoleData={userRoleData}
      hasChartData={!!chartData}
    />
  );
}
