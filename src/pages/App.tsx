
import { Link, NavLink } from "react-router-dom"; // Use NavLink for active styling
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, BarChart, FileDiff, Scale, Search, Twitter, Linkedin, Facebook } from "lucide-react";

// Placeholder components (replace with actual or remove)
const PlaceholderLogo = () => <div className="h-8 w-24 bg-muted rounded text-center leading-8">Logo</div>;
const PlaceholderIcon = ({ className = "" }) => <div className={`h-12 w-12 bg-muted rounded-full ${className}`}></div>;
const PlaceholderAvatar = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
);

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <PlaceholderLogo />
              <span className="hidden font-bold sm:inline-block">WasteWise</span>
            </Link>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-6 text-sm font-medium">
            <NavLink to="/contract-comparison" className={({ isActive }) => isActive ? "text-primary transition-colors hover:text-primary/80" : "text-muted-foreground transition-colors hover:text-foreground/80"}>Contract Comparison</NavLink>
            <NavLink to="/invoice-audit" className={({ isActive }) => isActive ? "text-primary transition-colors hover:text-primary/80" : "text-muted-foreground transition-colors hover:text-foreground/80"}>Invoice Audit</NavLink>
            <NavLink to="/red-flag-visualizer" className={({ isActive }) => isActive ? "text-primary transition-colors hover:text-primary/80" : "text-muted-foreground transition-colors hover:text-foreground/80"}>Insights</NavLink> {/* Updated Red Flags to Insights, kept link */} 
            <NavLink to="/dashboard-summary" className={({ isActive }) => isActive ? "text-primary transition-colors hover:text-primary/80" : "text-muted-foreground transition-colors hover:text-foreground/80"}>Dashboard</NavLink>
            <NavLink to="/invoice-dashboard" className={({ isActive }) => isActive ? "text-primary transition-colors hover:text-primary/80" : "text-muted-foreground transition-colors hover:text-foreground/80"}>Invoice Dashboard</NavLink> {/* Added Invoice Dashboard Link */}
            <NavLink to="/history-viewer" className={({ isActive }) => isActive ? "text-primary transition-colors hover:text-primary/80" : "text-muted-foreground transition-colors hover:text-foreground/80"}>History</NavLink> {/* Added History Link */}
            <Button size="sm">Upload Contract</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Simplify Your Waste Management Contracts
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Analyze, compare, and audit with AI-powered precision.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg">Get Started</Button>
                <Button variant="outline" size="lg">Learn More</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Unlock savings and manage risks with powerful AI tools designed for multifamily property owners.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-col items-center text-center gap-4 pb-4">
                  <PlaceholderIcon />
                  <CardTitle>Contract Comparison</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Identify discrepancies between contracts effortlessly.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center gap-4 pb-4">
                  <PlaceholderIcon />
                  <CardTitle>Invoice Audit</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Ensure billing accuracy with automated checks.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center text-center gap-4 pb-4">
                  <PlaceholderIcon />
                  <CardTitle>Red Flag Visualizer</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">Spot potential issues before they escalate.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section (Placeholder) */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Trusted by Property Managers</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See what our clients are saying about WasteWise.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
              {/* Placeholder Testimonial Cards - Replace with Carousel or actual data */}
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 text-left">
                  <CardContent className="flex flex-col items-start gap-4 p-0">
                     <p className="italic">"WasteWise saved us thousands on our hauling contracts! The comparison tool is incredibly insightful."</p>
                     <div className="flex items-center gap-3 pt-2">
                      <PlaceholderAvatar />
                      <div>
                        <p className="font-semibold">Jane Doe</p>
                        <p className="text-xs text-muted-foreground">Property Manager, XYZ Realty</p>
                      </div>
                     </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 md:px-8 md:py-8 border-t bg-muted">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} WasteWise. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
             <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
             <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
             <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link>
          </div>
          <div className="flex items-center space-x-3">
            {/* Placeholder Social Icons - Replace with actual icons/links */}
            <a href="#" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground"><Linkedin className="h-5 w-5" /></a>
            <a href="#" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground"><Twitter className="h-5 w-5" /></a>
            <a href="#" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground"><Facebook className="h-5 w-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
