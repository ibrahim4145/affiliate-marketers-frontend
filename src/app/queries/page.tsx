"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import TableHeader from "@/components/tables/TableHeader";
import MobileCard from "@/components/tables/MobileCard";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function QueriesPage() {
  const [queries, setQueries] = useState([
    { 
      id: 1, 
      query: "Best SaaS tools for startups", 
      status: "running", 
      results: 45, 
      lastRun: "2 minutes ago",
      industry: "Technology"
    },
    { 
      id: 2, 
      query: "Crypto investment trends", 
      status: "completed", 
      results: 23, 
      lastRun: "1 hour ago",
      industry: "Finance"
    },
    { 
      id: 3, 
      query: "Healthcare AI solutions", 
      status: "paused", 
      results: 12, 
      lastRun: "2 hours ago",
      industry: "Healthcare"
    },
    { 
      id: 4, 
      query: "EdTech platforms", 
      status: "completed", 
      results: 67, 
      lastRun: "1 day ago",
      industry: "Education"
    }
  ]);

  const [newQuery, setNewQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addQuery = () => {
    if (newQuery.trim()) {
      const newId = Math.max(...queries.map(q => q.id)) + 1;
      setQueries([...queries, {
        id: newId,
        query: newQuery,
        status: "running",
        results: 0,
        lastRun: "just now",
        industry: "General"
      }]);
      setNewQuery("");
      setIsAdding(false);
    }
  };

  const toggleStatus = (id: number) => {
    setQueries(queries.map(q => 
      q.id === id 
        ? { ...q, status: q.status === "running" ? "paused" : "running" }
        : q
    ));
  };

  const deleteQuery = (id: number) => {
    setQueries(queries.filter(q => q.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "info";
      case "completed": return "success";
      case "paused": return "warning";
      default: return "default";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 space-y-4">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Queries</h1>
            <p className="text-gray-600 mt-1 text-sm">Manage your search queries and track their performance</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Icon name="edit" className="mr-2" />
              Export Results
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsAdding(true)}
            >
              <Icon name="plus" className="mr-2" />
              New Query
            </Button>
          </div>
        </div>

        {/* Add Query Form */}
        {isAdding && (
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                placeholder="Enter your search query..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addQuery()}
                autoFocus
              />
              <Button onClick={addQuery} disabled={!newQuery.trim()}>
                Start Query
              </Button>
              <Button variant="outline" onClick={() => {setIsAdding(false); setNewQuery("");}}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader headers={["Query", "Status", "Results", "Industry", "Last Run", "Actions"]} />
              <tbody className="divide-y divide-gray-200">
                {queries.map((query) => (
                  <tr key={query.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <Icon name="search" className="text-green-600" size="sm" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{query.query}</div>
                          <div className="text-xs text-gray-500">ID: {query.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusColor(query.status) as "success" | "warning" | "info" | "error"} size="sm">
                        {query.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-lg font-semibold text-gray-900">{query.results}</div>
                      <div className="text-xs text-gray-500">results found</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="info" size="sm">{query.industry}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {query.lastRun}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleStatus(query.id)}
                          className="p-1"
                        >
                          <Icon name={query.status === "running" ? "close" : "check"} size="sm" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteQuery(query.id)}
                          className="p-1"
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
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {queries.map((query) => (
          <MobileCard
            key={query.id}
            data={{
              query: query.query,
              status: query.status,
              results: `${query.results} results`,
              industry: query.industry,
              lastRun: query.lastRun
            }}
            actions={
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleStatus(query.id)}
                >
                  {query.status === "running" ? "Pause" : "Resume"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteQuery(query.id)}
                >
                  Delete
                </Button>
              </div>
            }
          />
        ))}
      </div>

      {/* Empty State */}
      {queries.length === 0 && (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="search" className="text-gray-400" size="lg" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No queries yet</h3>
          <p className="text-gray-500 mb-6">Start by creating your first search query to find leads.</p>
          <Button onClick={() => setIsAdding(true)}>
            <Icon name="plus" className="mr-2" />
            Create Your First Query
          </Button>
        </Card>
      )}
      </div>
    </DashboardLayout>
  );
}
