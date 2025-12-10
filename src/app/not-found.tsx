"use client";

import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowLeft,
  Home,
  Compass,
  Sparkles,
  Navigation,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Blue Bubbles */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-float-slow rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 opacity-20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-float-medium rounded-full bg-gradient-to-r from-indigo-200 to-blue-200 opacity-15 blur-3xl" />
        <div className="absolute top-3/4 left-1/3 h-48 w-48 animate-float-fast rounded-full bg-gradient-to-r from-sky-200 to-blue-100 opacity-25 blur-3xl" />

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f9ff_1px,transparent_1px),linear-gradient(to_bottom,#f0f9ff_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 animate-pulse rounded-full bg-blue-300"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center">
        {/* Animated 404 Display */}
        <div className="relative mb-12">
          {/* Glowing Orb Effect */}
          <div className="absolute inset-0 mx-auto h-48 w-48 animate-pulse-slow rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 blur-3xl" />

          {/* 404 Text with 3D Effect */}
          <div className="relative">
            <h1 className="text-9xl font-black tracking-tighter text-blue-900/10 sm:text-[12rem]">
              404
            </h1>
            <h1 className="absolute inset-0 animate-gradient-x bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 bg-clip-text text-9xl font-black tracking-tighter text-transparent sm:text-[12rem]">
              404
            </h1>

            {/* Floating Icons around 404 */}
            <Compass className="absolute -top-4 -left-4 h-12 w-12 animate-bounce-slow text-blue-400" />
            <Navigation className="absolute -top-4 -right-4 h-12 w-12 animate-bounce-medium text-cyan-400" />
            <Sparkles className="absolute -bottom-4 -left-8 h-10 w-10 animate-pulse text-sky-300" />
            <AlertCircle className="absolute -bottom-4 -right-8 h-10 w-10 animate-spin-slow text-blue-300" />
          </div>
        </div>

        {/* Message Section */}
        <div className="mb-12 space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-blue-100 px-6 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-700">
              Oops! Navigation Error
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Lost in the Digital Sea?
          </h2>

          <div className="mx-auto max-w-2xl">
            <p className="text-lg leading-relaxed text-gray-600">
              The page you&apos;re looking for seems to have sailed away.
              Don&apos;t worry though – even the best explorers sometimes take a
              wrong turn in the digital ocean.
            </p>
          </div>

          {/* Stats Bubble */}
          <div className="mx-auto flex max-w-md items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent" />
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-500">Pages</div>
            </div>
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent" />
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0s</div>
              <div className="text-sm text-gray-500">Delay</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={() => router.back()}
            variant="outline"
            className="group relative h-14 gap-3 overflow-hidden rounded-xl border-2 border-blue-200 bg-white px-8 text-blue-700 shadow-lg shadow-blue-100 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:shadow-xl hover:shadow-blue-200"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-base font-semibold">Go Back</span>
          </Button>

          <Button
            size="lg"
            className="group relative h-14 gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 px-8 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:via-cyan-600 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40"
          >
            <Link href="/">
              <Home className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="text-base font-semibold">Home Port</span>
              <Sparkles className="absolute -right-2 -top-2 h-6 w-6 animate-pulse text-white/50" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="primary"
            className="group h-14 gap-3 rounded-xl border-2 border-dashed border-blue-200 px-8 text-blue-600 transition-all duration-300 hover:border-solid hover:bg-blue-50 hover:text-blue-700"
          >
            <Link href="/explore">
              <Compass className="h-5 w-5 transition-transform group-hover:rotate-90" />
              <span className="text-base font-semibold">Explore Tours</span>
            </Link>
          </Button>
        </div>

        {/* Fun Facts */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-white to-blue-50/50 p-6 shadow-inner">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-500">
            💡 Did You Know?
          </h3>
          <div className="text-sm text-gray-600">
            This 404 page has more visitors than some small island nations!
            While you're here, why not check out our amazing tours instead?
          </div>
        </div>

        {/* Wave Divider */}
        <div className="relative mt-12">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
          <div className="absolute inset-x-0 top-2 h-2 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-50" />
        </div>
      </div>

      {/* Bottom Navigation Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="animate-pulse">↓</span>
          <span>Scroll to see navigation menu</span>
          <span className="animate-pulse">↓</span>
        </div>
      </div>

      {/* Add these styles to your global CSS */}
      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(10px) translateX(-20px);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(15px);
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-medium {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 8s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-bounce-medium {
          animation: bounce-medium 2.5s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
