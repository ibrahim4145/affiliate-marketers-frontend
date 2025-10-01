"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import TableHeader from "@/components/tables/TableHeader";
import MobileCard from "@/components/tables/MobileCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchLeadsWithContacts, fetchLeadsStats, LeadWithContacts, LeadsStats } from "@/lib/leadsApi";

interface LeadsClientProps {
  leads?: LeadWithContacts[];
}

export default function LeadsClient({ leads: initialLeads }: LeadsClientProps) {
  const [leads, setLeads] = useState<LeadWithContacts[]>(initialLeads || []);
  const [stats, setStats] = useState<LeadsStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data on component mount if not provided
  useEffect(() => {
    if (!initialLeads && typeof window !== 'undefined') {
      const loadData = async () => {
        try {
          setLoading(true);
          setError(null);
          const [leadsData, statsData] = await Promise.all([
            fetchLeadsWithContacts(),
            fetchLeadsStats()
          ]);
          setLeads(leadsData);
          setStats(statsData);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load leads');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [initialLeads]);

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === "all" || 
                         (filter === "scraped" && lead.scraped) ||
                         (filter === "google_done" && lead.google_done) ||
                         (filter === "new" && !lead.scraped && !lead.google_done);
    
    const matchesSearch = lead.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.emails.some(email => email.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         lead.phones.some(phone => phone.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         lead.socials.some(social => social.handle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (lead: LeadWithContacts) => {
    if (lead.google_done) return "success";
    if (lead.scraped) return "info";
    return "warning";
  };

  const getStatusText = (lead: LeadWithContacts) => {
    if (lead.google_done) return "Complete";
    if (lead.scraped) return "Scraped";
    return "New";
  };

  const getContactCounts = (lead: LeadWithContacts) => {
    return {
      emails: lead.emails.length,
      phones: lead.phones.length,
      socials: lead.socials.length
    };
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading leads...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="alert-circle" className="text-red-600" size="lg" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Leads</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              {["all", "new", "scraped", "google_done"].map((status) => (
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
                  {status === "google_done" ? "Complete" : status.charAt(0).toUpperCase() + status.slice(1)}
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
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stats?.total_leads || leads.length}
                </div>
                <div className="text-slate-600 font-medium text-sm">Total Leads</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stats?.scraped_leads || leads.filter(l => l.scraped).length}
                </div>
                <div className="text-slate-600 font-medium text-sm">Scraped</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stats?.google_done_leads || leads.filter(l => l.google_done).length}
                </div>
                <div className="text-slate-600 font-medium text-sm">Google Done</div>
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {leads.filter(l => !l.scraped && !l.google_done).length}
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
                <table className="w-full min-w-[1400px]">
                  <TableHeader headers={["Domain", "Title", "Emails", "Phones", "Social", "Status", "Progress", "Actions"]} />
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => {
                      const contactCounts = getContactCounts(lead);
                      return (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-all duration-300 group">
                          <td className="px-4 py-3 min-w-[200px]">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">
                                <Icon name="globe" className="text-slate-600" size="sm" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-semibold text-slate-900 truncate">{lead.domain}</div>
                              </div>
                            </div>
                        </td>
                        <td className="px-4 py-3 min-w-[180px]">
                            <div className="font-semibold text-slate-900 truncate text-sm">{lead.title}</div>
                            <div className="text-xs text-slate-500 truncate">ID: {lead.id.slice(-8)}</div>
                          </td>
                          <td className="px-4 py-3 min-w-[200px]">
                            {lead.emails.length > 0 ? (
                              <div className="space-y-1">
                                {lead.emails.slice(0, 2).map((email, index) => (
                                  <div key={index} className="text-xs text-slate-900 truncate font-medium">
                                    {email.email}
                                  </div>
                                ))}
                                {lead.emails.length > 2 && (
                                  <div className="text-xs text-slate-500">+{lead.emails.length - 2} more</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-400 italic">No emails</div>
                            )}
                          </td>
                          <td className="px-4 py-3 min-w-[150px]">
                            {lead.phones.length > 0 ? (
                              <div className="space-y-1">
                                {lead.phones.slice(0, 2).map((phone, index) => (
                                  <div key={index} className="text-xs text-slate-900 truncate font-medium">
                                    {phone.phone}
                                  </div>
                                ))}
                                {lead.phones.length > 2 && (
                                  <div className="text-xs text-slate-500">+{lead.phones.length - 2} more</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-400 italic">No phones</div>
                            )}
                          </td>
                          <td className="px-4 py-3 min-w-[150px]">
                            {lead.socials.length > 0 ? (
                              <div className="space-y-1">
                                {lead.socials.slice(0, 2).map((social, index) => (
                                  <div key={index} className="text-xs text-slate-900 truncate font-medium">
                                    <span className="text-slate-500">{social.platform}:</span> {social.handle}
                                  </div>
                                ))}
                                {lead.socials.length > 2 && (
                                  <div className="text-xs text-slate-500">+{lead.socials.length - 2} more</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-400 italic">No social</div>
                            )}
                        </td>
                        <td className="px-4 py-3">
                            <Badge variant={getStatusColor(lead) as "success" | "warning" | "info" | "error"} size="sm">
                              {getStatusText(lead)}
                          </Badge>
                        </td>
                          <td className="px-4 py-3 min-w-[120px]">
                            <div className="text-xs text-slate-500 space-y-1">
                              <div className="flex items-center justify-between">
                                <span>Emails:</span>
                                <span className="font-medium">{contactCounts.emails}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Phones:</span>
                                <span className="font-medium">{contactCounts.phones}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Social:</span>
                                <span className="font-medium">{contactCounts.socials}</span>
                              </div>
                            </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 p-1"
                                title="View Details"
                              >
                                <Icon name="eye" size="sm" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 p-1"
                                title="Edit Lead"
                            >
                              <Icon name="edit" size="sm" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 hover:text-red-600 hover:bg-red-100 transition-all duration-300 p-1"
                                title="Delete Lead"
                            >
                              <Icon name="delete" size="sm" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredLeads.map((lead) => {
              const contactCounts = getContactCounts(lead);
              return (
                <Card key={lead.id} className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <Icon name="globe" className="text-slate-600" size="sm" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-900 truncate">{lead.domain}</div>
                            <div className="text-sm text-slate-500 truncate">{lead.title}</div>
                          </div>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(lead) as "success" | "warning" | "info" | "error"} size="sm">
                        {getStatusText(lead)}
                      </Badge>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2">
                      {/* Emails */}
                      <div>
                        <div className="text-xs font-medium text-slate-700 mb-1">
                          Emails ({contactCounts.emails})
                        </div>
                        {lead.emails.length > 0 ? (
                          <div className="space-y-1">
                            {lead.emails.slice(0, 2).map((email, index) => (
                              <div key={index} className="text-xs text-slate-900 bg-slate-50 px-2 py-1 rounded">
                                {email.email}
                              </div>
                            ))}
                            {lead.emails.length > 2 && (
                              <div className="text-xs text-slate-500">+{lead.emails.length - 2} more</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic">No emails</div>
                        )}
                      </div>

                      {/* Phones */}
                      <div>
                        <div className="text-xs font-medium text-slate-700 mb-1">
                          Phones ({contactCounts.phones})
                        </div>
                        {lead.phones.length > 0 ? (
                          <div className="space-y-1">
                            {lead.phones.slice(0, 2).map((phone, index) => (
                              <div key={index} className="text-xs text-slate-900 bg-slate-50 px-2 py-1 rounded">
                                {phone.phone}
                              </div>
                            ))}
                            {lead.phones.length > 2 && (
                              <div className="text-xs text-slate-500">+{lead.phones.length - 2} more</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic">No phones</div>
                        )}
                      </div>

                      {/* Social */}
                      <div>
                        <div className="text-xs font-medium text-slate-700 mb-1">
                          Social ({contactCounts.socials})
                        </div>
                        {lead.socials.length > 0 ? (
                          <div className="space-y-1">
                            {lead.socials.slice(0, 2).map((social, index) => (
                              <div key={index} className="text-xs text-slate-900 bg-slate-50 px-2 py-1 rounded">
                                <span className="text-slate-500">{social.platform}:</span> {social.handle}
                              </div>
                            ))}
                            {lead.socials.length > 2 && (
                              <div className="text-xs text-slate-500">+{lead.socials.length - 2} more</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic">No social</div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2 border-t border-slate-200">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Icon name="eye" className="mr-1" size="sm" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Icon name="edit" className="mr-1" size="sm" />
                      Edit
                    </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                        <Icon name="delete" className="mr-1" size="sm" />
                      Delete
                    </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
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
