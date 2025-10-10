"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Niche, Category, Query } from "@/lib/api";
import { fetchLeadsStats, fetchEmailStats, LeadsStats, EmailStats } from "@/lib/leadsApi";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Dashboard() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [leadsStats, setLeadsStats] = useState<LeadsStats | null>(null);
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null);
  const [, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [nichesData, categoriesData, queriesData, leadsStatsData, emailStatsData] = await Promise.all([
        apiClient.getNiches(),
        apiClient.getCategories(),
        apiClient.getQueries(),
        fetchLeadsStats(true), // Get stats for visible leads only
        fetchEmailStats(true) // Get email stats for visible leads only
      ]);
      setNiches(nichesData);
      setCategories(categoriesData);
      setQueries(queriesData);
      setLeadsStats(leadsStatsData);
      setEmailStats(emailStatsData);
    } catch (error) {
      setError("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Categories",
      value: categories.length.toString(),
      change: "Manage your categories",
      icon: "industries",
      color: "bg-slate-500"
    },
    {
      title: "Total Niches",
      value: niches.length.toString(),
      change: "Manage your niches",
      icon: "industries",
      color: "bg-blue-500"
    },
    {
      title: "Visible Leads",
      value: leadsStats?.total_leads?.toString() || "0",
      change: "Active leads count",
      icon: "users",
      color: "bg-purple-500"
    },
    {
      title: "Success Rate",
      value: emailStats && leadsStats ? 
        `${((emailStats.leads_with_emails / leadsStats.total_leads) * 100).toFixed(1)}%` : 
        "0%",
      change: "Leads with emails",
      icon: "lightning",
      color: "bg-orange-500"
    }
  ];

  // const recentActivity = [
  //   { action: "New industry added", target: "Healthcare", time: "2 hours ago", type: "success" },
  //   { action: "Query completed", target: "AI startups", time: "4 hours ago", type: "info" },
  //   { action: "Lead generated", target: "TechCorp Inc", time: "6 hours ago", type: "success" },
  //   { action: "Industry updated", target: "Finance", time: "1 day ago", type: "info" }
  // ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Do not return early here; allow DashboardLayout's ProtectedRoute to handle redirect
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-4 flex-shrink-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1 text-sm">Welcome back! Here&apos;s what&apos;s happening with your scraper.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="p-4 pb-3 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">{stat.change}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                    <Icon name={stat.icon} className="text-slate-700" size="lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
