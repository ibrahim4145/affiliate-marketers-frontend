import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200",
      hover && "hover:shadow-md hover:shadow-blue-500/10 hover:border-blue-200",
      className
    )}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
