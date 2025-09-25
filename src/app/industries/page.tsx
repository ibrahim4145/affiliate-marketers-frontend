"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import TableHeader from "@/components/tables/TableHeader";
import MobileCard from "@/components/tables/MobileCard";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Static data - moved to server-side
const initialIndustries = [
    { id: 1, name: "Technology", status: "active", leads: 234, lastUpdated: "2 hours ago" },
    { id: 2, name: "Finance", status: "active", leads: 189, lastUpdated: "1 day ago" },
    { id: 3, name: "Healthcare", status: "paused", leads: 156, lastUpdated: "3 days ago" },
    { id: 4, name: "Education", status: "active", leads: 98, lastUpdated: "1 week ago" }
];

export default function IndustriesPage() {
  const [industries, setIndustries] = useState(initialIndustries);
  const [newIndustry, setNewIndustry] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addIndustry = () => {
    if (newIndustry.trim()) {
      const newId = Math.max(...industries.map(i => i.id)) + 1;
      setIndustries([...industries, {
        id: newId,
        name: newIndustry,
        status: "active",
        leads: 0,
        lastUpdated: "just now"
      }]);
      setNewIndustry("");
      setIsAdding(false);
    }
  };

  const toggleStatus = (id: number) => {
    setIndustries(industries.map(ind => 
      ind.id === id 
        ? { ...ind, status: ind.status === "active" ? "paused" : "active" }
        : ind
    ));
  };

  const deleteIndustry = (id: number) => {
    setIndustries(industries.filter(ind => ind.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen">
      {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Industries
              </h1>
              <p className="text-slate-600 mt-1 text-sm">Manage your target industries and their performance</p>
          </div>
          <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
              >
              <Icon name="edit" className="mr-2" />
              Export
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsAdding(true)}
                className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Icon name="plus" className="mr-2" />
              Add Industry
            </Button>
          </div>
        </div>

        {/* Add Industry Form */}
        {isAdding && (
            <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                placeholder="Enter industry name..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                onKeyPress={(e) => e.key === 'Enter' && addIndustry()}
                autoFocus
              />
                <Button 
                  onClick={addIndustry} 
                  disabled={!newIndustry.trim()}
                  className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white"
                >
                Add
              </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {setIsAdding(false); setNewIndustry("");}}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

        {/* Content Area */}
        <div className="flex-1 px-4 pb-4 min-h-0">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader headers={["Industry", "Status", "Leads", "Last Updated", "Actions"]} />
                  <tbody className="divide-y divide-slate-100">
                {industries.map((industry) => (
                      <tr key={industry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                          <Icon name="industries" className="text-slate-700" size="sm" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{industry.name}</div>
                          <div className="text-xs text-slate-500">ID: {industry.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={industry.status === "active" ? "success" : "warning"}
                        size="sm"
                      >
                        {industry.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-lg font-semibold text-slate-900">{industry.leads}</div>
                      <div className="text-xs text-slate-500">leads generated</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {industry.lastUpdated}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatus(industry.id)}
                          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-1"
                        >
                          <Icon name={industry.status === "active" ? "close" : "check"} size="sm" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteIndustry(industry.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1"
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
        {industries.map((industry) => (
          <MobileCard
            key={industry.id}
            data={{
              name: industry.name,
              status: industry.status,
              leads: `${industry.leads} leads`,
              lastUpdated: industry.lastUpdated
            }}
            actions={
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleStatus(industry.id)}
                >
                  {industry.status === "active" ? "Pause" : "Activate"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteIndustry(industry.id)}
                >
                  Delete
                </Button>
              </div>
            }
          />
        ))}
      </div>

      {/* Empty State */}
      {industries.length === 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="industries" className="text-slate-400" size="lg" />
          </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No industries yet</h3>
              <p className="text-slate-500 mb-6">Get started by adding your first industry to track.</p>
              <Button 
                onClick={() => setIsAdding(true)}
                className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white"
              >
            <Icon name="plus" className="mr-2" />
            Add Your First Industry
          </Button>
            </div>
      )}
        </div>
      </div>
    </DashboardLayout>
  );
}
