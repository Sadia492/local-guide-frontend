import { BecomeGuide } from "@/components/modules/Home/BecomeGuide";
import { Categories } from "@/components/modules/Home/Categories";
import { FeaturedCities } from "@/components/modules/Home/FeaturedCitites";
import { Hero } from "@/components/modules/Home/Hero";
import { HowItWorks } from "@/components/modules/Home/HowItWorks";
import { Testimonials } from "@/components/modules/Home/Testimonials";
import { TopGuides } from "@/components/modules/Home/TopGuides";
import { WhyChooseUs } from "@/components/modules/Home/WhyChooseUs";

export const metadata = {
  title: "Home | My Portfolio",
};

export default function HomePage() {
  return (
    <div>
      <Hero></Hero>
      <HowItWorks></HowItWorks>
      <FeaturedCities></FeaturedCities>
      <Categories></Categories>
      <TopGuides></TopGuides>
      <WhyChooseUs></WhyChooseUs>
      <Testimonials></Testimonials>
      <BecomeGuide></BecomeGuide>
    </div>
  );
}
