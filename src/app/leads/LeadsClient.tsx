"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import TableHeader from "@/components/tables/TableHeader";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import HighlightText from "@/components/ui/HighlightText";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchLeadsWithContacts, fetchLeadsStats, fetchNiches, LeadWithContacts, LeadsStats, LeadsResponse, PaginationInfo, Niche } from "@/lib/leadsApi";

interface LeadsClientProps {
  leads?: LeadWithContacts[];
}

export default function LeadsClient({ leads: initialLeads }: LeadsClientProps) {
  const [leads, setLeads] = useState<LeadWithContacts[]>(initialLeads || []);
  const [stats, setStats] = useState<LeadsStats | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [nicheFilter, setNicheFilter] = useState("all");
  
  // Preloading cache system
  const [preloadedData, setPreloadedData] = useState<Map<string, LeadsResponse>>(new Map());
  const [preloadingPages, setPreloadingPages] = useState<Set<number>>(new Set());

  // Load initial data - prioritize table data first
  useEffect(() => {
    if (!initialLeads && typeof window !== 'undefined') {
      // Load table data immediately
      loadLeadsData(1, searchTerm, filter, nicheFilter);
      // Load stats in background (non-blocking)
      loadStatsData();
      // Load niches for filter
      loadNiches();
    }
  }, [initialLeads, searchTerm, filter, nicheFilter]);

  // Generate cache key for preloaded data
  const getCacheKey = (page: number, search: string, filterValue: string, nicheValue: string = "all") => {
    return `${page}-${search}-${filterValue}-${nicheValue}`;
  };

  // Load leads data with smart preloading
  const loadLeadsData = async (page: number, search: string, filterValue: string, nicheValue: string = "all", isPreload: boolean = false) => {
    const cacheKey = getCacheKey(page, search, filterValue, nicheValue);
    
    // Check if data is already cached (persistent cache)
    if (preloadedData.has(cacheKey) && !isPreload) {
      const cachedData = preloadedData.get(cacheKey)!;
      setLeads(cachedData.leads);
      setPagination(cachedData.pagination);
      setCurrentPage(page);
      
      // Keep data in cache for future navigation (persistent cache)
      // Only trigger background preloading for next pages
      preloadNextPages(page, search, filterValue, nicheValue, cachedData.pagination);
      return;
    }

    try {
      if (!isPreload) {
        setTableLoading(true);
        setError(null);
      }
      
      const response = await fetchLeadsWithContacts(page, 50, search, filterValue, nicheValue);
      
      if (isPreload) {
        // Store preloaded data in cache
        setPreloadedData(prev => new Map(prev).set(cacheKey, response));
        setPreloadingPages(prev => {
          const newSet = new Set(prev);
          newSet.delete(page);
          return newSet;
        });
      } else {
        // Display current page data
        setLeads(response.leads);
        setPagination(response.pagination);
        setCurrentPage(page);
        
        // Store current page data in cache for future navigation
        setPreloadedData(prev => new Map(prev).set(cacheKey, response));
        
        // Trigger background preloading for next pages
        preloadNextPages(page, search, filterValue, nicheValue, response.pagination);
      }
    } catch (err) {
      if (!isPreload) {
        setError(err instanceof Error ? err.message : 'Failed to load leads');
      }
    } finally {
      if (!isPreload) {
        // Only hide loaders after data is set
        setTimeout(() => {
          setTableLoading(false);
          setSearchLoading(false);
          setFilterLoading(false);
        }, 100); // Small delay to ensure smooth transition
      }
    }
  };

  // Preload next 2-3 pages in background
  const preloadNextPages = (currentPage: number, search: string, filterValue: string, nicheValue: string, paginationInfo: PaginationInfo) => {
    const pagesToPreload = [];
    
    // Preload next 2 pages if they exist
    for (let i = 1; i <= 2; i++) {
      const nextPage = currentPage + i;
      if (nextPage <= paginationInfo.total_pages) {
        const cacheKey = getCacheKey(nextPage, search, filterValue, nicheValue);
        
        // Only preload if not already cached or currently preloading
        if (!preloadedData.has(cacheKey) && !preloadingPages.has(nextPage)) {
          pagesToPreload.push(nextPage);
        }
      }
    }
    
    // Start preloading
    pagesToPreload.forEach(page => {
      setPreloadingPages(prev => new Set(prev).add(page));
      loadLeadsData(page, search, filterValue, nicheValue, true);
    });
  };

  // Load stats data
  const loadStatsData = async () => {
    try {
      setLoading(true);
      const statsData = await fetchLeadsStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load niches data
  const loadNiches = async () => {
    try {
      const nichesData = await fetchNiches();
      setNiches(nichesData);
    } catch (err) {
      console.error('Failed to load niches:', err);
    }
  };

  // Handle search with debouncing
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Show loader immediately when typing (for any search)
    setSearchLoading(true);
    
    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      // Clear preloaded cache when search changes
      setPreloadedData(new Map());
      setPreloadingPages(new Set());
      setCurrentPage(1); // Reset to first page on search
      
      // Load data (loader will be hidden in loadLeadsData)
      loadLeadsData(1, value, filter, nicheFilter);
    }, 300); // 300ms debounce for faster response
    
    setSearchTimeout(timeout);
  };

  // Handle filter change
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setFilterLoading(true);
    setTableLoading(true); // Show table loader immediately
    // Clear preloaded cache when filter changes
    setPreloadedData(new Map());
    setPreloadingPages(new Set());
    setCurrentPage(1); // Reset to first page on filter change
    loadLeadsData(1, searchTerm, newFilter, nicheFilter);
  };

  // Handle niche filter change
  const handleNicheFilterChange = (newNicheFilter: string) => {
    setNicheFilter(newNicheFilter);
    setFilterLoading(true);
    setTableLoading(true); // Show table loader immediately
    // Clear preloaded cache when niche filter changes
    setPreloadedData(new Map());
    setPreloadingPages(new Set());
    setCurrentPage(1); // Reset to first page on niche filter change
    loadLeadsData(1, searchTerm, filter, newNicheFilter);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    loadLeadsData(page, searchTerm, filter, nicheFilter);
  };



  const getContactCounts = (lead: LeadWithContacts) => {
    return {
      emails: lead.emails.length,
      phones: lead.phones.length,
      socials: lead.socials.length
    };
  };

  // Remove full-screen loading state - show table immediately

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
              <p className="text-slate-500 mt-1 text-xs">
                {pagination ? (
                  <div className="flex items-center">
                    <span>Page {pagination.page} of {pagination.total_pages} • {pagination.total_count} total leads</span>
                    {preloadedData.size > 0 && (
                      <div className="ml-2 flex items-center text-green-600">
                        <span className="text-xs">📦 {preloadedData.size} cached</span>
                      </div>
                    )}
                    {preloadingPages.size > 0 && (
                      <div className="ml-2 flex items-center text-blue-600">
                        <div className="w-2 h-2 border border-blue-300 border-t-blue-600 rounded-full animate-spin mr-1"></div>
                        <span className="text-xs">Preloading...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-3 h-3 border border-slate-300 border-t-slate-600 rounded-full animate-spin mr-2"></div>
                    Loading leads...
                  </div>
                )}
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by domain, title, or niche..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-300 text-sm"
              />
            </div>
            <div className="flex space-x-2">
              {["all", "new", "scraped"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(status)}
                  className={filter === status
                    ? "bg-slate-700 hover:bg-slate-800 text-white shadow-lg"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
              
              {/* Niche Filter Dropdown */}
              <select
                value={nicheFilter}
                onChange={(e) => handleNicheFilterChange(e.target.value)}
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
              >
                <option value="all">All Niches</option>
                {niches.map((niche) => (
                  <option key={niche.id} value={niche.id}>
                    {niche.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>


        {/* Stats */}
        <div className="p-4 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-3 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900 mb-1">
                  {stats?.total_leads || leads.length}
                </div>
                <div className="text-slate-600 font-medium text-xs">Total Leads</div>
                <div className="w-6 h-1 bg-slate-300 rounded-full mx-auto mt-1"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-3 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900 mb-1">
                  {stats?.scraped_leads || leads.filter(l => l.scraped).length}
                </div>
                <div className="text-slate-600 font-medium text-xs">Scraped</div>
                <div className="w-6 h-1 bg-slate-300 rounded-full mx-auto mt-1"></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-lg p-3 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900 mb-1">
                  {stats?.unscraped_leads || leads.filter(l => !l.scraped).length}
                </div>
                <div className="text-slate-600 font-medium text-xs">New</div>
                <div className="w-6 h-1 bg-slate-300 rounded-full mx-auto mt-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-2 pb-4">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-slate-200/50 overflow-hidden">
              <div className="overflow-hidden">
                <table className="w-full text-xs" style={{ tableLayout: 'fixed' }}>
                  <TableHeader headers={["Domain", "Title", "Niche", "Emails", "Phones", "Social"]} />
                  {(loading || tableLoading || searchLoading || filterLoading) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-600">
                          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mb-3"></div>
                          <span className="text-sm font-medium">
                            {searchLoading ? "Searching..." : filterLoading ? "Filtering..." : "Loading leads..."}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                  <tbody className="divide-y divide-slate-100">
                    {!(tableLoading || searchLoading || filterLoading) && leads.map((lead) => {
                      return (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-all duration-300 group h-12">
                          <td className="px-2 py-2" style={{ width: '220px' }}>
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center mr-2 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">
                                <Icon name="globe" className="text-slate-600" size="sm" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-medium text-slate-900 text-sm break-all">
                                  <HighlightText text={lead.domain} searchTerm={searchTerm} />
                                </div>
                              </div>
                            </div>
                        </td>
                        <td className="px-2 py-2" style={{ width: '280px' }}>
                            <div className="font-medium text-slate-900 truncate text-xs">
                              <HighlightText text={lead.title} searchTerm={searchTerm} />
                            </div>
                            <div className="text-xs text-slate-500 truncate">ID: {lead.id.slice(-6)}</div>
                        </td>
                          <td className="px-2 py-2" style={{ width: '120px' }}>
                            <div className="text-xs text-slate-900 truncate font-medium">
                              <HighlightText text={lead.niche?.name || "Unknown"} searchTerm={searchTerm} />
                            </div>
                        </td>
                          <td className="px-2 py-2" style={{ width: '240px' }}>
                            {lead.emails.length > 0 ? (
                              <div className="space-y-1">
                                {lead.emails.slice(0, 1).map((email, index) => (
                                  <div key={index} className="text-xs text-slate-900 truncate font-medium">
                                    {email.email}
                                  </div>
                                ))}
                                {lead.emails.length > 1 && (
                                  <div className="text-xs text-slate-500">+{lead.emails.length - 1}</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-400 italic">-</div>
                            )}
                        </td>
                          <td className="px-2 py-2" style={{ width: '100px' }}>
                            {lead.phones.length > 0 ? (
                              <div className="space-y-1">
                                {lead.phones.slice(0, 1).map((phone, index) => (
                                  <div key={index} className="text-xs text-slate-900 truncate font-medium">
                                    {phone.phone}
                                  </div>
                                ))}
                                {lead.phones.length > 1 && (
                                  <div className="text-xs text-slate-500">+{lead.phones.length - 1}</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-400 italic">-</div>
                            )}
                        </td>
                          <td className="px-2 py-2" style={{ width: '130px' }}>
                            {lead.socials.length > 0 ? (
                              <div className="space-y-1">
                                {lead.socials.slice(0, 1).map((social, index) => (
                                  <div key={index} className="text-xs text-slate-900 truncate font-medium">
                                    <span className="text-slate-500">{social.platform}:</span> {social.handle}
                                  </div>
                                ))}
                                {lead.socials.length > 1 && (
                                  <div className="text-xs text-slate-500">+{lead.socials.length - 1}</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-400 italic">-</div>
                            )}
                        </td>
                        {/*<td className="px-4 py-3">
                            <Badge variant={getStatusColor(lead) as "success" | "warning" | "info" | "error"} size="sm">
                              {getStatusText(lead)}
                            </Badge>
                        </td>*/}
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {(loading || tableLoading || searchLoading || filterLoading) && (
              <Card className="p-6 text-center">
                <div className="flex flex-col items-center justify-center text-slate-600">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mb-3"></div>
                  <span className="text-sm font-medium">
                    {searchLoading ? "Searching..." : filterLoading ? "Filtering..." : "Loading leads..."}
                  </span>
                </div>
              </Card>
            )}
            {!(tableLoading || searchLoading || filterLoading) && leads.map((lead) => {
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
                            <div className="font-semibold text-slate-900 break-all text-sm">
                              <HighlightText text={lead.domain} searchTerm={searchTerm} />
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              <HighlightText text={lead.title} searchTerm={searchTerm} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Niche Information */}
                    <div className="mb-3 p-2 bg-slate-50 rounded-lg">
                      <div className="text-xs font-medium text-slate-700 mb-1">Niche</div>
                      <div className="text-xs text-slate-900 font-medium">
                        <HighlightText text={lead.niche?.name || "Unknown Niche"} searchTerm={searchTerm} />
                      </div>
                      {lead.niche?.description && (
                        <div className="text-xs text-slate-500 mt-1">
                          {lead.niche.description}
                        </div>
                      )}
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

                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.total_pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total_count)} of {pagination.total_count} leads
              </div>
              
              <div className="flex items-center space-x-3">
                {pagination.has_prev && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={tableLoading}
                    className="flex items-center px-4 py-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                  >
                    <Icon name="chevron-left" size="sm" className="mr-1" />
                    Previous
                  </Button>
                )}
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(pagination.total_pages - 4, currentPage - 2)) + i;
                    if (pageNum > pagination.total_pages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                          pageNum === currentPage
                            ? "bg-slate-600 text-white shadow-md"
                            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                {pagination.has_next && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={tableLoading}
                    className="flex items-center px-4 py-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                  >
                    Next
                    <Icon name="chevron-right" size="sm" className="ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!(tableLoading || searchLoading || filterLoading) && leads.length === 0 && (
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
