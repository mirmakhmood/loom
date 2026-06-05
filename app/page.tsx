import { CategoryBanners } from "@/app/components/landing/CategoryBanners";
import { ContactSection } from "@/app/components/landing/ContactSection";
import { HeroSection } from "@/app/components/landing/HeroSection";
import { ProductGrid } from "@/app/components/landing/ProductGrid";
import { SiteFooter } from "@/app/components/landing/SiteFooter";
import { SiteNavbar } from "@/app/components/landing/SiteNavbar";
import { StatsBar } from "@/app/components/landing/StatsBar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <ProductGrid />
        <CategoryBanners />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
