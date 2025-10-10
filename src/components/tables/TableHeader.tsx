import { cn } from "@/lib/utils";

interface TableHeaderProps {
  headers: string[];
  className?: string;
}

export default function TableHeader({ headers, className }: TableHeaderProps) {
  // Define column widths for different layouts
  const middlemanWidths = ['220px', '280px', '120px', '240px', '150px', '240px', '80px', '100px']; // 8 columns
  const leadsWidths = ['220px', '120px', '240px', '150px', '240px']; // 5 columns
  
  // Choose the appropriate width array based on number of headers
  const columnWidths = headers.length === 8 ? middlemanWidths : leadsWidths;
  
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
