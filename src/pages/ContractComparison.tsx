import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import brain from "brain";
import { FullComparisonRecord } from "types"; // Import the response type

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // Import Button
import { Download, Mail } from "lucide-react"; // Import Download & Mail icons
import { AlertCircle } from "lucide-react";

// Import PDF generation libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Import the modal component
import { SendEmailModal } from 'components/SendEmailModal';

const ContractComparison: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [comparison, setComparison] = useState<FullComparisonRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false); // State for PDF generation
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false); // State for email modal

  useEffect(() => {
    const comparisonId = searchParams.get("id");

    if (!comparisonId) {
      setError("No comparison ID provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchComparisonDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await brain.get_comparison_details({ recordId: comparisonId });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Failed to fetch comparison details (Status: ${response.status})`);
        }

        const data: FullComparisonRecord = await response.json();
        setComparison(data);
      } catch (err: any) {
        console.error("Error fetching comparison details:", err);
        setError(err.message || "An unknown error occurred while fetching comparison details.");
        toast.error("Error fetching details", { description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonDetails();
  }, [searchParams]);

  // Function to handle PDF download
  const handleDownloadPdf = async () => {
    if (!comparison || isGeneratingPdf) return;

    const reportElement = document.getElementById('comparison-report-content');
    if (!reportElement) {
      toast.error("Could not find report content to export.");
      return;
    }

    setIsGeneratingPdf(true);
    toast.info("Generating PDF, please wait...");

    try {
      // Use html2canvas to capture the content
      // Ensure background is white for canvas capture if needed
      reportElement.style.backgroundColor = 'white'; // Temporarily set background
      const canvas = await html2canvas(reportElement, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // If there are external images/resources
        logging: false, // Disable logging to console
        backgroundColor: null, // Use element's background
      });
      reportElement.style.backgroundColor = ''; // Reset background

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'p', // portrait
        unit: 'pt', // points
        format: 'a4', // A4 page size
      });

      // Calculate image dimensions to fit A4 width with margin
      const pageMargin = 40;
      const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * pageMargin;
      const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * pageMargin;
      const imgProps = pdf.getImageProperties(canvas);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let currentHeight = 0;
      let pageIndex = 0;

      // Add pages as needed
      while (currentHeight < imgHeight) {
        if (pageIndex > 0) {
          pdf.addPage();
        }
        // Calculate the height of the portion to draw on the current page
        const drawHeight = Math.min(imgHeight - currentHeight, pdfHeight);

        // Add the image portion to the current page
        // Use canvas directly to avoid data URL length issues
        pdf.addImage(
            canvas,
            'PNG',
            pageMargin, // x
            pageMargin - currentHeight, // y (negative offset for subsequent pages)
            imgWidth, // width
            imgHeight, // height
            undefined,
            'FAST' // Compression
        );

        currentHeight += pdfHeight;
        pageIndex++;
      }

      // Generate filename
      const file1 = comparison.file1_name?.split('.')[0] || "Contract1";
      const file2 = comparison.file2_name?.split('.')[0] || "Contract2";
      const filename = `WasteWise_Comparison_${file1}_vs_${file2}.pdf`;

      // Save the PDF
      pdf.save(filename);
      toast.success("PDF downloaded successfully!");

    } catch (err: any) {
      console.error("Error generating PDF:", err);
      toast.error("Failed to generate PDF", { description: err.message });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter>
             <Skeleton className="h-6 w-1/4" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!comparison) {
     // Should ideally not happen if loading is false and no error, but good practice
    return (
        <div className="container mx-auto p-4">
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Data</AlertTitle>
                <AlertDescription>No comparison data found.</AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
           <div className="flex justify-between items-start mb-2">
              <div>
                  <CardTitle>Contract Comparison Report</CardTitle>
                  <CardDescription>
                    Comparing: {comparison.file1_name || "File 1"}
                    {comparison.file2_name ? ` vs ${comparison.file2_name}` : " (Single Review)"}
                    <br />
                    <span className="text-sm text-muted-foreground">
                        Generated on: {new Date(comparison.created_at).toLocaleString()}
                    </span>
                  </CardDescription>
              </div>
              <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf || !comparison}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isGeneratingPdf ? "Generating..." : "Download PDF"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEmailModalOpen(true)}
                  disabled={!comparison} // Disable if no comparison data
                >
                  <Mail className="mr-2 h-4 w-4" />
                   Email Report
                </Button>
              </div>
          </div>
        </CardHeader>
        {/* Wrap content sections for potential export */}
        <div id="comparison-report-content">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            {comparison.comparison_summary ? (
              <div className="prose dark:prose-invert max-w-none"> {/* Apply prose for markdown styling */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {comparison.comparison_summary}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground">No summary available.</p>
            )}
          </CardContent>

          <Separator className="my-4" />

          {/* Metadata Section */}
          <CardContent>
             <h3 className="text-lg font-semibold mb-2">Metadata</h3>
             <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
               <div className="sm:col-span-1">
                 <dt className="text-sm font-medium text-muted-foreground">Line Items Extracted</dt>
                 <dd className="mt-1 text-sm text-foreground">{comparison.line_items?.length || 0}</dd>
               </div>
               {/* Add more metadata fields here if available/needed */}
             </dl>
          </CardContent>

          <Separator className="my-4" />

          <CardFooter className="flex flex-col items-start gap-2">
            <h4 className="text-md font-semibold mb-1">Red Flags</h4>
            <div className="flex flex-wrap gap-2">
              {comparison.red_flags && comparison.red_flags.length > 0 ? (
                comparison.red_flags.map((flag, index) => (
                  <Badge key={index} variant="destructive">
                    {flag}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No red flags identified.</p>
              )}
            </div>
          </CardFooter>
        </div>
      </Card>

      {/* Render the Email Modal */}
      <SendEmailModal
        isOpen={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        comparisonId={comparison?.id || null}
      />
    </div>
  );
};

export default ContractComparison;
