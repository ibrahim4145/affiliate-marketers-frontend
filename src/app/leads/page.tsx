"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import TableHeader from "@/components/tables/TableHeader";
import MobileCard from "@/components/tables/MobileCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function LeadsPage() {
  const [leads, setLeads] = useState([
    {
      id: 1,
      domain: "techcorp.com",
      owner: "Sarah Johnson",
      company: "TechCorp Inc",
      title: "CTO",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "new",
      industry: "Technology",
      source: "LinkedIn",
      lastContact: "Never"
    },
    {
      id: 2,
      domain: "financeplus.com",
      owner: "Michael Chen",
      company: "Finance Plus",
      title: "CEO",
      email: "michael@financeplus.com",
      phone: "+1 (555) 234-5678",
      status: "contacted",
      industry: "Finance",
      source: "Website",
      lastContact: "2 days ago"
    },
    {
      id: 3,
      domain: "healthtech.io",
      owner: "Dr. Emily Rodriguez",
      company: "HealthTech Solutions",
      title: "Founder",
      email: "emily@healthtech.io",
      phone: "+1 (555) 345-6789",
      status: "qualified",
      industry: "Healthcare",
      source: "Referral",
      lastContact: "1 week ago"
    },
    {
      id: 4,
      domain: "edulab.com",
      owner: "David Kim",
      company: "EduLab",
      title: "VP of Product",
      email: "david@edulab.com",
      phone: "+1 (555) 456-7890",
      status: "new",
      industry: "Education",
      source: "Google Search",
      lastContact: "Never"
    }
  ]);

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
      case "new": return "info";
      case "contacted": return "warning";
      case "qualified": return "success";
      case "converted": return "success";
      default: return "default";
    }
  };

  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case "Technology": return "bg-blue-100 text-blue-800";
      case "Finance": return "bg-green-100 text-green-800";
      case "Healthcare": return "bg-red-100 text-red-800";
      case "Education": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600 mt-1">Manage and track your potential customers</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Icon name="edit" className="mr-2" />
              Export Leads
            </Button>
            <Button size="sm">
              <Icon name="plus" className="mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search leads by company, name, or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            {["all", "new", "contacted", "qualified"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{leads.length}</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {leads.filter(l => l.status === "qualified").length}
            </div>
            <div className="text-sm text-gray-600">Qualified</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {leads.filter(l => l.status === "contacted").length}
            </div>
            <div className="text-sm text-gray-600">Contacted</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {leads.filter(l => l.status === "new").length}
            </div>
            <div className="text-sm text-gray-600">New</div>
          </div>
        </Card>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <TableHeader headers={["Lead", "Company", "Contact", "Status", "Industry", "Source", "Last Contact", "Actions"]} />
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                          <Icon name="users" className="text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{lead.owner}</div>
                          <div className="text-sm text-gray-500 truncate">{lead.domain}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[180px]">
                      <div className="font-medium text-gray-900 truncate">{lead.company}</div>
                      <div className="text-sm text-gray-500 truncate">{lead.title}</div>
                    </td>
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="text-sm text-gray-900 truncate">{lead.email}</div>
                      <div className="text-sm text-gray-500 truncate">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(lead.status) as any}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIndustryColor(lead.industry)}`}>
                        {lead.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 min-w-[100px]">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 min-w-[120px]">
                      {lead.lastContact}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Icon name="edit" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Icon name="delete" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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
      </div>
    </DashboardLayout>
  );
}
