"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  X,
  MapPin,
  Clock,
  Users,
  DollarSign,
  FileText,
  Building,
  Globe,
  ArrowLeft,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import { createListingService } from "@/services/listing/createListing.service";
import { formatListingData, validateForm } from "@/lib/createListingUtils";

interface Category {
  value: string;
  label: string;
  icon: string;
}

interface CreateListingClientProps {
  categories: Category[];
  languages: string[];
}

export default function CreateListingClient({
  categories,
  languages,
}: CreateListingClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    category: "",
    fee: "",
    duration: "",
    maxGroupSize: "",
    meetingPoint: "",
    language: "English",
    itinerary: "",
  });
  const getBackUrl = () => {
    if (pathname?.includes("/dashboard/admin")) {
      return "/dashboard/admin/listings";
    } else if (pathname?.includes("/dashboard/guide")) {
      return "/dashboard/guide/my-listings";
    }
    // Default fallback
    return "/dashboard";
  };
  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);

    // Clear image error if any
    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviewUrls = [...previewUrls];

    URL.revokeObjectURL(newPreviewUrls[index]);
    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData, images);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      // Format data for backend
      const listingData = formatListingData(formData);

      await createListingService.createListing(listingData, images);

      toast.success("Listing created successfully!", {
        description: "Your tour is now live and visible to travelers.",
      });

      router.push("/dashboard/guide/my-listings");
    } catch (error) {
      console.error("Error creating listing:", error);

      // Show specific error messages from backend
      if (error instanceof Error) {
        toast.error("Failed to create listing", {
          description: error.message,
        });
      } else {
        toast.error("Failed to create listing", {
          description: "Please check all fields and try again",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Create New Tour Listing
                </h1>
                <p className="text-gray-600 mt-2">
                  Share your unique local experience with travelers from around
                  the world
                </p>
              </div>
            </div>
          </div>

          <Link
            href={getBackUrl()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Tour Details
                </h2>
                <p className="text-gray-600">
                  Fill in all the details about your unique tour experience
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Tour Images *
                    </label>
                    <div
                      className={`border-2 ${
                        errors.images
                          ? "border-red-300"
                          : "border-dashed border-gray-300"
                      } rounded-xl p-8 text-center hover:border-blue-500 transition-all duration-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50`}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                          <Upload className="w-10 h-10 text-blue-600" />
                        </div>
                        <p className="text-gray-700 font-medium mb-2">
                          Drop images here or click to upload
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Upload up to 5 high-quality images (Max 5MB each)
                        </p>
                        <span className="inline-block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                          Browse Files
                        </span>
                      </label>
                    </div>
                    {errors.images && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.images}</span>
                      </div>
                    )}
                  </div>

                  {/* Image Previews */}
                  {previewUrls.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-3">
                        {previewUrls.length} image(s) selected
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {previewUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative group rounded-xl overflow-hidden"
                          >
                            <div className="aspect-square bg-gray-100">
                              <img
                                src={url}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Title and City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Tour Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className={`w-full px-4 py-3 border ${
                        errors.title ? "border-red-300" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="e.g., Hidden Jazz Bars of New Orleans"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      City/Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.city ? "border-red-300" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="e.g., New Orleans, Louisiana"
                      />
                    </div>
                    {errors.city && (
                      <p className="text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>
                </div>

                {/* Category and Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Category *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.category ? "border-red-300" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none transition-all`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.category && (
                      <p className="text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Primary Language *
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={formData.language}
                        onChange={(e) =>
                          handleInputChange("language", e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none transition-all"
                      >
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Price per person *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.fee}
                        onChange={(e) =>
                          handleInputChange("fee", e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.fee ? "border-red-300" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="50.00"
                      />
                    </div>
                    {errors.fee && (
                      <p className="text-sm text-red-600">{errors.fee}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Duration (hours) *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.duration ? "border-red-300" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="4"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        hours
                      </span>
                    </div>
                    {errors.duration && (
                      <p className="text-sm text-red-600">{errors.duration}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Max Group Size *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        min="1"
                        value={formData.maxGroupSize}
                        onChange={(e) =>
                          handleInputChange("maxGroupSize", e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.maxGroupSize
                            ? "border-red-300"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="6"
                      />
                    </div>
                    {errors.maxGroupSize && (
                      <p className="text-sm text-red-600">
                        {errors.maxGroupSize}
                      </p>
                    )}
                  </div>
                </div>

                {/* Meeting Point */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Meeting Point *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.meetingPoint}
                      onChange={(e) =>
                        handleInputChange("meetingPoint", e.target.value)
                      }
                      className={`w-full pl-10 pr-4 py-3 border ${
                        errors.meetingPoint
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="e.g., Jackson Square, 700 Decatur Street, New Orleans, LA 70116"
                    />
                  </div>
                  {errors.meetingPoint && (
                    <p className="text-sm text-red-600">
                      {errors.meetingPoint}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Tour Description *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className={`w-full px-4 py-3 border ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all`}
                    placeholder="Describe your tour experience in detail. What makes it unique? What will tourists see, do, and feel?"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Itinerary */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Detailed Itinerary *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      rows={4}
                      value={formData.itinerary}
                      onChange={(e) =>
                        handleInputChange("itinerary", e.target.value)
                      }
                      className={`w-full pl-10 pr-4 py-3 border ${
                        errors.itinerary ? "border-red-300" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm transition-all`}
                      placeholder={`Example itinerary:
1. 2:00 PM - Meet at Jackson Square
2. 2:15 PM - Walk through French Quarter
3. 3:30 PM - Visit historic jazz bar
4. 4:45 PM - Local food tasting
5. 6:00 PM - Tour concludes at original meeting point`}
                    />
                  </div>
                  {errors.itinerary && (
                    <p className="text-sm text-red-600">{errors.itinerary}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Listing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Publish Tour Listing
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Tips and Preview */}
          <div className="space-y-6">
            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Tips for a Great Listing
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <span className="text-sm text-gray-700">
                    <strong>Use high-quality images</strong> that showcase your
                    tour experience
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <span className="text-sm text-gray-700">
                    <strong>Write a compelling title</strong> that captures
                    attention
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <span className="text-sm text-gray-700">
                    <strong>Be detailed in your description</strong> - travelers
                    want to know exactly what to expect
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <span className="text-sm text-gray-700">
                    <strong>Set a fair price</strong> based on your expertise
                    and tour value
                  </span>
                </li>
              </ul>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-2xl shadow-xl border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Preview
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Images</div>
                    <div className="font-medium">
                      {images.length > 0
                        ? `${images.length} selected`
                        : "No images"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-medium">
                      {formData.city || "Not specified"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="font-medium">
                      {formData.fee ? `$${formData.fee}` : "Not set"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">
                      {formData.duration
                        ? `${formData.duration} hours`
                        : "Not set"}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Your listing will be reviewed and may take up to 24 hours to
                    appear in search results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
