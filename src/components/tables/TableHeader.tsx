import { cn } from "@/lib/utils";

interface TableHeaderProps {
  headers: string[];
  className?: string;
}

export default function TableHeader({ headers, className }: TableHeaderProps) {
  return (
    <thead className={cn("bg-gray-50", className)}>
      <tr>
        {headers.map((header, i) => (
          <th 
            key={i} 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
