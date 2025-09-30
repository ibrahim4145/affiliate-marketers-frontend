"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Industry, Query } from "@/lib/api";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Dashboard() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
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
      const [industriesData, queriesData] = await Promise.all([
        apiClient.getIndustries(),
        apiClient.getQueries()
      ]);
      setIndustries(industriesData);
      setQueries(queriesData);
    } catch (error) {
      setError("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Industries",
      value: industries.length.toString(),
      change: "Manage your categories",
      icon: "industries",
      color: "bg-slate-500"
    },
    {
      title: "Active Queries",
      value: queries.length.toString(),
      change: "Search queries configured",
      icon: "search",
      color: "bg-green-500"
    },
    {
      title: "Leads Generated",
      value: "1,234",
      change: "+156 this week",
      icon: "users",
      color: "bg-purple-500"
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1% this week",
      icon: "lightning",
      color: "bg-orange-500"
    }
  ];

  const recentActivity = [
    { action: "New industry added", target: "Healthcare", time: "2 hours ago", type: "success" },
    { action: "Query completed", target: "AI startups", time: "4 hours ago", type: "info" },
    { action: "Lead generated", target: "TechCorp Inc", time: "6 hours ago", type: "success" },
    { action: "Industry updated", target: "Finance", time: "1 day ago", type: "info" }
  ];

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }
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
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
              >
                <Icon name="edit" className="mr-2" />
                Export Data
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Icon name="plus" className="mr-2" />
                Add New
              </Button>
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

        {/* Main Content Grid */}
        <div className="flex-1 px-4 pb-4 min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-slate-200/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 text-xs">View All</Button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-emerald-500' : 'bg-slate-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.target}</p>
                    </div>
                    <div className="text-xs text-slate-400">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-slate-200/50 p-4">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-white/50 hover:bg-slate-50 border-slate-300 text-slate-700 text-xs">
                  <Icon name="industries" className="mr-2" size="sm" />
                  Manage Industries
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-white/50 hover:bg-slate-50 border-slate-300 text-slate-700 text-xs">
                  <Icon name="search" className="mr-2" size="sm" />
                  Run New Query
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-white/50 hover:bg-slate-50 border-slate-300 text-slate-700 text-xs">
                  <Icon name="users" className="mr-2" size="sm" />
                  View Leads
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-white/50 hover:bg-slate-50 border-slate-300 text-slate-700 text-xs">
                  <Icon name="edit" className="mr-2" size="sm" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>

        {/* Performance Overview */}
        <div className="mt-4 bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-slate-200/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Performance Overview</h3>
            <div className="flex space-x-2">
              <Badge variant="success" size="sm">Active</Badge>
              <Badge variant="info" size="sm">Optimized</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-slate-700">98.5%</div>
              <div className="text-xs text-slate-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-slate-700">2.3s</div>
              <div className="text-xs text-slate-600">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-slate-700">1,247</div>
              <div className="text-xs text-slate-600">Total Requests</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
