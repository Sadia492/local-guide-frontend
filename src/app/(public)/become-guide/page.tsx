import BenefitsSection from "@/components/modules/BecomeGuide/BenefitsSection";
import CTASection from "@/components/modules/BecomeGuide/CTASection";
import FAQSection from "@/components/modules/BecomeGuide/FAQSection";
import GuideStatsSection from "@/components/modules/BecomeGuide/GuideStatsSection";
import HowItWorksSection from "@/components/modules/BecomeGuide/HowItWorksSection";
import ReadyToStartSection from "@/components/modules/BecomeGuide/ReadyToStartSection";
import RequirementsSection from "@/components/modules/BecomeGuide/RequirementsSection";
import SuccessStoriesSection from "@/components/modules/BecomeGuide/SuccessStoriesSection";
import {
  CheckCircle,
  Star,
  Users,
  DollarSign,
  Globe,
  Award,
  Shield,
  Heart,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Become a Local Guide | Share Your Passion & Earn",
  description:
    "Join our community of passionate local guides. Share your knowledge, meet amazing people, and earn money doing what you love.",
};

export default function BecomeAGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Become a Local Guide
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Share your passion, meet amazing people, and earn money doing what
              you love
            </p>

            <GuideStatsSection />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HowItWorksSection />

        <BenefitsSection />

        <RequirementsSection />

        <SuccessStoriesSection />

        <ReadyToStartSection />

        <FAQSection />

        <CTASection />
      </div>
    </div>
  );
}
