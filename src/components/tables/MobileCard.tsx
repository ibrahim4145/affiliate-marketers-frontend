import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface MobileCardProps {
  data: Record<string, string | number>;
  className?: string;
  actions?: React.ReactNode;
}

export default function MobileCard({ data, className, actions }: MobileCardProps) {
  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-all duration-200",
      className
    )}>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value], index) => (
          <div key={key} className="flex justify-between items-center py-1">
            <span className="text-sm font-medium text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </span>
            <span className="text-sm text-gray-900 font-medium">
              {value}
            </span>
          </div>
        ))}
        {actions && (
          <div className="pt-3 border-t border-gray-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
