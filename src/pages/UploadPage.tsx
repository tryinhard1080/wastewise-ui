import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDropzone, Accept } from 'react-dropzone';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { UploadCloud, X, FileText } from 'lucide-react';

import { API_URL } from 'app'; // Import API_URL
import { FileUploadResponse } from 'types'; // Import response type

const UploadPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [files, setFiles] = useState<File[]>([]);
  const [analysisType, setAnalysisType] = useState<string>('compare'); // Default to compare
  const [isUploading, setIsUploading] = useState(false);


  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((err: any) => {
          toast.error(`Error with ${file.name}: ${err.message}`);
        });
      });
    }

    // Only accept up to 2 files total
    const combinedFiles = [...files, ...acceptedFiles];
    if (combinedFiles.length > 2) {
        toast.warning('You can only upload a maximum of 2 files.');
        setFiles(combinedFiles.slice(0, 2)); // Keep only the first two
    } else {
        setFiles(combinedFiles);
    }

  }, [files]);

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const acceptedFileTypes: Accept = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 2, // Although handled in onDrop, good to have here too
    multiple: true,
  });

  // };

  const handleAnalysis = async () => { // <-- Make the function async
    // 1. Validate input
    if (files.length === 0) {
        toast.error("Please select at least one file.");
        return;
    }
    if (analysisType === 'compare' && files.length !== 2) {
        toast.error("Comparison requires exactly two files.");
        return;
    }
    // Add validation for other analysis types if they exist later

    setIsUploading(true);
    toast.info('Uploading files...');

    // 2. Prepare FormData
    const formData = new FormData();
    files.forEach((file) => {
      // The backend expects a list of files under the key 'files'
      formData.append('files', file, file.name);
    });

    // 3. Call backend endpoint
    try {
        // Use fetch directly for FormData upload as brain client might have issues
        const response = await fetch(`${API_URL}/analysis/start-comparison`, {
          method: 'POST',
          body: formData,
          credentials: 'include', // Important for dev environment auth
        });

        const result = await response.json(); // Always try to parse JSON

        if (!response.ok) {
            // Use detail from JSON if available, otherwise use status text
            const errorDetail = result?.detail || response.statusText || "Unknown upload error";
            throw new Error(`Upload failed: ${response.status} - ${errorDetail}`);
        }

        // Assuming FileUploadResponse is the expected structure on success
        const uploadResult: FileUploadResponse = result;

        console.log("Upload successful:", uploadResult);
        toast.success(uploadResult.message || "Files processed successfully!");

        // Check for comparison ID and redirect
        if (uploadResult.comparison_id) {
          toast.info("Redirecting to comparison results...");
          navigate(`/ContractComparison?id=${uploadResult.comparison_id}`);
        } else {
          // Handle cases where comparison didn't run 
          console.warn("Comparison ID not found in response.", uploadResult);
          setFiles([]); // Clear files if no comparison happened
        }

    } catch (err: any) {
        console.error("Upload failed:", err);
        toast.error("Upload Failed", { description: err.message });
    } finally {
        setIsUploading(false);
    }
  };

  const canCompare = files.length === 2;
  // If analysis is 'compare' but only 1 file, force change or disable submit?
  // For now, disable compare option if only 1 file
  // Let's reset analysis type if files change and compare is no longer possible
  React.useEffect(() => {
    if (analysisType === 'compare' && files.length < 2) {
      // If compare was selected but no longer possible, default to something else
      // Or just disable the submit button, which is simpler for now.
      // setAnalysisType(''); // Example: Reset if other types exist
    }
  }, [files, analysisType]);

  return (
    <div className="container mx-auto p-4 flex justify-center items-start pt-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload one or two contract documents (PDF or DOCX) for analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/50 hover:border-primary'}`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-primary font-semibold">Drop the files here ...</p>
            ) : (
              <p className="text-muted-foreground">Drag 'n' drop files here, or click to select files</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Maximum 2 files (PDF, DOCX)</p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Selected Files:</h4>
              <ul className="list-none p-0 m-0 space-y-1">
                {files.map((file) => (
                  <li key={file.name} className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm">
                    <div className="flex items-center space-x-2 overflow-hidden">
                        <FileText className="h-4 w-4 flex-shrink-0"/>
                        <span className="truncate" title={file.name}>{file.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.name)} className="p-1 h-auto">
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Analysis Type Selection */}
          {files.length > 0 && (
              <div className="space-y-2">
                  <Label>Select Analysis Type:</Label>
                   <RadioGroup 
                        value={analysisType}
                        onValueChange={setAnalysisType} 
                        className="flex items-center space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                                value="compare" 
                                id="r-compare" 
                                disabled={!canCompare} // Disable if not exactly 2 files
                            />
                            <Label htmlFor="r-compare" className={!canCompare ? 'text-muted-foreground cursor-not-allowed' : ''}>
                                Compare Contracts (Requires 2 files)
                            </Label>
                        </div>
                        {/* Add other analysis types here later as RadioGroupItems */}
                        {/* Example: 
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="summarize" id="r-summarize" />
                            <Label htmlFor="r-summarize">Summarize Document</Label>
                        </div>
                        */}
                   </RadioGroup>
                   {!canCompare && analysisType === 'compare' && (
                       <p className="text-xs text-destructive">Comparison requires exactly 2 files.</p>
                   )}
              </div>
          )}

        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleAnalysis}
            disabled={isUploading || files.length === 0 || (analysisType === 'compare' && !canCompare)}
          >
            {isUploading ? 'Analyzing...' : 'Start Analysis'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadPage;
