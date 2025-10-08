"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Query } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import TableHeader from "@/components/tables/TableHeader";
import MobileCard from "@/components/tables/MobileCard";

export default function QueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingQuery, setEditingQuery] = useState<Query | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    query: "",
    description: ""
  });
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchQueries();
    }
  }, [isAuthenticated]);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getQueries();
      setQueries(data);
    } catch (err) {
      setError("Failed to fetch queries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuery) {
        await apiClient.updateQuery(editingQuery.id, formData);
      } else {
        await apiClient.createQuery(formData);
      }
      await fetchQueries();
      setShowForm(false);
      setEditingQuery(null);
      setFormData({ query: "", description: "" });
    } catch (err) {
      setError("Failed to save query");
      console.error(err);
    }
  };

  const handleEdit = (query: Query) => {
    setEditingQuery(query);
    setFormData({
      query: query.query,
      description: query.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this query?")) {
      try {
        await apiClient.deleteQuery(id);
        await fetchQueries();
      } catch (err) {
        setError("Failed to delete query");
        console.error(err);
      }
    }
  };

  const filteredQueries = queries.filter(query =>
    query.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (query.description && query.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    return null; // Redirect handled by ProtectedRoute
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Queries
              </h1>
              <p className="text-slate-600 mt-1 text-sm">Manage your search queries</p>
            </div>
            <div className="flex space-x-3">
              <Button
                size="sm"
                onClick={() => {
                  setShowForm(true);
                  setEditingQuery(null);
                  setFormData({ query: "", description: "" });
                }}
                className="bg-slate-700 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Icon name="plus" className="mr-2" />
                Add Query
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search queries by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-300 text-sm"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="p-4 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">{queries.length}</div>
                <div className="text-slate-600 font-medium text-sm">Total Queries</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {queries.filter(q => q.description).length}
                </div>
                <div className="text-slate-600 font-medium text-sm">With Description</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {filteredQueries.length}
                </div>
                <div className="text-slate-600 font-medium text-sm">Filtered Results</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                {editingQuery ? "Edit Query" : "Add New Query"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Query
                  </label>
                  <input
                    type="text"
                    value={formData.query}
                    onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder='e.g., "inurl:"affiliate-disclosure""'
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    rows={3}
                    placeholder="Optional description of what this query is for"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-slate-700 hover:bg-slate-800">
                    {editingQuery ? "Update" : "Create"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingQuery(null);
                      setFormData({ query: "", description: "" });
                    }}
                    className="bg-gray-500 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Content Area */}
        <div className="px-4 pb-4">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-slate-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <TableHeader headers={["Query", "Description", "Created", "Updated", "Actions"]} />
                  <tbody className="divide-y divide-slate-100">
                    {filteredQueries.map((query) => (
                      <tr key={query.id} className="hover:bg-slate-50 transition-all duration-300 group">
                        <td className="px-4 py-3 min-w-[200px]">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">
                              <Icon name="search" className="text-slate-600" size="sm" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate">{query.query}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 min-w-[200px]">
                          <div className="text-sm text-slate-600 truncate">
                            {query.description || "No description"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 min-w-[100px]">
                          {new Date(query.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 min-w-[100px]">
                          {new Date(query.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(query)}
                              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 p-1"
                            >
                              <Icon name="edit" size="sm" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(query.id)}
                              className="text-slate-600 hover:text-red-600 hover:bg-red-100 transition-all duration-300 p-1"
                            >
                              <Icon name="delete" size="sm" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredQueries.map((query) => (
              <MobileCard
                key={query.id}
                data={{
                  name: `"${query.query}"`,
                  company: query.description || "No description",
                  title: "",
                  email: "",
                  phone: "",
                  status: "",
                  industry: "",
                  source: "",
                  lastContact: `Created: ${new Date(query.created_at).toLocaleDateString()}`
                }}
                actions={
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(query)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(query.id)}>
                      Delete
                    </Button>
                  </div>
                }
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredQueries.length === 0 && (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="search" className="text-gray-400" size="lg" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No queries found" : "No queries yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Start by creating your first search query."
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditingQuery(null);
                    setFormData({ query: "", description: "" });
                  }}
                  className="bg-slate-700 hover:bg-slate-800"
                >
                  <Icon name="plus" className="mr-2" />
                  Create Your First Query
                </Button>
              )}
            </Card>
          )}

          {/* Bottom Spacing */}
          <div className="h-8"></div>
        </div>
      </div>
    </DashboardLayout>
  );
}