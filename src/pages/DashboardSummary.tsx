"use client";

import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase"; // Import the supabase client
import brain from "brain"; // Databutton brain client
import { DashboardMetrics, TopUser } from "types"; // Import types generated from backend
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { AlertCircle, FileText, Flag, Users, TrendingUp } from "lucide-react"; // Icons
import { Toaster, toast } from 'sonner';

// Helper component for displaying a single metric card
interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  isLoading: boolean;
}

function MetricCard({ title, value, description, icon, isLoading }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-3/4" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && (
           isLoading ? <Skeleton className="h-4 w-1/2 mt-1" /> : <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardSummary() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const httpResponse = await brain.get_dashboard_summary();
        const data = await httpResponse.json();
        setMetrics(data);
      } catch (err: any) {
        console.error("Failed to load dashboard metrics:", err);
        setError(`Failed to load dashboard metrics: ${err.message || 'Unknown error'}`);
        toast.error(`Failed to load dashboard metrics: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics(); // Initial fetch

    // Set up Supabase real-time subscription
    const channel = supabase
      .channel('invoices-changes') // Unique channel name
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'invoices', // Assuming 'invoices' is the table name
          // Optional: Filter on the server for specific status changes if needed and supported
          // filter: 'status=eq.completed OR status=eq.failed' // Check Supabase docs for exact filter syntax
        },
        (payload) => {
          console.log('Supabase change received:', payload);
          // Check if the status indicates processing finished
          if (payload.new && (payload.new.status === 'completed' || payload.new.status === 'failed')) {
            console.log(`Invoice ${payload.new.id} finished processing, refreshing dashboard...`);
            toast.info("Invoice processing finished. Refreshing dashboard...");
            fetchMetrics(); // Re-fetch data when an invoice is updated to completed or failed
          }
        }
      )
      .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
              console.log('Subscribed to Supabase invoice changes!');
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error('Supabase subscription error:', err);
              toast.error("Realtime update connection failed.", { description: err?.message });
          } else if (status === 'CLOSED') {
              console.log('Supabase subscription closed.');
          }
      });

    // Cleanup function to remove the subscription when the component unmounts
    return () => {
      console.log("Removing Supabase subscription");
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array ensures this runs only once on mount // Run only on component mount

  return (
    <div className="p-6 space-y-6">
      <Toaster richColors />
      <h1 className="text-3xl font-bold">📊 Dashboard Summary</h1>
      <p className="text-muted-foreground">
        Overview of contract comparison activity and key risk indicators.
      </p>

      {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertCircle size={20} /> Error Loading Data
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive">{error}</p>
                <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page. If the problem persists, check the backend logs.</p>
            </CardContent>
          </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Comparisons"
          value={metrics?.total_comparisons ?? 0}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Comparisons with Red Flags"
          value={`${metrics?.percentage_with_flags ?? 0}%`}
          description={`${metrics?.comparisons_with_flags ?? 0} comparisons had flags`}
          icon={<Flag className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Avg. Flags per Comparison"
          value={metrics?.average_flags_per_comparison ?? 0}
          description={`${metrics?.total_red_flags ?? 0} total flags found`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      {/* Top Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5"/> Top Users
            </CardTitle>
          <CardDescription>Users submitting the most comparisons (requires Supabase RPC function).</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">Could not load top users due to an error.</p>
          ) : metrics?.top_users && metrics.top_users.length > 0 ? (
            <div className="overflow-auto border rounded-md">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>User Email</TableHead>
                    <TableHead className="text-right">Comparisons</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {metrics.top_users.map((user) => (
                    <TableRow key={user.user_id}>
                        <TableCell className="font-medium">{user.user_id}</TableCell>
                        <TableCell className="text-right">{user.comparison_count}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No top user data available. Ensure the Supabase RPC function 'get_top_users' is created and returning data.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
