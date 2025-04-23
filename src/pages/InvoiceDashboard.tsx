import { useEffect, useState } from 'react';
import brain from 'brain'; // Import brain client
import { InvoiceResult, LineItem } from 'types'; // Import types
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';



export default function InvoiceDashboard() {
  const [invoices, setInvoices] = useState<InvoiceResult[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await brain.get_invoice_summaries();
        const data = await response.json();
        setInvoices(data.results || []); // Access data via results property
      } catch (err) {
        console.error("Error fetching invoice results:", err);
        // Optionally, show an error message to the user
      }
    };
    loadInvoices();
  }, []);

  const fetchLineItems = async (key: string) => {
    setSelectedKey(key);
    setLineItems([]); // Clear previous items while loading
    try {
      const response = await brain.get_invoice_line_items({ storage_key: key });
      const data = await response.json();
      setLineItems(data.items || []); // Access data via items property
    } catch (err) {
      console.error("Error fetching line items:", err);
       // Optionally, show an error message to the user
    }
  };

  return (
    <div className="p-4 md:p-8"> {/* Added responsive padding */}
      <h1 className="text-2xl font-bold mb-4">Invoice Processing Results</h1>
      <Card> {/* Wrap main table in a card */}
        <CardContent className="p-0"> {/* Remove padding for table */}
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>Storage Key</TableHead>  Removed for cleaner UI */}
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead> {/* Align right */}
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground"> {/* Adjusted colSpan */}
                    No invoices found. Upload invoices to see results here.
                  </TableCell>
                </TableRow>
              )}
              {invoices.map(inv => (
                <TableRow key={inv.storage_key}>
                  {/* <TableCell>{inv.storage_key}</TableCell> */}
                  <TableCell>{inv.vendor_name || 'N/A'}</TableCell> {/* Added fallback */}
                  <TableCell>{inv.invoice_date || 'N/A'}</TableCell> {/* Added fallback */}
                  <TableCell className="text-right">${inv.total_cost?.toFixed(2) ?? '0.00'}</TableCell> {/* Added fallback and alignment */}
                  <TableCell>
                     {/* Added conditional badge styling */}
                    <Badge variant={
                      inv.processing_status === 'Completed' ? 'success' :
                      inv.processing_status === 'Processing' ? 'outline' :
                      inv.processing_status === 'Failed' ? 'destructive' :
                      'secondary'
                    }>
                      {inv.processing_status || 'Unknown'} {/* Added fallback */}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLineItems(inv.storage_key)}
                      disabled={!inv.storage_key || inv.processing_status !== 'Completed'} // Disable if no key or not completed
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedKey && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Line Items for {selectedKey}</h2>
          <Card>
            <CardContent className="p-0"> {/* Remove padding */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead> {/* Align right */}
                    <TableHead className="text-right">Unit Price</TableHead> {/* Align right */}
                    <TableHead className="text-right">Total</TableHead> {/* Align right */}
                    <TableHead>Metadata</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                 {lineItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No line items found for this invoice.
                      </TableCell>
                    </TableRow>
                  )}
                  {lineItems.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity ?? '-'}</TableCell> {/* Added fallback and alignment */}
                      <TableCell className="text-right">${item.unit_price?.toFixed(2) ?? '-'}</TableCell> {/* Added fallback and alignment */}
                      <TableCell className="text-right">${item.total?.toFixed(2) ?? '-'}</TableCell> {/* Added fallback and alignment */}
                      <TableCell className="space-x-1">
                        {item.metadata && Object.entries(item.metadata).map(([k, v]) => (
                          <Badge key={k} variant={k === 'source' && v === 'llm' ? 'destructive' : 'outline'}>
                            {k}: {v}
                          </Badge>
                        ))}
                        {!item.metadata && <span className="text-muted-foreground text-sm">None</span>} {/* Handle no metadata */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
