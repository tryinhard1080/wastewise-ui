import React from 'react';

export default function ContactUs() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-muted-foreground mb-4">
        This is the placeholder page for Contact Us information.
      </p>
      {/* Future content for contact form or details will go here */}
      <div className="space-y-2">
        <p>For inquiries, please reach out via:</p>
        <p><strong>Email:</strong> support@wastewise.app (Placeholder)</p>
        <p><strong>Phone:</strong> +1 (555) 123-4567 (Placeholder)</p>
      </div>
    </div>
  );
}
