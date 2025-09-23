"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import TableHeader from "@/components/tables/TableHeader";
import MobileCard from "@/components/tables/MobileCard";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function IndustriesPage() {
  const [industries, setIndustries] = useState([
    { id: 1, name: "Technology", status: "active", leads: 234, lastUpdated: "2 hours ago" },
    { id: 2, name: "Finance", status: "active", leads: 189, lastUpdated: "1 day ago" },
    { id: 3, name: "Healthcare", status: "paused", leads: 156, lastUpdated: "3 days ago" },
    { id: 4, name: "Education", status: "active", leads: 98, lastUpdated: "1 week ago" }
  ]);

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
      <div className="p-6 space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Industries</h1>
            <p className="text-gray-600 mt-1">Manage your target industries and their performance</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Icon name="edit" className="mr-2" />
              Export
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsAdding(true)}
            >
              <Icon name="plus" className="mr-2" />
              Add Industry
            </Button>
          </div>
        </div>

        {/* Add Industry Form */}
        {isAdding && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                placeholder="Enter industry name..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addIndustry()}
                autoFocus
              />
              <Button onClick={addIndustry} disabled={!newIndustry.trim()}>
                Add
              </Button>
              <Button variant="outline" onClick={() => {setIsAdding(false); setNewIndustry("");}}>
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
              <TableHeader headers={["Industry", "Status", "Leads", "Last Updated", "Actions"]} />
              <tbody className="divide-y divide-gray-200">
                {industries.map((industry) => (
                  <tr key={industry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Icon name="industries" className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{industry.name}</div>
                          <div className="text-sm text-gray-500">ID: {industry.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={industry.status === "active" ? "success" : "warning"}
                      >
                        {industry.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-semibold text-gray-900">{industry.leads}</div>
                      <div className="text-sm text-gray-500">leads generated</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {industry.lastUpdated}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleStatus(industry.id)}
                        >
                          <Icon name={industry.status === "active" ? "close" : "check"} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteIndustry(industry.id)}
                        >
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
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="industries" className="text-gray-400" size="lg" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No industries yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first industry to track.</p>
          <Button onClick={() => setIsAdding(true)}>
            <Icon name="plus" className="mr-2" />
            Add Your First Industry
          </Button>
        </Card>
      )}
      </div>
    </DashboardLayout>
  );
}
