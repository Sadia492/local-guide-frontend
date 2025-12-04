// components/modules/Admin/Listing/EditListingDialogue.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Edit,
  Loader2,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Globe,
  FileText,
  Building,
} from "lucide-react";

interface EditListingDialogProps {
  listingId: string;
  onSuccess?: () => void;
}

interface ListingData {
  title: string;
  description: string;
  city: string;
  category: string;
  fee: number;
  duration: number;
  maxGroupSize: number;
  meetingPoint: string;
  language: string;
  itinerary: string;
}

const categories = [
  { value: "Food", label: "Food & Drink" },
  { value: "History", label: "History & Culture" },
  { value: "Adventure", label: "Adventure & Nature" },
  { value: "Nightlife", label: "Nightlife" },
  { value: "Shopping", label: "Shopping" },
  { value: "Art", label: "Art & Architecture" },
  { value: "Photography", label: "Photography" },
  { value: "Wellness", label: "Wellness & Spa" },
  { value: "Family", label: "Family Friendly" },
  { value: "Custom", label: "Custom Experience" },
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Japanese",
  "Chinese",
  "Arabic",
  "Hindi",
  "Portuguese",
];

export function EditListingDialog({
  listingId,
  onSuccess,
}: EditListingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false); // Separate state for initial data fetch
  const [formData, setFormData] = useState<ListingData>({
    title: "",
    description: "",
    city: "",
    category: "",
    fee: 0,
    duration: 1,
    maxGroupSize: 1,
    meetingPoint: "",
    language: "English",
    itinerary: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch listing data when dialog opens
  useEffect(() => {
    if (open && listingId) {
      fetchListingData();
    }
  }, [open, listingId]);

  const fetchListingData = async () => {
    try {
      setFetchingData(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listing/${listingId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch listing data");
      }

      const data = await response.json();

      if (data.data) {
        setFormData({
          title: data.data.title || "",
          description: data.data.description || "",
          city: data.data.city || "",
          category: data.data.category || "",
          fee: data.data.fee || 0,
          duration: data.data.duration || 1,
          maxGroupSize: data.data.maxGroupSize || 1,
          meetingPoint: data.data.meetingPoint || "",
          language: data.data.language || "English",
          itinerary: data.data.itinerary || "",
        });
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
      toast.error("Failed to load listing data");
    } finally {
      setFetchingData(false);
    }
  };

  const handleInputChange = (
    field: keyof ListingData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.description || formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.city || formData.city.length < 2) {
      newErrors.city = "City is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.fee || formData.fee <= 0) {
      newErrors.fee = "Price must be greater than 0";
    }

    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = "Duration must be at least 1 hour";
    }

    if (!formData.maxGroupSize || formData.maxGroupSize < 1) {
      newErrors.maxGroupSize = "Group size must be at least 1";
    }

    if (!formData.meetingPoint || formData.meetingPoint.length < 5) {
      newErrors.meetingPoint = "Meeting point is required";
    }

    if (!formData.language) {
      newErrors.language = "Language is required";
    }

    if (!formData.itinerary || formData.itinerary.length < 20) {
      newErrors.itinerary = "Itinerary must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listing/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update listing");
      }

      toast.success("Listing updated successfully", {
        description: "Your changes have been saved",
      });

      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-1 text-center"
          title="Edit"
        >
          <Edit className="w-4 h-4 mx-auto" />
          <span className="text-xs mt-1">Edit</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Tour Listing
          </DialogTitle>
          <DialogDescription>
            Update your tour listing details. Make sure all information is
            accurate and compelling.
          </DialogDescription>
        </DialogHeader>

        {fetchingData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Tour Title</Label>
              <Input
                id="title"
                placeholder="Hidden Jazz Bars of New Orleans"
                className="font-medium"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
              <p className="text-sm text-gray-500">
                Create an engaging title that captures the essence of your tour
              </p>
            </div>

            {/* City and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  City/Location
                </Label>
                <Input
                  id="city"
                  placeholder="New Orleans, Louisiana"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city}</p>
                )}
                <p className="text-sm text-gray-500">
                  Where the tour takes place
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Tour Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
                <p className="text-sm text-gray-500">
                  Primary theme of your tour
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Tour Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your tour experience in detail. What makes it unique? What will tourists see, do, and feel?"
                className="min-h-[120px] resize-none"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-sm text-gray-500">
                Be descriptive and highlight the unique aspects of your tour
              </p>
            </div>

            {/* Pricing and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="fee" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price per person ($)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="fee"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="50.00"
                    className="pl-8"
                    value={formData.fee}
                    onChange={(e) =>
                      handleInputChange("fee", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                {errors.fee && (
                  <p className="text-sm text-red-500">{errors.fee}</p>
                )}
                <p className="text-sm text-gray-500">Price for one person</p>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration (hours)
                </Label>
                <div className="relative">
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    placeholder="4"
                    className="pr-12"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange(
                        "duration",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    hours
                  </span>
                </div>
                {errors.duration && (
                  <p className="text-sm text-red-500">{errors.duration}</p>
                )}
                <p className="text-sm text-gray-500">Total tour duration</p>
              </div>
            </div>

            {/* Group Size and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Group Size */}
              <div className="space-y-2">
                <Label
                  htmlFor="maxGroupSize"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Maximum Group Size
                </Label>
                <Input
                  id="maxGroupSize"
                  type="number"
                  min="1"
                  placeholder="6"
                  value={formData.maxGroupSize}
                  onChange={(e) =>
                    handleInputChange(
                      "maxGroupSize",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
                {errors.maxGroupSize && (
                  <p className="text-sm text-red-500">{errors.maxGroupSize}</p>
                )}
                <p className="text-sm text-gray-500">
                  Maximum number of participants
                </p>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Primary Language
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    handleInputChange("language", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p className="text-sm text-red-500">{errors.language}</p>
                )}
                <p className="text-sm text-gray-500">
                  Language used during the tour
                </p>
              </div>
            </div>

            {/* Meeting Point */}
            <div className="space-y-2">
              <Label htmlFor="meetingPoint" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Meeting Point
              </Label>
              <Input
                id="meetingPoint"
                placeholder="Jackson Square, 700 Decatur Street, New Orleans, LA 70116"
                value={formData.meetingPoint}
                onChange={(e) =>
                  handleInputChange("meetingPoint", e.target.value)
                }
              />
              {errors.meetingPoint && (
                <p className="text-sm text-red-500">{errors.meetingPoint}</p>
              )}
              <p className="text-sm text-gray-500">
                Exact location where tourists should meet you. Include address
                and any landmarks.
              </p>
            </div>

            {/* Itinerary */}
            <div className="space-y-2">
              <Label htmlFor="itinerary" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Detailed Itinerary
              </Label>
              <Textarea
                id="itinerary"
                placeholder="Example itinerary:
1. 2:00 PM - Meet at Jackson Square
2. 2:15 PM - Walk through French Quarter
3. 3:30 PM - Visit historic jazz bar
4. 4:45 PM - Local food tasting
5. 6:00 PM - Tour concludes at original meeting point"
                className="min-h-[150px] resize-none font-mono text-sm"
                value={formData.itinerary}
                onChange={(e) => handleInputChange("itinerary", e.target.value)}
              />
              {errors.itinerary && (
                <p className="text-sm text-red-500">{errors.itinerary}</p>
              )}
              <p className="text-sm text-gray-500">
                Step-by-step schedule with times and activities. Use bullet
                points or numbered lists.
              </p>
            </div>

            {/* Action Buttons */}
            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[100px] bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update Listing"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
