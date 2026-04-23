import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
