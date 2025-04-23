import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Using Shadcn Badge for consistency

// Define the structure for a single line item
interface LineItem {
  id: string | number; // Add an ID for key prop
  description: string;
  quantity: number | string;
  unit_price: number | string;
  total: number | string;
  metadata?: {
    [key: string]: any; // Allow any kind of metadata
    source?: "human" | "llm"; // Optional source indicator
  };
}

// Define the props for the LineItemTable component
interface Props {
  lineItems: LineItem[];
}

export function LineItemTable({ lineItems }: Props) {
  // State to keep track of expanded rows, using item ID as key
  const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});

  // Function to toggle the expanded state for a given item ID
  const toggleExpanded = (id: string | number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit Price</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Details</TableHead> {/* Header for the button column */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {lineItems.map((item) => (
          <React.Fragment key={item.id}>
            {/* Main row for the line item data */}
            <TableRow>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${typeof item.unit_price === 'number' ? item.unit_price.toFixed(2) : item.unit_price}</TableCell>
              <TableCell>${typeof item.total === 'number' ? item.total.toFixed(2) : item.total}</TableCell>
              <TableCell>
                {/* Only show button if metadata exists */}
                {item.metadata && Object.keys(item.metadata).length > 0 && (
                   <Button
                     variant="outline"
                     size="sm" // Smaller button size
                     onClick={() => toggleExpanded(item.id)}
                   >
                     {expandedRows[item.id] ? "Hide" : "View"} Details
                   </Button>
                )}
              </TableCell>
            </TableRow>

            {/* Expanded row for metadata, shown conditionally */}
            {expandedRows[item.id] && item.metadata && (
              <TableRow className="bg-muted/50 hover:bg-muted/50"> {/* Use muted background */}
                <TableCell colSpan={5}> {/* Span across all columns */}
                  <div className="p-3 space-y-2"> {/* Add padding and vertical space */}
                    <h4 className="text-sm font-medium mb-2">Metadata:</h4>
                    {Object.entries(item.metadata)
                       // Don't display the 'source' key itself here if it exists
                      .filter(([key]) => key !== 'source') 
                      .map(([key, value]) => (
                      <div key={key} className="flex items-center text-xs">
                        <span className="font-medium capitalize min-w-[100px]">{key.replace(/_/g, ' ')}:</span>
                        {/* Using Shadcn Badge for value styling */}
                        <Badge variant="secondary" className="ml-2 font-normal"> 
                           {String(value)}
                        </Badge>
                      </div>
                    ))}
                    {/* Conditionally show the AI warning badge */}
                    {item.metadata?.source === "llm" && (
                       <Badge variant="destructive" className="mt-2 text-xs">
                         ⚠️ AI-generated Data
                       </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

// Export the component and its props interface
export default LineItemTable;

