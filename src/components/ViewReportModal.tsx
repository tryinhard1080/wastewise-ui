import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ComparisonRecord } from "types"; // Ensure path is correct
import { generateComparisonHtml, generatePdfFromHtml } from "utils/reportUtils"; // Import PDF generation
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import brain from "brain"; // Import brain if needed for fetching details
import { ScrollArea } from "@/components/ui/scroll-area";
import LineItemTable from "components/LineItemTable"; // Import the new component

interface Props {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
  /** The comparison record data to display in the modal */
  record: ComparisonRecord | null;
}

const ViewReportModal: React.FC<Props> = ({ isOpen, onClose, record }) => {
  if (!record) {
    return null;
  }

  // Generate the report HTML using the utility function and memoize it
  const reportHtml = useMemo(() => {
    if (!record) return ""; // Handle null record case
    return generateComparisonHtml(record);
  }, [record]);

  // If HTML generation fails or the record is null initially
  if (!reportHtml && record) {
      // Handle case where HTML generation might fail, though unlikely with current util
      // Could show an error message within the modal content area
      // For now, let's assume generateComparisonHtml always returns a string
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh]"> {/* Increased width, set max height */}
        <DialogHeader>
          <DialogTitle>Comparison Report Summary</DialogTitle>
          <DialogDescription>
            Summary for: {record.file1_name || "File 1"} vs {record.file2_name || "File 2"}
            <br />
            Generated on: {new Date(record.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        {/* Replace with HTML-rendered report */}
        <div className="prose dark:prose-invert max-w-none max-h-[60vh] overflow-y-auto p-4" dangerouslySetInnerHTML={{ __html: reportHtml }} />

        {/* Conditionally render LineItemTable if line_items exist */}
        {record?.line_items && record.line_items.length > 0 && (
          <div className="mt-6 p-4 border-t border-border">
            <h3 className="text-lg font-semibold mb-3">Extracted Line Items</h3>
            <LineItemTable lineItems={record.line_items} /> {/* Using the correct prop name 'lineItems' */}
          </div>
        )}

        <DialogFooter className="p-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportModal;
