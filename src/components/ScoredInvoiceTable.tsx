import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ExtractedLineItem } from "types";

interface Props {
  results: ExtractedLineItem[];
}

export default function ScoredInvoiceTable({ results }: Props) {
  const [propertyName, setPropertyName] = useState("");
  const [unitCount, setUnitCount] = useState("");
  const [propertyType, setPropertyType] = useState("");

  // Handle cases where results might be null or undefined
  if (!results || results.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400 p-4">No line items to display.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Name</label>
          <Input value={propertyName} onChange={e => setPropertyName(e.target.value)} placeholder="e.g. Avana Sunset" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Count</label>
          <Input value={unitCount} onChange={e => setUnitCount(e.target.value)} placeholder="e.g. 225" type="number" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Type</label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white"
            value={propertyType}
            onChange={e => setPropertyType(e.target.value)}
          >
            <option value="">Select type</option>
            <option value="Garden Style">Garden Style</option>
            <option value="Mid-Rise">Mid-Rise</option>
            <option value="High Rise">High Rise</option>
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Container</TableHead>
            <TableHead>Freq</TableHead>
            <TableHead>Cost/Yard</TableHead>
            <TableHead>Cost Score</TableHead>
            <TableHead>Container Score</TableHead>
            <TableHead>Recycle Bonus</TableHead>
            <TableHead>Overall</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r, i) => (
            <TableRow key={i}>
              <TableCell>{r.material_type || '-'}</TableCell>
              <TableCell>{r.container_size || '-'}</TableCell>
              <TableCell>{r.frequency || '-'}</TableCell>
              <TableCell>
                {r.score_details?.cost_efficiency?.value ?
                  `$${r.score_details.cost_efficiency.value.toFixed(2)}` :
                  "-"}
              </TableCell>
              <TableCell>{r.score_details?.cost_efficiency?.score || '-'}</TableCell>
              <TableCell>{r.score_details?.container_efficiency?.score || '-'}</TableCell>
              <TableCell>{r.score_details?.material_type_bonus?.score || 0}</TableCell>
              <TableCell>
                <Progress value={(r.overall_score || 0) * 10} className="h-2" />
                <div className="text-xs mt-1">{r.overall_score?.toFixed(1) || "0.0"}/10</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
