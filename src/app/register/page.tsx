"use client";
import React, { useState } from "react";
import {
  MapPin,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Globe,
  Map,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/actions/useAuth";

function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cityError, setCityError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "tourist", // Default role
    bio: "",
    languages: [] as string[],
    expertise: [] as string[], // For guides
    dailyRate: "", // For guides
    city: "", // For guides - IMPORTANT
    travelPreferences: [] as string[], // For tourists
  });

  // Language options
  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Japanese",
    "Chinese",
  ];

  // Expertise options for guides
  const expertiseOptions = [
    "History",
    "Food",
    "Art",
    "Nightlife",
    "Adventure",
    "Shopping",
    "Nature",
    "Photography",
  ];

  // Travel preference options for tourists
  const preferenceOptions = [
    "Cultural",
    "Adventure",
    "Food",
    "Relaxation",
    "Shopping",
    "Historical",
    "Nature",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCityError("");
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // Guide-specific validation
    if (formData.role === "guide" && !formData.city) {
      setCityError("City is required for guides");
      setLoading(false);
      return;
    }

    // Prepare data based on role
    const userData: any = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role.toUpperCase(), // Convert to uppercase (TOURIST/GUIDE)
    };

    // Add optional fields if provided
    if (formData.bio) userData.bio = formData.bio;
    if (formData.languages.length > 0) userData.languages = formData.languages;

    // Add role-specific fields
    if (formData.role === "guide") {
      if (formData.expertise.length > 0)
        userData.expertise = formData.expertise;
      if (formData.dailyRate) userData.dailyRate = Number(formData.dailyRate);
      if (formData.city) userData.city = formData.city; // REQUIRED for guides
    } else if (formData.role === "tourist") {
      if (formData.travelPreferences.length > 0)
        userData.travelPreferences = formData.travelPreferences;
    }

    console.log("Registering user:", userData);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include", // IMPORTANT: For cookies
        }
      );

      const data = await res.json();
      console.log("Registration response:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      // Registration successful - now handle auto-login
      console.log("Registration successful!", data);

      // Store tokens if provided in response body
      if (data.data?.accessToken) {
        // Store in localStorage (or you can set cookies)
        localStorage.setItem("accessToken", data.data.accessToken);
        if (data.data.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }

        // Store user info
        if (data.data.user) {
          localStorage.setItem("user", JSON.stringify(data.data.user));

          // Update auth state by calling login
          const loginSuccess = await login(formData.email, formData.password);

          if (loginSuccess) {
            // Redirect based on role
            const role = data.data.user.role || formData.role;

            if (role === "GUIDE" || role === "guide") {
              router.push("/dashboard/guide");
            } else if (role === "ADMIN" || role === "admin") {
              router.push("/dashboard/admin");
            } else {
              router.push("/dashboard/tourist");
            }

            // Force refresh
            router.refresh();
          } else {
            // If auto-login fails, redirect to login page
            router.push(
              `/login?registered=true&email=${encodeURIComponent(
                formData.email
              )}`
            );
          }
        }
      } else {
        // If no tokens in response, redirect to login
        router.push(
          `/login?registered=true&email=${encodeURIComponent(formData.email)}`
        );
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleExpertiseToggle = (expertise: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter((e) => e !== expertise)
        : [...prev.expertise, expertise],
    }));
  };

  const handlePreferenceToggle = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      travelPreferences: prev.travelPreferences.includes(preference)
        ? prev.travelPreferences.filter((p) => p !== preference)
        : [...prev.travelPreferences, preference],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MapPin className="w-10 h-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">LocalGuide</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">Start your journey with local experts</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: "tourist",
                    expertise: [],
                    dailyRate: "",
                    city: "",
                  })
                }
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.role === "tourist"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🧳</div>
                  <div className="font-semibold text-gray-900">Tourist</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Explore with local guides
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: "guide",
                    travelPreferences: [],
                  })
                }
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.role === "guide"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🗺️</div>
                  <div className="font-semibold text-gray-900">Guide</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Share your local knowledge
                  </div>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 mt-3" />
                <Input
                  type="text"
                  name="name"
                  label="Full Name *"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="pl-12"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 mt-3" />
                <Input
                  type="email"
                  name="email"
                  label="Email Address *"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 mt-3" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  label="Password *"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 mt-3"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 mt-3" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  label="Confirm Password *"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 mt-3"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio (Optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio: e.target.value,
                  })
                }
                placeholder="Tell us a bit about yourself..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Languages You Speak (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleLanguageToggle(language)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.languages.includes(language)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
              {formData.languages.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formData.languages.join(", ")}
                </p>
              )}
            </div>

            {/* Role-specific fields */}
            {formData.role === "guide" ? (
              <>
                {/* City for Guide - REQUIRED */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Map className="w-4 h-4 mr-2" />
                    City * (Required for guides)
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                      })
                    }
                    required
                    className={cityError ? "border-red-500" : ""}
                  />
                  {cityError && (
                    <p className="text-red-500 text-sm mt-1">{cityError}</p>
                  )}
                </div>

                {/* Guide Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Expertise (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {expertiseOptions.map((expertise) => (
                      <button
                        key={expertise}
                        type="button"
                        onClick={() => handleExpertiseToggle(expertise)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.expertise.includes(expertise)
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {expertise}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daily Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Rate (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter your daily rate"
                      value={formData.dailyRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dailyRate: e.target.value,
                        })
                      }
                      className="pl-10"
                      min="0"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Tourist Preferences */
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Preferences (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {preferenceOptions.map((preference) => (
                    <button
                      key={preference}
                      type="button"
                      onClick={() => handlePreferenceToggle(preference)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.travelPreferences.includes(preference)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {preference}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                required
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;
