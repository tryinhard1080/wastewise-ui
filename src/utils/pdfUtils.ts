
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Converts an HTML string into a PDF Blob.
 * Uses html2canvas to render the HTML and jsPDF to create the PDF.
 * @param htmlContent - The HTML string to convert.
 * @returns A Promise resolving to a Blob, or null if an error occurs.
 */
export const generatePdfFromHtml = async (htmlContent: string): Promise<Blob | null> => {
  console.log("Generating PDF from HTML...");

  // Create a temporary, off-screen element to render the HTML
  const container = document.createElement('div');
  // Set explicit width for rendering; adjust as needed for desired PDF layout
  container.style.width = '800px'; // A standard page width-ish
  container.style.position = 'absolute';
  container.style.left = '-9999px'; // Position off-screen
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    // Use html2canvas to capture the container as a canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Increase scale for better resolution
      useCORS: true, // Enable cross-origin images if needed
      logging: true, // Enable logging for debugging
    });
    console.log("html2canvas rendering complete.");

    // Get canvas dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create jsPDF instance (A4 size, mm units, portrait)
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add the canvas image to the PDF, handling multiple pages if necessary
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    console.log("jsPDF generation complete.");

    // Generate the PDF as a Blob
    const pdfBlob = pdf.output('blob');
    console.log("PDF Blob generated successfully.");
    return pdfBlob;

  } catch (error) {
    console.error("Error generating PDF:", error);
    return null; // Return null on error
  } finally {
    // Clean up the temporary container
    document.body.removeChild(container);
    console.log("Temporary HTML container removed.");
  }
};