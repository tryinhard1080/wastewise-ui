import React, { useState, useEffect, useCallback } from "react"; // Add useCallback
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import Pagination

// ... other imports (generateComparisonHtml, generatePdfFromHtml, modals, icons, Tooltip, brain, types, toast)
import { ComparisonRecord, HistoryResponse } from "types"; // HistoryResponse should now include total_count

import { generateComparisonHtml } from "utils/reportUtils";
import { generatePdfFromHtml } from "utils/pdfUtils";
import ViewReportModal from "components/ViewReportModal";
import { SendEmailModal } from "components/SendEmailModal";
import { Eye, Mail, Download, Loader2, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import brain from "brain";
import { toast } from "sonner";


// Define items per page
const ITEMS_PER_PAGE = 10;

const HistoryViewer: React.FC = () => {
  const [history, setHistory] = useState<ComparisonRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecordForView, setSelectedRecordForView] =
    useState<ComparisonRecord | null>(null);
  const [selectedRecordForEmail, setSelectedRecordForEmail] =
    useState<ComparisonRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null); // State for loading indicator
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Updated fetchHistory function with pagination
  const fetchHistory = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    const limit = ITEMS_PER_PAGE;
    const offset = (page - 1) * limit;

    try {
      console.log(`Fetching history via backend endpoint... Page: ${page}, Limit: ${limit}, Offset: ${offset}`);
      // Pass query parameters for pagination
      const response = await brain.get_comparison_history2({ limit, offset });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from backend:", response.status, errorText);
        throw new Error(`Failed to fetch history: ${response.status} ${errorText || response.statusText}`);
      }

      // Use the updated HistoryResponse type which includes total_count
      const data: HistoryResponse = await response.json();
      console.log("Received history data from backend:", data);

      // Map HistoryItem[] to ComparisonRecord[] - comparison_summary will be null initially
       const mappedHistory: ComparisonRecord[] = (data.history || []).map(item => ({
          id: item.id,
          created_at: item.createdAt, // Use createdAt from HistoryItem
          file1_name: item.file1Name || null,   // Use file1Name
          file2_name: item.file2Name || null,   // Use file2Name
          red_flags: item.redFlags || null,     // Use redFlags
          comparison_summary: null, // Set summary to null initially
          user_id: null, // user_id not provided by HistoryItem
        }));
      console.log("Mapped history for state:", mappedHistory);

      setHistory(mappedHistory);
      setTotalCount(data.total_count); // Store total count

    } catch (err: any) {
      console.error("Error fetching comparison history:", err);
      setError(`Failed to load history: ${err.message || "Unknown error"}`);
      toast.error("Failed to load comparison history.");
       setHistory([]); // Clear history on error
       setTotalCount(0); // Reset total count on error
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies, fetchHistory itself doesn't depend on changing state

  // Fetch history when currentPage changes
  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage, fetchHistory]); // Depend on currentPage and fetchHistory


  const handlePageChange = (newPage: number) => {
     if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
     }
  };

  // --- Update handleViewReport ---
  const handleViewReport = async (record: ComparisonRecord) => { // Make async
    // Add temporary loading state for viewing modal? Optional.
    console.log("Fetching full details for ViewReportModal, record:", record.id);
    try {
      // Fetch full details using the new endpoint
      const response = await brain.get_comparison_details({ recordId: record.id });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching details:", response.status, errorText);
        toast.error("Failed to load report details.", { description: errorText || `Status: ${response.status}` });
        return; // Stop if fetch fails
      }

      const fullRecordData = await response.json();
      console.log("Received full details:", fullRecordData);

      // Assuming the backend returns data compatible with FullComparisonRecord,
      // which should be compatible with ComparisonRecord if fields overlap.
      // We might need a type assertion or mapping if structures differ significantly.
       const fullRecord: ComparisonRecord = {
            ...record, // Keep existing minimal data as fallback/base
            // Map fields from the backend response (assuming snake_case)
            // Ensure created_at is handled correctly (string vs Date)
            created_at: fullRecordData.created_at ? new Date(fullRecordData.created_at).toISOString() : record.created_at, // Standardize to string ISO format if needed by modal
            comparison_summary: fullRecordData.comparison_summary || null,
            // Ensure other fields match if they exist on fullRecordData
            file1_name: fullRecordData.file1_name || record.file1_name,
            file2_name: fullRecordData.file2_name || record.file2_name,
            red_flags: fullRecordData.red_flags || record.red_flags,
            line_items: fullRecordData.line_items || null, // Ensure line_items are mapped
        };


      setSelectedRecordForView(fullRecord); // Update state with full details
      setIsViewModalOpen(true); // Open modal

    } catch (err: any) {
      console.error("Error in handleViewReport:", err);
      toast.error("Failed to load report details.", { description: err.message || "An unknown error occurred." });
    } finally {
      // Reset temporary loading state if used
    }
  };

  // --- Update handleSendEmail (Optional, if full details are needed) ---
  // If SendEmailModal or its logic needs the full comparison_summary, update this similarly to handleViewReport/handleDownloadPdf
  const handleSendEmail = async (record: ComparisonRecord) => { // Make async if details needed
     // TODO: Check if SendEmailModal requires full details. If so, fetch them here first.
     // For now, assume it might not need the full summary immediately.
    console.log("Opening SendEmailModal for record:", record.id);
    setSelectedRecordForEmail(record); // Pass potentially minimal data initially
    setIsEmailModalOpen(true);
     // If full data is needed later by the modal itself, the modal could trigger the fetch.
   };

  // --- Update handleDownloadPdf ---
  const handleDownloadPdf = async (record: ComparisonRecord) => { // Make async
    if (downloadingId) return;
    setDownloadingId(record.id);
    console.log(`Starting PDF download process for record: ${record.id}`);

    try {
      let recordToUse = record; // Start with the minimal record

      // Fetch full details if summary is missing (it always will be initially)
      if (!record.comparison_summary) {
          console.log(`Fetching full details before PDF generation for record: ${record.id}`);
          const response = await brain.get_comparison_details({ recordId: record.id });

          if (!response.ok) {
              const errorText = await response.text();
              console.error("Error fetching details for PDF:", response.status, errorText);
              throw new Error(`Failed to fetch report details for PDF: ${errorText || response.status}`);
          }
          const fullRecordData = await response.json();
          console.log("Received full details for PDF:", fullRecordData);

         // Map to ComparisonRecord structure needed by generateComparisonHtml
         recordToUse = {
             ...record, // Base minimal data
             created_at: fullRecordData.created_at ? new Date(fullRecordData.created_at).toISOString() : record.created_at,
             comparison_summary: fullRecordData.comparison_summary || null,
             file1_name: fullRecordData.file1_name || record.file1_name,
             file2_name: fullRecordData.file2_name || record.file2_name,
             red_flags: fullRecordData.red_flags || record.red_flags,
         };

         // Ensure we actually got a summary now
         if (!recordToUse.comparison_summary) {
             throw new Error("Fetched details still missing comparison summary.");
         }
      }

      // Proceed with HTML and PDF generation using the (potentially updated) recordToUse
      const htmlContent = generateComparisonHtml(recordToUse);
      if (!htmlContent) throw new Error("Failed to generate HTML content.");
      console.log("HTML content generated.");

      const pdfBlob = await generatePdfFromHtml(htmlContent);
      if (!pdfBlob) throw new Error("Failed to generate PDF from HTML.");
      console.log("PDF blob generated.");

      // Download logic remains the same
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      const safeDate = recordToUse.created_at ? new Date(recordToUse.created_at) : new Date();
      const timestamp = safeDate.toISOString().split("T")[0];
      link.setAttribute(
        "download",
        `WasteWise_Comparison_${recordToUse.file1_name || 'file1'}_vs_${recordToUse.file2_name || 'file2'}_${timestamp}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      console.log("Download link clicked.");

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log("Cleanup complete.");
      toast.success("PDF report downloaded successfully!");

    } catch (err: any) {
      console.error("Error generating or downloading PDF:", err);
      // Keep existing error handling
      setError(`Failed to download PDF: ${err.message}`);
      toast.error("Failed to download PDF report.", {
        description: `${err.message || "An unknown error occurred."}`,
      });
    } finally {
      setDownloadingId(null); // Reset loading state
      console.log(`Finished PDF download attempt for record: ${record.id}`);
    }
  };

   if (isLoading && history.length === 0) { // Show loading only on initial load or page change when empty
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading history...</span>
      </div>
    );
  }

  if (error && history.length === 0) { // Only show full page error if history fails AND is empty
    return (
      <div className="text-red-600 bg-red-100 border border-red-400 rounded p-4 text-center">
        Error: {error}
      </div>
    );
  }


  if (history.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No comparison history found. Upload contracts to get started.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Comparison History
      </h1>
      {/* Display error message */}
      {error && (
         <div className="text-red-600 bg-red-100 border border-red-400 rounded p-3 text-center mb-4">
            Error: {error}
         </div>
      )}

      {/* Table rendering */}
      {(!isLoading || history.length > 0) && history.length > 0 && ( // Show table if not loading or if already loaded with data
        <TooltipProvider>
          <Table>
            <TableHeader>
              {/* Table Headers */}
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>File 1</TableHead>
                <TableHead>File 2</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Table Rows - Map over history */}
              {history.map((record) => (
                <TableRow key={record.id}>
                   <TableCell>
                     {/* Use record.created_at directly */}
                    {new Date(record.created_at).toLocaleString()}
                  </TableCell>
                  {/* Use correct field names */}
                  <TableCell className="max-w-xs truncate" title={record.file1_name || undefined}>{record.file1_name || "N/A"}</TableCell>
                  <TableCell className="max-w-xs truncate" title={record.file2_name || undefined}>{record.file2_name || "N/A"}</TableCell>
                  <TableCell className="flex items-center justify-end space-x-1">
                    {/* Red Flag Icon */}
                     {record.red_flags && Array.isArray(record.red_flags) && record.red_flags.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 cursor-default" aria-label="Contains Red Flags">
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Contains Red Flags</TooltipContent>
                      </Tooltip>
                    )}
                    {/* Action Buttons */}
                    <Tooltip>
                       <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => handleViewReport(record)} aria-label="View Report Summary"> <Eye className="h-4 w-4" /> </Button></TooltipTrigger>
                       <TooltipContent>View Report Summary</TooltipContent>
                     </Tooltip>
                     <Tooltip>
                       <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => handleSendEmail(record)} aria-label="Email Report"> <Mail className="h-4 w-4" /> </Button></TooltipTrigger>
                       <TooltipContent>Email Report</TooltipContent>
                     </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                           variant="outline"
                           size="icon"
                           onClick={() => handleDownloadPdf(record)}
                           // REMOVE the check for !record.comparison_summary
                           disabled={downloadingId === record.id}
                           aria-label="Download PDF Report">
                          {downloadingId === record.id ? (<Loader2 className="h-4 w-4 animate-spin" />) : (<Download className="h-4 w-4" />)}
                        </Button>
                      </TooltipTrigger>
                      {/* Temporarily adjust tooltip if download is disabled due to missing summary */}
                      <TooltipContent>Download PDF Report</TooltipContent>
                      {/* <TooltipContent>{!record.comparison_summary ? "View report first to enable PDF download" : "Download PDF Report"}</TooltipContent> */}
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
       )}

       {/* Show loading indicator specifically during page changes */}
       {isLoading && history.length > 0 && (
            <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading...</span>
            </div>
        )}


      {/* No history message */}
      {!isLoading && history.length === 0 && !error && (
           <div className="text-center text-gray-500 mt-8">
             No comparison history found. Upload contracts to get started.
           </div>
         )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {/* Simple pagination display - can be enhanced */}
              {[...Array(totalPages)].map((_, i) => {
                 const pageNum = i + 1;
                  // Basic logic to show first, last, current, and adjacent pages
                  const showPage = pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1;
                  const showEllipsis = Math.abs(pageNum - currentPage) === 2 && totalPages > 5;

                   if (showEllipsis) {
                       return <PaginationItem key={`ellipsis-${pageNum < currentPage ? 'start' : 'end'}`}><PaginationEllipsis /></PaginationItem>;
                   }

                   if (showPage) {
                     return (
                       <PaginationItem key={pageNum}>
                         <PaginationLink
                           href="#"
                           onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                           isActive={currentPage === pageNum}
                           aria-current={currentPage === pageNum ? "page" : undefined}
                         >
                           {pageNum}
                         </PaginationLink>
                       </PaginationItem>
                     );
                   }
                   return null; // Don't render pages far from current one if ellipsis is not needed
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                  aria-disabled={currentPage === totalPages}
                   className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}


      {/* Modals (remain unchanged) */}
       {isViewModalOpen && selectedRecordForView && (
        <ViewReportModal
          isOpen={isViewModalOpen}
          onClose={() => { setIsViewModalOpen(false); setSelectedRecordForView(null); }} // Clear selected record on close
          record={selectedRecordForView} // Pass limited data for now
          // Add a prop later to trigger fetch if needed: fetchFullDetailsOnOpen={true}
        />
      )}
       {isEmailModalOpen && selectedRecordForEmail && (
        <SendEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => { setIsEmailModalOpen(false); setSelectedRecordForEmail(null); }} // Clear selected record on close
          record={selectedRecordForEmail} // Pass limited data for now
          // Add a prop later to trigger fetch if needed
        />
      )}
    </div>
  );
};

export default HistoryViewer;