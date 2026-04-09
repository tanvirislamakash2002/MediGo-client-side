import { getMedicines } from "@/actions/medicine.action";
import { BestsellingMedicines } from "@/components/modules/home/BestsellingMedicines";
import { FeaturedCategories } from "@/components/modules/home/FeaturedCategories";
import { HealthTips } from "@/components/modules/home/HealthTips";
import { HeroSection } from "@/components/modules/home/HeroSection";
import { HowItWorks } from "@/components/modules/home/HowItWorks";
import { SpecialOffers } from "@/components/modules/home/SpecialOffers";
import { TrustIndicators } from "@/components/modules/home/TrustIndicators";

export default async function Home() {
  
const {data} =  await getMedicines()
  return (
    <main>
      <HeroSection />
      <TrustIndicators />
      <HowItWorks />
      <FeaturedCategories />
      <BestsellingMedicines medicineData = {data} />
      <SpecialOffers />
      <HealthTips />
    </main>
  );
}
