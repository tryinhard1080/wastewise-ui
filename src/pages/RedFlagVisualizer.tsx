"use client";

import { useState, useEffect } from "react";
import brain from "brain"; // Databutton brain client
import { ComparisonRecord } from "types"; // Import the type
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Toaster, toast } from 'sonner';

interface FlagFrequency {
  flag: string;
  count: number;
}

export default function RedFlagVisualizer() {
  const [flagData, setFlagData] = useState<FlagFrequency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessFlags = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch latest 100 comparison records (no user filter)
        const httpResponse = await brain.get_comparison_history({});
        const responseData = await httpResponse.json();

        if (responseData && responseData.history) {
          const history: ComparisonRecord[] = responseData.history;
          const frequencyMap: Record<string, number> = {};

          // Aggregate flag counts
          history.forEach(record => {
            if (record.red_flags && Array.isArray(record.red_flags)) {
              record.red_flags.forEach(flag => {
                if (typeof flag === 'string' && flag.trim()) { // Ensure flag is a non-empty string
                    frequencyMap[flag] = (frequencyMap[flag] || 0) + 1;
                }
              });
            }
          });

          // Convert map to array suitable for Recharts
          const processedData: FlagFrequency[] = Object.entries(frequencyMap)
            .map(([flag, count]) => ({ flag, count }))
            .sort((a, b) => b.count - a.count); // Sort by count descending

          setFlagData(processedData);
          if (processedData.length === 0 && history.length > 0) {
              toast.info("No red flags found in the latest comparison records.")
          } else if (history.length === 0) {
              toast.info("No comparison history found to analyze.")
          }
        } else {
          throw new Error("Received unexpected data structure from server.");
        }
      } catch (err: any) {
        console.error("Failed to load or process red flags:", err);
        setError(`Failed to load red flag data: ${err.message || 'Unknown error'}`);
        toast.error(`Failed to load red flag data: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessFlags();
  }, []); // Run only on component mount

  return (
    <div className="p-6 space-y-6">
      <Toaster richColors />
      <h1 className="text-2xl font-bold">🚩 Red Flag Frequency Visualizer</h1>
      <p className="text-muted-foreground">
        Frequency of red flags identified in the latest 100 contract comparisons.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Top Red Flags</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Loading chart data...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-600">{error}</div>
          ) : flagData.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No red flag data to display.</div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={flagData}
                layout="vertical" // Vertical layout often better for long labels
                margin={{
                  top: 5,
                  right: 30,
                  left: 100, // Adjust left margin for potentially long flag labels
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                    dataKey="flag"
                    type="category"
                    width={150} // Adjust based on expected label length
                    interval={0} // Show all labels
                    tick={{ fontSize: 12 }} // Smaller font size for labels
                />
                <Tooltip formatter={(value: number) => [`${value} occurrences`, 'Count']}/>
                <Legend />
                <Bar dataKey="count" fill="#ef4444" name="Occurrences" /> {/* Red color for flags */}
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
