import { cn } from "@/lib/utils";

interface MobileCardProps {
  data: Record<string, string | number>;
  className?: string;
  actions?: React.ReactNode;
}

export default function MobileCard({ data, className, actions }: MobileCardProps) {
  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-lg p-3 mb-3 shadow-sm hover:shadow-md transition-all duration-200",
      className
    )}>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center py-0.5">
            <span className="text-xs font-medium text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}:
            </span>
            <span className="text-sm text-gray-900 font-semibold">
              {value}
            </span>
          </div>
        ))}
        {actions && (
          <div className="pt-2 border-t border-gray-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
