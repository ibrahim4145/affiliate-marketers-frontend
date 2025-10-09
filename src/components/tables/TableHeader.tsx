import { cn } from "@/lib/utils";

interface TableHeaderProps {
  headers: string[];
  className?: string;
}

export default function TableHeader({ headers, className }: TableHeaderProps) {
  const columnWidths = ['220px', '120px', '240px', '100px', '130px', '80px', '100px'];
  
  return (
    <thead className={cn("bg-gray-50", className)}>
      <tr>
        {headers.map((header, i) => (
          <th 
            key={i} 
            className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            style={{ width: columnWidths[i] || 'auto' }}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
