import { MapPin, Globe, Shield, Users } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Discover Local Experiences",
    description:
      "Find unique tours and activities led by passionate local guides.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Connect with Guides",
    description: "Meet knowledgeable locals who love sharing their culture.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Trusted",
    description: "Verified guides and secure payments for peace of mind.",
  },
];

export default function LoginHero() {
  return (
    <div className="flex-1 max-w-md">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/" className="flex items-center space-x-2 mb-6">
          <MapPin className="w-12 h-12 text-blue-600" />
          <span className="text-4xl font-bold text-gray-900">LocalGuide</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back</h1>
        <p className="text-gray-600 text-lg">
          Sign in to continue exploring amazing local experiences or manage your
          guide profile.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-6 mt-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-12 p-6 bg-white/50 rounded-xl backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">10K+</div>
            <div className="text-sm text-gray-600">Happy Travelers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">500+</div>
            <div className="text-sm text-gray-600">Local Guides</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">50+</div>
            <div className="text-sm text-gray-600">Cities</div>
          </div>
        </div>
      </div>
    </div>
  );
}
