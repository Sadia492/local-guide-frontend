const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Sign up and complete your guide profile with photos and bio",
  },
  {
    number: "02",
    title: "Design Your Tours",
    description: "Create unique tour experiences that showcase your expertise",
  },
  {
    number: "03",
    title: "Get Verified",
    description:
      "Complete our verification process to build trust with travelers",
  },
  {
    number: "04",
    title: "Start Earning",
    description: "Accept bookings and share amazing experiences while earning",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
              {step.number}
            </div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-blue-200 transform translate-x-8"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
