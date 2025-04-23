import React, { useState } from 'react';
import { toast } from 'sonner';
import brain from 'brain';
import { SendReportEmailRequest } from 'types'; // Use the correct request type

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void; // Changed from onClose for consistency with Dialog
  comparisonId: string | null; // Use comparisonId instead of full record
}

export const SendEmailModal: React.FC<Props> = ({ isOpen, onOpenChange, comparisonId }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state

  const handleSendEmail = async () => {
    if (!comparisonId) {
      toast.error('Cannot send email: Comparison ID is missing.');
      return;
    }
    if (!recipientEmail) { // Check if email is entered
        setError('Please enter a recipient email address.');
        return;
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
        setError('Please enter a valid email address.');
        return;
    }

    setIsSending(true);
    setError(null); // Clear previous errors
    console.log("Sending email to:", recipientEmail, "for comparison ID:", comparisonId);
    toast.info("Sending report email..."); // Update toast message

    // Construct request body for the correct endpoint
    const requestBody: SendReportEmailRequest = {
      comparison_id: comparisonId,
      recipients: [recipientEmail], // Backend expects a list
    };

    try {
       // Ensure brain client method exists
       if (!brain.send_report_email) {
           throw new Error("Brain client method 'send_report_email' not found. Backend changes might not be reflected yet.");
       }
       console.log("Calling brain.send_report_email with body:", requestBody);
       const response = await brain.send_report_email(requestBody);

      // Check response status
      if (!response.ok) {
        let errorMsg = "Failed to send email.";
        try {
            const errorData = await response.json();
            errorMsg = errorData.detail || errorMsg;
        } catch (e) {
             errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      // Success
      console.log("Email API response:", await response.json());
      toast.success(`Report email sent successfully to ${recipientEmail}`);
      setRecipientEmail(""); // Clear field
      onOpenChange(false); // Close modal
    } catch (error: any) {
      console.error("Failed to send report email via API:", error);
      let errorDetails = "Please check the email address and try again.";
      if (error instanceof Error) {
        errorDetails = error.message;
      }
      setError(errorDetails); // Set error state for display
      toast.error("Failed to send email.", {
        description: errorDetails,
      });
    } finally {
      setIsSending(false);
    }
  }; // End of handleSendEmail

  // Reset error when input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientEmail(e.target.value);
    if (error) {
      setError(null);
    }
  };

  // Close handler to reset state
  const handleModalClose = (open: boolean) => {
      if (!open) {
          // Reset state when closing
          setRecipientEmail('');
          setError(null);
          setIsSending(false);
      }
      onOpenChange(open);
  }

  // Early return if no comparisonId is provided
  if (!comparisonId) {
      // Optionally, show a message or log, but returning null prevents rendering
      console.warn("SendEmailModal rendered without comparisonId");
      return null;
  }

  // Main component render
  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Email Comparison Report</DialogTitle>
          <DialogDescription>
            Enter the recipient's email address to send a link to this report.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipient-email" className="text-right">
              Recipient Email
            </Label>
            <Input
              id="recipient-email"
              type="email"
              value={recipientEmail}
              onChange={handleEmailChange} // Use handler to clear error
              className={`col-span-3 ${error ? 'border-red-500' : ''}`} // Highlight input on error
              placeholder="recipient@example.com"
              disabled={isSending}
            />
          </div>
          {error && (
            <div className="col-span-4 px-1">
             <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleModalClose(false)} disabled={isSending}>Cancel</Button>
          <Button type="button" onClick={handleSendEmail} disabled={isSending || !recipientEmail}>
            {isSending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
            ) : (
              "Send Email"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; // End of SendEmailModal component