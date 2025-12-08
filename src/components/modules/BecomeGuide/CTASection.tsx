"use client";

import Link from "next/link";

export default function CTASection() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="text-center">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Start Your Journey Today
        </h2>
        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Join thousands of guides who are sharing their passion and earning
          money
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleScrollToTop}
            className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all"
          >
            Apply Now
          </button>
          <Link href="/contact">
            <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-all">
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
