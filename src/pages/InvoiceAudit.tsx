import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, Loader2 } from "lucide-react"; // Added Loader2
import brain from "brain"; // Import brain client
import { BodyUploadInvoices, UploadInvoicesData } from "types"; // Import types
import { toast } from "sonner"; // Import toast for feedback (used in PLA-66)
import { API_URL, mode, Mode } from "app"; // Import API_URL and mode

export default function InvoiceAudit() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [uploadResult, setUploadResult] = useState<UploadInvoicesData | null>(null); // To store result (for PLA-66)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadResult(null); // Clear previous result on new file selection
    }
  };

  const handleUploadClick = async () => { // Made async
    if (!selectedFile) {
      toast.error("No file selected for upload.");
      return;
    }

    setIsLoading(true);
    setUploadResult(null); // Clear previous results

    const formData = new FormData();
    formData.append("files", selectedFile); // Key MUST be "files"

    try {
      // Use fetch directly for file upload
      const response = await fetch(`${API_URL}/upload-invoices`, { // Corrected path
        method: "POST",
        body: formData,
        // DO NOT set Content-Type header manually for FormData
        // The browser will set it correctly, including the boundary
        credentials: mode === Mode.DEV ? "include" : "same-origin", // Include credentials in development
      });

      if (!response.ok) {
        // Handle HTTP errors (e.g., 4xx, 5xx)
        const errorData = await response.text(); // Try to get error text
        console.error("Upload failed:", response.status, errorData);
        toast.error("Invoice upload failed.", {
            description: `Server responded with status ${response.status}. ${errorData || ''}`,
        });
        setUploadResult(null); // Ensure no stale results
      } else {
        const data: UploadInvoicesData = await response.json();
        console.log("Upload successful:", data);
        setUploadResult(data); // Store result

        // Trigger processing task for each uploaded file
        if (data.storage_keys && data.storage_keys.length > 0) {
          try {
            for (const key of data.storage_keys) {
              console.log(`Creating extraction task for key: ${key}`);
              await brain.create_invoice_extraction_task({ storage_key: key });
              console.log(`Task created successfully for key: ${key}`);
            }
            // Keep the original success toast after attempting task creation
            toast.success("Invoice uploaded successfully!", {
                description: `Processing started for ${data.storage_keys.length} file(s). Check dashboard later.`
            });
          } catch (taskError: any) {
            console.error("Error creating extraction task(s):", taskError);
            // Show a warning if task creation failed, but upload succeeded
            toast.warning("Upload succeeded, but failed to start processing.", {
              description: taskError.message || "Please check console or try processing manually later.",
            });
          }
        } else {
           // Still show success if upload worked but no keys returned (unlikely)
           toast.success("Invoice uploaded successfully!");
        }

        setSelectedFile(null); // Clear selection after successful upload and task attempt
      }
    } catch (error: any) {
      console.error("An error occurred during upload:", error);
      toast.error("An unexpected error occurred during upload.", {
          description: error.message || "Please check the console for details.",
      });
      setUploadResult(null); // Ensure no stale results
    } finally {
      setIsLoading(false);
    }
  };

  // Basic drag-and-drop handlers (optional, can enhance later)
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
      setUploadResult(null); // Clear previous result
    }
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Invoice Audit</h1>
      <Card
        className={`border-2 border-dashed ${isDragging ? 'border-primary bg-muted/50' : 'border-border'} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardHeader className="text-center">
          {isLoading ? (
             <Loader2 className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />
          ) : (
             <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
          )}
          <CardTitle className="mt-2">Upload Your Invoice</CardTitle>
          <CardDescription>Drag & drop a PDF file here, or click to select</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Input
            id="invoice-upload"
            type="file"
            accept=".pdf" // Limit to PDF files
            onChange={handleFileChange}
            className="hidden" // Hide default input, use label as trigger
            disabled={isLoading} // Disable while loading
          />
          <label
            htmlFor="invoice-upload"
            className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            Select File
          </label>

          {selectedFile && !isLoading && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{selectedFile.name}</span>
            </div>
          )}

          <Button
            onClick={handleUploadClick}
            disabled={!selectedFile || isLoading} // Disable if no file or loading
            className="mt-4 w-40" // Give button fixed width
            aria-label="Upload selected invoice"
          >
             {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
             ) : (
                "Upload Invoice"
             )}
          </Button>
        </CardContent>
      </Card>

      {/* Area to display upload status or results (TODO PLA-66) */}
      {/* We are already showing toasts for feedback */}

      {/* Display result from the last successful upload */}
      {uploadResult && uploadResult.storage_keys && uploadResult.storage_keys.length > 0 && (
        <div className="mt-6 p-4 border rounded-md bg-green-50 border-green-200 text-green-800">
          <h3 className="text-lg font-medium mb-2">Upload Successful</h3>
          <p className="text-sm">File saved with storage key(s):</p>
          <ul className="list-disc list-inside text-sm">
            {uploadResult.storage_keys.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
           <p className="text-xs mt-2 text-green-600">Processing has started. You can monitor progress or view results on the Invoice Dashboard.</p>
        </div>
      )}
       {/* Optional: Could add a similar box for persistent error display if needed */}
    </div>
  );
}