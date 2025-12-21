// app/contact/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const contactInfo = [
  {
    title: "Email Support",
    description: "Get quick answers from our support team",
    value: "support@localguide.com",
    icon: Mail,
    color: "from-blue-500 to-cyan-500",
    link: "mailto:support@localguide.com",
  },
  {
    title: "Phone Support",
    description: "Available Monday-Friday, 9AM-6PM",
    value: "+1 (555) 123-4567",
    icon: Phone,
    color: "from-green-500 to-emerald-500",
    link: "tel:+15551234567",
  },
  {
    title: "Visit Our Office",
    description: "Come meet us in person",
    value: "123 Travel Street, City, Country",
    icon: MapPin,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Response Time",
    description: "We aim to respond within",
    value: "24 hours",
    icon: Clock,
    color: "from-purple-500 to-pink-500",
  },
];

const departments = [
  {
    name: "Customer Support",
    email: "support@localguide.com",
    description: "Booking issues, account problems, general inquiries",
  },
  {
    name: "Guide Relations",
    email: "guides@localguide.com",
    description: "Guide applications, partnership inquiries, guide support",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    department: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real app, you would send to your backend:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   body: JSON.stringify(formData)
      // });

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        department: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <MessageSquare className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              We're Here to <span className="text-yellow-300">Help</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Have questions, suggestions, or need assistance? Our team is ready
              to help you make the most of your travel experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${info.color} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-start mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                  <info.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                  <p className="text-blue-100 text-sm opacity-90">
                    {info.description}
                  </p>
                </div>
              </div>
              {info.link ? (
                <Link
                  href={info.link}
                  className="block text-xl font-bold hover:underline"
                >
                  {info.value}
                </Link>
              ) : (
                <div className="text-xl font-bold">{info.value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl mr-4">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600">
                    We'll get back to you as soon as possible
                  </p>
                </div>
              </div>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-green-800 font-medium">
                      Message sent successfully! We'll respond within 24 hours.
                    </span>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                    <span className="text-red-800">{submitError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                    >
                      <option value="">Select Department</option>
                      <option value="support">Customer Support</option>
                      <option value="guides">Guide Relations</option>
                      <option value="business">Business Inquiries</option>
                      <option value="press">Press & Media</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Departments & FAQ Link */}
          <div className="space-y-8">
            {/* Departments */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Contact Specific Departments
              </h3>
              <div className="space-y-6">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <h4 className="font-bold text-gray-900 mb-2">
                      {dept.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {dept.description}
                    </p>
                    <Link
                      href={`mailto:${dept.email}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {dept.email}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Common Questions?</h3>
              <p className="text-blue-100 mb-6">
                Check our FAQ section for quick answers to frequently asked
                questions.
              </p>
              <Link
                href="/faq"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors"
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Visit FAQ Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
