"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import TableHeader from "@/components/tables/TableHeader";
import MobileCard from "@/components/tables/MobileCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Lead {
  id: number;
  domain: string;
  owner: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  status: string;
  industry: string;
  source: string;
  lastContact: string;
}

interface LeadsClientProps {
  leads: Lead[];
}

export default function LeadsClient({ leads }: LeadsClientProps) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === "all" || lead.status === filter;
    const matchesSearch = lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.domain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "qualified": return "success";
      case "contacted": return "info";
      case "new": return "warning";
      default: return "info";
    }
  };

  const getIndustryColor = (industry: string) => {
    const colors = {
      "Technology": "bg-blue-100 text-blue-800",
      "Finance": "bg-green-100 text-green-800",
      "Healthcare": "bg-red-100 text-red-800",
      "Manufacturing": "bg-yellow-100 text-yellow-800",
      "Retail": "bg-purple-100 text-purple-800",
      "Education": "bg-indigo-100 text-indigo-800"
    };
    return colors[industry as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Leads
              </h1>
              <p className="text-slate-600 mt-1 text-sm">Manage and track your potential customers</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
              >
                <Icon name="edit" className="mr-2" />
                Export Leads
              </Button>
              <Button
                size="sm"
                className="bg-slate-700 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Icon name="plus" className="mr-2" />
                Add Lead
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search leads by company, name, or domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-300 text-sm"
              />
            </div>
            <div className="flex space-x-2">
              {["all", "new", "contacted", "qualified"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className={filter === status
                    ? "bg-slate-700 hover:bg-slate-800 text-white shadow-lg"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">{leads.length}</div>
                <div className="text-slate-600 font-medium text-sm">Total Leads</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {leads.filter(l => l.status === "qualified").length}
                </div>
                <div className="text-slate-600 font-medium text-sm">Qualified</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {leads.filter(l => l.status === "contacted").length}
                </div>
                <div className="text-slate-600 font-medium text-sm">Contacted</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {leads.filter(l => l.status === "new").length}
                </div>
                <div className="text-slate-600 font-medium text-sm">New</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 pb-4">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-slate-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <TableHeader headers={["Lead", "Company", "Contact", "Status", "Industry", "Source", "Last Contact", "Actions"]} />
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-all duration-300 group">
                        <td className="px-4 py-3 min-w-[180px]">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">
                              <Icon name="users" className="text-slate-600" size="sm" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate">{lead.owner}</div>
                              <div className="text-sm text-slate-500 truncate">{lead.domain}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 min-w-[160px]">
                          <div className="font-semibold text-slate-900 truncate text-sm">{lead.company}</div>
                          <div className="text-xs text-slate-500 truncate">{lead.title}</div>
                        </td>
                        <td className="px-4 py-3 min-w-[180px]">
                          <div className="text-xs text-slate-900 truncate font-medium">{lead.email}</div>
                          <div className="text-xs text-slate-500 truncate">{lead.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={getStatusColor(lead.status) as "success" | "warning" | "info" | "error"} size="sm">
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getIndustryColor(lead.industry)} shadow-sm`}>
                            {lead.industry}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 min-w-[80px] font-medium">
                          {lead.source}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 min-w-[100px] font-medium">
                          {lead.lastContact}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 p-1"
                            >
                              <Icon name="edit" size="sm" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
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
            {filteredLeads.map((lead) => (
              <MobileCard
                key={lead.id}
                data={{
                  name: lead.owner,
                  company: lead.company,
                  title: lead.title,
                  email: lead.email,
                  phone: lead.phone,
                  status: lead.status,
                  industry: lead.industry,
                  source: lead.source,
                  lastContact: lead.lastContact
                }}
                actions={
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Delete
                    </Button>
                  </div>
                }
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredLeads.length === 0 && (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="users" className="text-gray-400" size="lg" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No leads found" : "No leads yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms or filters."
                  : "Start by running queries to generate your first leads."
                }
              </p>
              {!searchTerm && (
                <Button>
                  <Icon name="search" className="mr-2" />
                  Run Your First Query
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
