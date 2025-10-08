"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import TableHeader from "@/components/tables/TableHeader";
import MobileCard from "@/components/tables/MobileCard";
import { apiClient, Query, SubQueryBase, SubQueryWithParent } from "@/lib/api";

// Types now come from api client

export default function SubQueriesPage() {
  const [subQueries, setSubQueries] = useState<SubQueryWithParent[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSubQuery, setEditingSubQuery] = useState<SubQueryWithParent | null>(null);
  const [formData, setFormData] = useState({
    query_id: "",
    sub_query: "",
    added_by: "",
    description: "",
  });

  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchQueries();
      fetchSubQueries();
    }
  }, [isAuthenticated]);

  // Fetch queries for dropdown
  const fetchQueries = async () => {
    try {
      const data = await apiClient.getQueries();
      setQueries(data);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  // Fetch sub queries with query info
  const fetchSubQueries = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSubQueriesWithQueryInfo();
      setSubQueries(data);
    } catch (error) {
      setError("Failed to fetch sub queries");
      console.error("Error fetching sub queries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubQuery) {
        await apiClient.updateSubQuery(editingSubQuery.id, formData as any);
      } else {
        await apiClient.createSubQuery(formData as any);
      }
      setShowForm(false);
      setEditingSubQuery(null);
      setFormData({ query_id: "", sub_query: "", added_by: "", description: "" });
      fetchSubQueries();
    } catch (error: any) {
      console.error("Error saving sub query:", error);
      setError(error?.message || "Error saving sub query");
    }
  };

  const handleEdit = (subQuery: SubQueryWithParent) => {
    setEditingSubQuery(subQuery);
    setFormData({
      query_id: subQuery.query_id,
      sub_query: subQuery.sub_query,
      added_by: subQuery.added_by,
      description: subQuery.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sub query?")) return;

    try {
      await apiClient.deleteSubQuery(id);
      fetchSubQueries();
    } catch (error) {
      console.error("Error deleting sub query:", error);
      setError("Error deleting sub query");
    }
  };

  const filteredSubQueries = subQueries.filter(
    (sq) =>
      sq.sub_query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sq.added_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sq.parent_query?.query.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Do not return early here; allow DashboardLayout's ProtectedRoute to handle redirect

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Sub Queries
              </h1>
              <p className="text-slate-600 mt-1 text-sm">Manage your sub queries</p>
            </div>
            <div className="flex space-x-3">
              <Button
                size="sm"
                onClick={() => {
                  setShowForm(true);
                  setEditingSubQuery(null);
                  setFormData({ query_id: "", sub_query: "", added_by: "", description: "" });
                }}
                className="bg-slate-700 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Icon name="plus" className="mr-2" />
                Add Sub Query
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search sub queries by name, added by, or parent query..."
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
                <div className="text-2xl font-bold text-slate-900 mb-1">{subQueries.length}</div>
                <div className="text-slate-600 font-medium text-sm">Total Sub Queries</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {subQueries.filter(sq => sq.description).length}
                </div>
                <div className="text-slate-600 font-medium text-sm">With Description</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {filteredSubQueries.length}
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
                {editingSubQuery ? "Edit Sub Query" : "Add New Sub Query"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Parent Query *
                  </label>
                  <select
                    value={formData.query_id}
                    onChange={(e) => setFormData({ ...formData, query_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a query</option>
                    {queries.map((query) => (
                      <option key={query.id} value={query.id}>
                        {query.query}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Sub Query *
                  </label>
                  <input
                    type="text"
                    value={formData.sub_query}
                    onChange={(e) => setFormData({ ...formData, sub_query: e.target.value })}
                    placeholder="Enter sub query"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Added By *
                  </label>
                  <input
                    type="text"
                    value={formData.added_by}
                    onChange={(e) => setFormData({ ...formData, added_by: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSubQuery(null);
                      setFormData({ query_id: "", sub_query: "", added_by: "", description: "" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSubQuery ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-slate-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <TableHeader headers={["Sub Query", "Parent Query", "Added By", "Description", "Created", "Actions"]} />
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubQueries.map((subQuery) => (
                      <tr key={subQuery.id} className="hover:bg-slate-50 transition-all duration-300 group">
                        <td className="px-4 py-3 min-w-[200px]">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">
                              <Icon name="search" className="text-slate-600" size="sm" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate">{subQuery.sub_query}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 min-w-[200px]">
                          <div className="text-sm text-slate-600 truncate">
                            {subQuery.parent_query?.query || "Unknown Query"}
                          </div>
                        </td>
                        <td className="px-4 py-3 min-w-[120px]">
                          <div className="text-sm text-slate-600">
                            {subQuery.added_by}
                          </div>
                        </td>
                        <td className="px-4 py-3 min-w-[200px]">
                          <div className="text-sm text-slate-600 truncate">
                            {subQuery.description || "No description"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 min-w-[100px]">
                          {new Date(subQuery.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(subQuery)}
                              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 p-1"
                            >
                              <Icon name="edit" size="sm" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(subQuery.id)}
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
            {filteredSubQueries.map((subQuery) => (
              <MobileCard
                key={subQuery.id}
                data={{
                  name: `"${subQuery.sub_query}"`,
                  company: subQuery.parent_query?.query || "Unknown Query",
                  title: `Added by: ${subQuery.added_by}`,
                  email: "",
                  phone: "",
                  status: "",
                  industry: subQuery.description || "No description",
                  source: "",
                  lastContact: `Created: ${new Date(subQuery.created_at).toLocaleDateString()}`
                }}
                actions={
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(subQuery)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(subQuery.id)}>
                      Delete
                    </Button>
                  </div>
                }
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredSubQueries.length === 0 && (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="search" className="text-gray-400" size="lg" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No sub queries found" : "No sub queries yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Get started by creating your first sub query."}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditingSubQuery(null);
                    setFormData({ query_id: "", sub_query: "", added_by: "", description: "" });
                  }}
                  className="bg-slate-700 hover:bg-slate-800 text-white"
                >
                  <Icon name="plus" className="mr-2" />
                  Add Sub Query
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
