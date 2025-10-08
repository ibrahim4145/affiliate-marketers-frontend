"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Niche, Category } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import TableHeader from "@/components/tables/TableHeader";
import MobileCard from "@/components/tables/MobileCard";

export default function NichesPage() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingNiche, setEditingNiche] = useState<Niche | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    niche_name: "",
    description: "",
    category_id: ""
  });
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNiches();
      fetchCategories();
    }
  }, [isAuthenticated]);

  const fetchNiches = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getNiches();
      setNiches(data);
    } catch (err) {
      setError("Failed to fetch niches");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNiche) {
        await apiClient.updateNiche(editingNiche.id, formData);
      } else {
        await apiClient.createNiche(formData);
      }
      await fetchNiches();
      setShowForm(false);
      setEditingNiche(null);
      setFormData({ niche_name: "", description: "", category_id: "" });
    } catch (err) {
      setError("Failed to save niche");
      console.error(err);
    }
  };

  const handleEdit = (niche: Niche) => {
    setEditingNiche(niche);
    setFormData({
      niche_name: niche.niche_name,
      description: niche.description || "",
      category_id: niche.category_id
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this niche?")) {
      try {
        await apiClient.deleteNiche(id);
        await fetchNiches();
      } catch (err) {
        setError("Failed to delete niche");
        console.error(err);
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.category_name : "Unknown Category";
  };

  const filteredNiches = niches.filter(niche =>
    niche.niche_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (niche.description && niche.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    getCategoryName(niche.category_id).toLowerCase().includes(searchTerm.toLowerCase())
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

  // Do not return early here; allow DashboardLayout's ProtectedRoute to handle redirect

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Niches
              </h1>
              <p className="text-slate-600 mt-1 text-sm">Manage your niche categories</p>
            </div>
            <div className="flex space-x-3">
              <Button
                size="sm"
                onClick={() => {
                  setShowForm(true);
                  setEditingNiche(null);
                  setFormData({ niche_name: "", description: "", category_id: "" });
                }}
                className="bg-slate-700 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Icon name="plus" className="mr-2" />
                Add Niche
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search niches by name, description, or category..."
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">{niches.length}</div>
                <div className="text-slate-600 font-medium text-sm">Total Niches</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {categories.length}
                </div>
                <div className="text-slate-600 font-medium text-sm">Categories</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {niches.filter(n => n.description).length}
                </div>
                <div className="text-slate-600 font-medium text-sm">With Description</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {filteredNiches.length}
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
                {editingNiche ? "Edit Niche" : "Add New Niche"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niche Name
                  </label>
                  <input
                    type="text"
                    value={formData.niche_name}
                    onChange={(e) => setFormData({ ...formData, niche_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="e.g., 'Weight Loss'"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
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
                    placeholder="Optional description of what this niche is for"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-slate-700 hover:bg-slate-800">
                    {editingNiche ? "Update" : "Create"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingNiche(null);
                      setFormData({ niche_name: "", description: "", category_id: "" });
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
                  <TableHeader headers={["Niche", "Category", "Description", "Created", "Updated", "Actions"]} />
                  <tbody className="divide-y divide-slate-100">
                    {filteredNiches.map((niche) => (
                      <tr key={niche.id} className="hover:bg-slate-50 transition-all duration-300 group">
                        <td className="px-4 py-3 min-w-[200px]">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">
                              <Icon name="industries" className="text-slate-600" size="sm" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate">{niche.niche_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 min-w-[150px]">
                          <Badge variant="default" className="text-xs">
                            {getCategoryName(niche.category_id)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 min-w-[200px]">
                          <div className="text-sm text-slate-600 truncate">
                            {niche.description || "No description"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 min-w-[100px]">
                          {new Date(niche.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 min-w-[100px]">
                          {new Date(niche.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(niche)}
                              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 p-1"
                            >
                              <Icon name="edit" size="sm" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(niche.id)}
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
            {filteredNiches.map((niche) => (
              <MobileCard
                key={niche.id}
                data={{
                  name: niche.niche_name,
                  company: getCategoryName(niche.category_id),
                  title: niche.description || "No description",
                  email: "",
                  phone: "",
                  status: "",
                  industry: "",
                  source: "",
                  lastContact: `Created: ${new Date(niche.created_at).toLocaleDateString()}`
                }}
                actions={
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(niche)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(niche.id)}>
                      Delete
                    </Button>
                  </div>
                }
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredNiches.length === 0 && (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="industries" className="text-gray-400" size="lg" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No niches found" : "No niches yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Start by creating your first niche category."
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditingNiche(null);
                    setFormData({ niche_name: "", description: "", category_id: "" });
                  }}
                  className="bg-slate-700 hover:bg-slate-800"
                >
                  <Icon name="plus" className="mr-2" />
                  Create Your First Niche
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
