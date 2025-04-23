
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner"; // Import toast for error feedback
import brain from "brain"; // Keep brain for other calls if needed
import { API_URL } from "app"; // Import API_URL
import { Badge } from "@/components/ui/badge"; // Import Badge for flags
import { InvoiceResult, ExtractedLineItem, InitialProcessingResponse, ProcessingStatusResponse } from "types"; // Assuming types are in types.ts
import ScoredInvoiceTable from "components/ScoredInvoiceTable"; // Import the new component

// Define a type for tracking processing status
interface ProcessingJob {
  storage_key: string;
  result_id?: string; // Available after initial call
  status: "pending" | "processing" | "completed" | "failed" | "not_found" | "initial"; // Add 'initial' state
  data?: InvoiceResult | null; // Store full result data on completion
  error?: string | null; // Store error message on failure
}


export default function BulkInvoiceProcessor() {
  const [keysInput, setKeysInput] = useState("");
  const [loading, setLoading] = useState(false); // General loading state
  // State for tracking individual job progress
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([]);
  const [error, setError] = useState<string | null>(null); // State for general errors
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null); // Keep for potential future use
  const [uploadLoading, setUploadLoading] = useState(false); // Keep for potential future use
  const fileInputRef = useRef<HTMLInputElement>(null); // Keep for potential future use
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // --- File Upload Handler (Restored from PLA-49, using brain client) --- START ---
  const handleUploadFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Please select files to upload first.");
      return;
    }

    setUploadLoading(true);
    setError(null); // Clear previous errors

    const formData = new FormData();
    // The backend expects the files under the key 'files'
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      // Construct the full API URL
      const uploadUrl = `${API_URL}/upload-invoices`; // Use API_URL

      // Use fetch API directly
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        // Headers are automatically set by the browser for FormData,
        // but specify credentials if needed (important in DEV)
        credentials: "include",
      });

      const result: { storage_keys?: string[]; errors?: string[] } = 
        await response.json();

      if (!response.ok) {
        // Handle HTTP errors (like 400, 500)
        throw new Error(
          result.detail || `HTTP error ${response.status}: ${response.statusText}`
        );
      }

      if (result.storage_keys && result.storage_keys.length > 0) {
        const newKeysString = result.storage_keys.join("\n");
        // Update keysInput state correctly
        setKeysInput((prevKeys) => {
           if (prevKeys) {
             return prevKeys + "\n" + newKeysString;
           } else {
             return newKeysString;
           }
        });
        // Use string concatenation instead of template literal
        toast.success(
          result.storage_keys.length + " file(s) uploaded successfully."
        );
      }

      if (result.errors && result.errors.length > 0) {
         // Use string concatenation instead of template literal
        toast.error(
          "Upload failed for " + result.errors.length + " file(s): " + result.errors.join(", ")
        );
      }

      // Clear the file input after handling
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input value
      }
    } catch (err: any) {
      console.error("Error uploading files:", err);
      const errorMsg =
        err?.response?.data?.detail ||
        err.message ||
        "An unknown error occurred during upload.";
      setError(errorMsg);
       // Use string concatenation instead of template literal
      toast.error("Upload failed: " + errorMsg);
    } finally {
      setUploadLoading(false);
    }
  };
  // --- File Upload Handler (Restored from PLA-49) --- END ---


  const handleRunBulk = async () => {
    setError(null); // Clear previous errors
    setLoading(true); // Indicate overall processing start
    setProcessingJobs([]); // Clear previous jobs
    const keys = keysInput
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean);

    if (keys.length === 0) {
      toast.error("Please enter at least one storage key.");
      setLoading(false);
      return;
    }

    // Set initial 'pending' status in UI immediately
    const initialJobs: ProcessingJob[] = keys.map(key => ({
        storage_key: key,
        status: "pending", // Start as pending
    }));
    setProcessingJobs(initialJobs);

    try {
      // Call the new backend endpoint to start background processing
      const response = await brain.bulk_extract_invoice_data({
        storage_keys: keys,
      });
      const data: InitialProcessingResponse = await response.json();

      // Update jobs with result_ids and trigger polling (handled by useEffect)
      setProcessingJobs(prevJobs => 
         prevJobs.map(job => {
            const matchingResultId = data.result_ids.find(id => { 
                // This matching logic assumes the backend creates result_ids in the SAME order as storage_keys
                // A more robust approach would be if the backend returned a mapping {storage_key: result_id}
                // For now, we rely on index matching.
                const index = keys.indexOf(job.storage_key);
                return index !== -1 && data.result_ids[index];
            });
            const resultIdForJob = matchingResultId ? data.result_ids[keys.indexOf(job.storage_key)] : undefined;

            if (resultIdForJob) {
                return { ...job, result_id: resultIdForJob, status: "pending" }; // Still pending until polled
            } else {
                 return { ...job, status: "failed", error: "Could not initiate processing job." };
            }
         })
      );
      toast.info(data.message || "Background processing started...");
      // Polling will be handled by useEffect

    } catch (err: any) {
      console.error("Error initiating bulk extraction:", err);
      const errorMsg =
        err?.response?.data?.detail ||
        err.message ||
        "An unknown error occurred initiating bulk processing.";
      setError(errorMsg);
      toast.error("Initiation failed: " + errorMsg);
      // Mark all initial jobs as failed if the initial call fails
      setProcessingJobs(prevJobs => 
          prevJobs.map(job => ({ ...job, status: "failed", error: errorMsg }))
      );
      setLoading(false); // Stop loading as initiation failed
    }
    // setLoading(false) will be handled by the polling useEffect
  };

  // Helper to safely escape values for CSV
  const escapeCSV = (value: any): string => {
    const stringValue = String(value === null || value === undefined ? "" : value);
    if (
      stringValue.includes(",") ||
      stringValue.includes("\n") ||
      stringValue.includes('"')
    ) {
      // Double quotes inside the string need to be escaped by doubling them
      const escapedValue = stringValue.replace(/"/g, '""');
      return `"${escapedValue}"`;
    }
    return stringValue;
  };

  // Handle CSV export
  const handleExportCSV = () => {
    if (processingJobs.length === 0 || processingJobs.every(j => j.status !== 'completed' || !j.data)) {
        toast.info("No completed results to export.");
        return;
    }

    const completedJobs = processingJobs.filter(j => j.status === 'completed' && j.data) as (ProcessingJob & { data: InvoiceResult })[];

    // Define headers for the main CSV data
    const headers = [
      "File Key",
      "Service Address",
      "Vendor Name",
      "Invoice Date",
      "Due Date",
      "Service Start",
      "Service End",
      "Total Cost",
      "Container Sizes", // Combined sizes if available
      "Frequency",
      "Total Yards",
      "Compactor Hauls",
      "Tonnage",
      "Surcharges (JSON)", // Keep as JSON string for now
      "Status/Error", // Include processing status or error message
      // Headers for line items (prefixed)
      "Line Item: Material",
      "Line Item: Container",
      "Line Item: Frequency",
      "Line Item: Pickups", // Renamed from Pickup Count
      "Line Item: Total Yards",
      "Line Item: Cost",
      "Line Item: Cost/Yard", // New column
      "Line Item: Overall Score", // Changed from Score to Overall Score
      "Line Item: Score Details (JSON)", // Added new column
      "Line Item: Flags", // New column
      "Line Item: Description",
    ];

    const csvRows: string[] = [headers.join(",")];

    // Iterate through each COMPLETED result and its line items
    completedJobs.forEach((job) => {
      const r = job.data; // Use the data from the completed job
      if (!r) return; // Skip if data is somehow missing
      const baseRow = [
        escapeCSV(r.storage_key),
        escapeCSV(r.service_address),
        escapeCSV(r.vendor_name),
        escapeCSV(r.invoice_date),
        escapeCSV(r.due_date),
        escapeCSV(r.service_period_start),
        escapeCSV(r.service_period_end),
        escapeCSV(
          r.total_cost !== undefined && r.total_cost !== null
            ? r.total_cost.toFixed(2)
            : ""
        ),
        escapeCSV(r.container_sizes?.join("; ") ?? ""), // Join array if present
        escapeCSV(r.service_frequency),
        escapeCSV(r.total_yards ?? ""), // Use nullish coalescing
        escapeCSV(r.compactor_hauls ?? ""), // Use nullish coalescing
        escapeCSV(r.tonnage ?? ""), // Use nullish coalescing
        escapeCSV(JSON.stringify(r.surcharges ?? [])), // Stringify surcharges
        escapeCSV(r.error ? `Error: ${r.error}` : "Success"), // Add status/error
      ];

      // If there are line items, create a row for each
      if (r.line_items && r.line_items.length > 0) {
        r.line_items.forEach((item, index) => {
           const currentBaseRow = index === 0 ? [...baseRow] : Array(baseRow.length).fill('""'); // Use base row only for the first line item
          const lineItemRow = [
            escapeCSV(item.material_type || ""),
            escapeCSV(item.container_size || ""),
            escapeCSV(item.frequency || ""),
            escapeCSV(item.pickup_count ?? ""),
            escapeCSV(item.total_yards ?? ""),
            escapeCSV(
              item.line_total_cost ? item.line_total_cost.toFixed(2) : ""
            ),
            // Calculate Cost/Yard
            escapeCSV(
              item.line_total_cost && item.total_yards && item.total_yards > 0
                ? (item.line_total_cost / item.total_yards).toFixed(2)
                : ""
            ),
            // Get Overall Score
            escapeCSV(item.score_details?.overall?.score?.toFixed(1) ?? ""),
            // Get Score Details as JSON
            escapeCSV(JSON.stringify(item.score_details || {})),
            // Get Flags
            escapeCSV((item.benchmark_flags || []).join("; ")), // Join flags with semicolon for CSV
            escapeCSV(item.line_description || ""),
          ];
          // Combine base row data (or empty strings) with the specific line item data
          csvRows.push([...currentBaseRow, ...lineItemRow].join(","));
        });
      } else {
        // If no line items, just add the base row with empty placeholders for line item columns
        csvRows.push([...baseRow, ...Array(10).fill('""')].join(",")); // Updated placeholder count to 10
      }
    });


    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "wastewise_bulk_results_with_lines.csv"); // Updated filename
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Toggle expanded row visibility
  const toggleExpandedRow = (key: string) => {
    setExpandedRow(expandedRow === key ? null : key);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Bulk Invoice Processor
      </h1>
      <Card>
        <CardContent className="space-y-4 pt-6">
          {/* --- File Upload Section (Restored from PLA-49) --- START --- */}
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-gray-300">
              Upload Invoices (PDF, DOCX)
            </label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLoading}
              >
                Choose Files
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept=".pdf,.docx"
                onChange={(e) => setSelectedFiles(e.target.files)}
                className="hidden" // Hide the default input
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedFiles
                  ? `${selectedFiles.length} file(s) selected` // This template literal seems ok
                  : "No files selected"}
              </span>
            </div>
            {selectedFiles && selectedFiles.length > 0 && (
              <Button onClick={handleUploadFiles} disabled={uploadLoading}>
                {uploadLoading ? "Uploading..." : "Upload Selected Files"}
              </Button>
            )}
          </div>
          {/* --- File Upload Section (Restored from PLA-49) --- END --- */}

          <label className="text-sm font-medium dark:text-gray-300">
            Or Paste Storage Keys
          </label>
          <Textarea
            placeholder="Paste storage keys here, one per line..."
            value={keysInput}
            onChange={(e) => setKeysInput(e.target.value)}
            rows={6}
            className="text-sm"
          />
          <Button onClick={handleRunBulk} disabled={loading}>
            {loading ? "Processing..." : "Run Bulk Extraction"}
          </Button>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              Error: {error}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results Section - Show table when jobs exist */}
      {processingJobs.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex justify-end">
              <Button 
                onClick={handleExportCSV} 
                disabled={processingJobs.every(j => j.status !== 'completed') || loading}
              >
                Export Completed to CSV (with Line Items)
              </Button>
            </div>
            {/* Table structure starts here */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead> {/* Column for Expand/View button */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {processingJobs.map((job) => (
                  <React.Fragment key={job.storage_key}> {/* Use Fragment for key */}
                    <TableRow>
                      <TableCell className="font-medium truncate max-w-xs" title={job.storage_key}>{job.storage_key}</TableCell>
                      <TableCell>{job.data?.vendor_name || "-"}</TableCell>
                      <TableCell>{job.data?.service_address || "-"}</TableCell>
                      <TableCell>{job.data?.invoice_date || "-"}</TableCell>
                      <TableCell>
                        {job.data?.total_cost !== undefined && job.data?.total_cost !== null
                          ? `$${job.data.total_cost.toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                         <Badge 
                           variant={job.status === 'completed' ? 'default' : job.status === 'failed' ? 'destructive' : 'secondary'}
                           className={`capitalize ${job.status === 'processing' || job.status === 'pending' ? 'animate-pulse' : ''}`}>
                           {job.status}
                         </Badge>
                      </TableCell>
                      <TableCell>
                        {/* Show button only for completed or failed jobs with details */}
                        {(job.status === 'completed' && job.data && job.data.line_items && job.data.line_items.length > 0) || (job.status === 'failed' && job.error) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleExpandedRow(job.storage_key)}
                          >
                            {expandedRow === job.storage_key ? "Hide" : "View"}
                          </Button>
                        ) : job.status === 'completed' ? (
                          <span>Processed</span> // Indicate completion even without lines
                        ) : (
                          <span>-</span> /* Show dash if nothing to expand or still processing */
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row for Line Items or Error Details */}
                    {expandedRow === job.storage_key && (
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableCell colSpan={7}> {/* Corrected colSpan to 7 */}
                          <div className="p-3">
                            {/* Show Error details if present */}
                            {job.status === 'failed' && job.error && (
                               <div className="mb-3 p-3 border border-red-200 bg-red-50 rounded dark:bg-red-900 dark:border-red-700">
                                <p className="font-medium text-red-700 dark:text-red-200">Error Details:</p>
                                <p className="text-sm text-red-600 dark:text-red-300">{job.error}</p>
                               </div>
                            )}
                            {/* Show Line Items table if job completed and items exist */}
                            {job.status === 'completed' && job.data && job.data.line_items && job.data.line_items.length > 0 && (
                              <div>
                                <p className="font-medium mb-2 dark:text-gray-200">Line Items:</p>
                                {/* Pass only line items to the table */}
                                <ScoredInvoiceTable results={job.data.line_items} />
                              </div>
                            )}
                             {/* Message if row expanded but no line items (and no error shown above) */}
                            {job.status === 'completed' && (!job.data || !job.data.line_items || job.data.line_items.length === 0) && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">Processing completed, but no line item details were extracted.</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            {/* Table structure ends here */}
          </CardContent>
        </Card>
      )}
    </div>
);

// --- Polling Logic --- START ---
  const checkStatus = useCallback(async (idsToCheck: string[]) => {
    if (idsToCheck.length === 0) return; // Avoid unnecessary calls
    try {
      const response = await brain.check_processing_status({ result_ids: idsToCheck });
      const data: ProcessingStatusResponse = await response.json();

      setProcessingJobs(prevJobs => {
        let allDone = true;
        const updatedJobs = prevJobs.map(job => {
          if (job.result_id && data.statuses[job.result_id]) {
            const newStatus = data.statuses[job.result_id] as ProcessingJob['status'];
            
            // Check if status actually changed
            if (newStatus !== job.status) {
              console.log(`Job ${job.storage_key} (ID: ${job.result_id}) status changed to: ${newStatus}`);
              
              let updatedData = job.data;
              let updatedError = job.error;

              // Placeholder logic for fetching data/error on completion/failure
              // A more robust solution would fetch full details if needed
              if (newStatus === 'completed') {
                 // TODO: If backend doesn't save full data on completion, fetch it here using job.result_id
                 // For now, just mark as complete. Assume data was saved via background task.
                 updatedError = null;
                 // Simulating data might appear later - a real fetch would be better
                 // For now, keep existing data structure for completed items, if any
                 updatedData = { ...job.data, storage_key: job.storage_key }; 
              } else if (newStatus === 'failed') {
                 // TODO: Fetch actual error details from backend if available
                 updatedError = data.statuses[`${job.result_id}_error`] || "Processing failed in background"; // Check for specific error message if backend provides it
                 updatedData = null;
              } else if (newStatus === 'not_found') {
                 updatedError = "Processing job record not found in backend.";
                 updatedData = null;
              }

              return { ...job, status: newStatus, data: updatedData, error: updatedError };
            }
          }
          // Keep track if any job is still processing
          if (job.status === 'pending' || job.status === 'processing') {
             allDone = false;
          }
          return job;
        });

        // Stop loading indicator if all jobs are resolved
        if (allDone) {
          console.log("All jobs finished processing.");
          setLoading(false); // Stop the main loading indicator
          toast.success("Bulk processing complete.");
        }

        return updatedJobs;
      });

    } catch (error) {
      console.error("Error polling job statuses:", error);
      toast.error("Error checking job statuses. Stopping polling.");
      setLoading(false); // Stop loading on error
    }
  }, []); // useCallback dependencies are empty for now

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const jobsToPoll = processingJobs.filter(
      job => job.result_id && (job.status === 'pending' || job.status === 'processing')
    );

    if (jobsToPoll.length === 0) {
      // If no jobs are pending/processing, ensure loading is false and clear interval
      if (loading) {
         // Small delay before setting loading false to avoid flicker if new job starts immediately
         setTimeout(() => setLoading(false), 200);
      }
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      return; // Exit effect
    }
    
    // Ensure loading is true while polling
    if (!loading) {
      setLoading(true);
    }

    const ids = jobsToPoll.map(j => j.result_id as string);
    console.log("Polling statuses for IDs:", ids);

    // Define the polling function inside useEffect to capture current state
    const poll = () => {
        checkStatus(ids);
    };

    // Initial check
    poll(); 
    // Set interval
    intervalId = setInterval(poll, 5000); // Poll every 5 seconds

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };

  }, [processingJobs, checkStatus, loading]); // Dependencies for the polling effect
// --- Polling Logic --- END ---
}
