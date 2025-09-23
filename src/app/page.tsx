"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Home() {
  const stats = [
    {
      title: "Total Industries",
      value: "12",
      change: "+2 this week",
      icon: "industries",
      color: "bg-blue-500"
    },
    {
      title: "Active Queries",
      value: "48",
      change: "+12 this week",
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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your scraper.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Icon name="edit" className="mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <Icon name="plus" className="mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <Icon name={stat.icon} className="text-white" size="lg" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.target}</p>
                </div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Icon name="industries" className="mr-3" />
              Manage Industries
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="search" className="mr-3" />
              Run New Query
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="users" className="mr-3" />
              View Leads
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="edit" className="mr-3" />
              Export Data
            </Button>
          </div>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
          <div className="flex space-x-2">
            <Badge variant="success">Active</Badge>
            <Badge variant="info">Optimized</Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">98.5%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">2.3s</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">1,247</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
        </div>
      </Card>
    </div>
    </DashboardLayout>
  );
}
