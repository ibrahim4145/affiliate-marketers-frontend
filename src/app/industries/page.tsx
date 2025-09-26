"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Industry } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function IndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [formData, setFormData] = useState({
    industry_name: "",
    description: ""
  });
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchIndustries();
    }
  }, [isAuthenticated]);

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getIndustries();
      setIndustries(data);
    } catch (err) {
      setError("Failed to fetch industries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIndustry) {
        await apiClient.updateIndustry(editingIndustry.id, formData);
      } else {
        await apiClient.createIndustry(formData);
      }
      await fetchIndustries();
      setShowForm(false);
      setEditingIndustry(null);
      setFormData({ industry_name: "", description: "" });
    } catch (err) {
      setError("Failed to save industry");
      console.error(err);
    }
  };

  const handleEdit = (industry: Industry) => {
    setEditingIndustry(industry);
    setFormData({
      industry_name: industry.industry_name,
      description: industry.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this industry?")) {
      try {
        await apiClient.deleteIndustry(id);
        await fetchIndustries();
      } catch (err) {
        setError("Failed to delete industry");
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Industries</h1>
            <p className="text-gray-600">Manage your industry categories</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingIndustry(null);
              setFormData({ industry_name: "", description: "" });
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Industry
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {showForm && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingIndustry ? "Edit Industry" : "Add New Industry"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry Name
                </label>
                <input
                  type="text"
                  value={formData.industry_name}
                  onChange={(e) => setFormData({ ...formData, industry_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingIndustry ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingIndustry(null);
                    setFormData({ industry_name: "", description: "" });
                  }}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading industries...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {industries.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No industries found. Create your first industry!</p>
              </Card>
            ) : (
              industries.map((industry) => (
                <Card key={industry.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {industry.industry_name}
                      </h3>
                      {industry.description && (
                        <p className="text-gray-600 text-sm mb-2">{industry.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Created: {new Date(industry.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Updated: {new Date(industry.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(industry)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-sm"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(industry.id)}
                        className="bg-red-500 hover:bg-red-600 text-sm"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}