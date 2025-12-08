import { CheckCircle } from "lucide-react";

const requirements = [
  "At least 18 years old",
  "Good knowledge of your city/region",
  "Passion for sharing your culture",
  "Good communication skills",
  "Valid government ID",
  "Bank account for payments",
];

export default function RequirementsSection() {
  return (
    <section className="mb-20">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Requirements to Get Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {requirements.map((requirement, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <span className="text-lg">{requirement}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
