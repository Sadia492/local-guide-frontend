// components/modules/Admin/Users/EditUserDialogue.tsx
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
  User,
  Mail,
  Globe,
  Briefcase,
  MapPin,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
  FileText,
  Camera,
} from "lucide-react";

interface EditUserDialogProps {
  userId: string;
  onSuccess?: () => void;
}

interface UserData {
  name: string;
  email: string;
  role: "TOURIST" | "GUIDE" | "ADMIN";
  profilePicture: string;
  bio?: string;
  languages: string[];
  expertise: string[];
  dailyRate?: number;
  travelPreferences: string[];
  isVerified: boolean;
  isActive: boolean;
}

// Available languages
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
  "Russian",
  "Korean",
];

// Expertise areas for guides
const expertiseAreas = [
  "History",
  "Food & Drink",
  "Art & Architecture",
  "Adventure & Nature",
  "Photography",
  "Nightlife",
  "Shopping",
  "Wellness & Spa",
  "Family Friendly",
  "Cultural",
  "Music",
  "Sports",
];

// Travel preferences for tourists
const travelPreferencesList = [
  "Adventure",
  "Culture",
  "Food",
  "History",
  "Nature",
  "Photography",
  "Shopping",
  "Relaxation",
  "Nightlife",
  "Family",
  "Romantic",
  "Budget",
];

export function EditUserDialog({ userId, onSuccess }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    role: "TOURIST",
    profilePicture: "",
    bio: "",
    languages: [],
    expertise: [],
    dailyRate: 0,
    travelPreferences: [],
    isVerified: false,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch user data when dialog opens
  useEffect(() => {
    if (open && userId) {
      fetchUserData();
    }
  }, [open, userId]);

  const fetchUserData = async () => {
    try {
      setFetchingData(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      if (data.data) {
        setFormData({
          name: data.data.name || "",
          email: data.data.email || "",
          role: data.data.role || "TOURIST",
          profilePicture: data.data.profilePicture || "",
          bio: data.data.bio || "",
          languages: data.data.languages || [],
          expertise: data.data.expertise || [],
          dailyRate: data.data.dailyRate || 0,
          travelPreferences: data.data.travelPreferences || [],
          isVerified: data.data.isVerified || false,
          isActive: data.data.isActive !== false, // default to true
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user data");
    } finally {
      setFetchingData(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: any) => {
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

  const handleArrayChange = (
    field: "languages" | "expertise" | "travelPreferences",
    value: string
  ) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    handleInputChange(field, newArray);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio cannot exceed 500 characters";
    }

    if (
      formData.role === "GUIDE" &&
      formData.dailyRate !== undefined &&
      formData.dailyRate < 0
    ) {
      newErrors.dailyRate = "Daily rate cannot be negative";
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

      // Prepare data for submission
      const submitData: any = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        languages: formData.languages,
        expertise: formData.expertise,
        travelPreferences: formData.travelPreferences,
        isVerified: formData.isVerified,
        isActive: formData.isActive,
      };

      // Add role-specific fields
      if (formData.role === "GUIDE") {
        submitData.dailyRate = formData.dailyRate || 0;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(submitData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user");
      }

      toast.success("User updated successfully", {
        description: "User information has been saved",
      });

      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex-1 p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded text-center"
          title="Edit User"
        >
          <Edit className="w-3 h-3 mx-auto" />
          <span className="text-xs mt-0.5">Edit</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit User Profile
          </DialogTitle>
          <DialogDescription>
            Update user information and manage account settings.
          </DialogDescription>
        </DialogHeader>

        {fetchingData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="relative">
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt={formData.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {getInitials(formData.name)}
                  </div>
                )}
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 border"
                >
                  <Camera className="w-3 h-3 text-gray-600" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{formData.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-3 h-3" />
                  {formData.email}
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      formData.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : formData.role === "GUIDE"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {formData.role === "ADMIN" && (
                      <Shield className="w-3 h-3" />
                    )}
                    {formData.role === "GUIDE" && (
                      <Briefcase className="w-3 h-3" />
                    )}
                    {formData.role === "TOURIST" && (
                      <User className="w-3 h-3" />
                    )}
                    {formData.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Biography
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                className="min-h-[100px] resize-none"
                value={formData.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
              />
              <div className="flex justify-between">
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.bio?.length || 0}/500 characters
                </p>
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Languages Spoken
              </Label>
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleArrayChange("languages", language)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      formData.languages.includes(language)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Selected: {formData.languages.length} language(s)
              </p>
            </div>

            {/* Role-specific sections */}
            {formData.role === "GUIDE" && (
              <>
                {/* Expertise */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Areas of Expertise
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {expertiseAreas.map((expertise) => (
                      <button
                        key={expertise}
                        type="button"
                        onClick={() =>
                          handleArrayChange("expertise", expertise)
                        }
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          formData.expertise.includes(expertise)
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {expertise}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Selected: {formData.expertise.length} area(s)
                  </p>
                </div>

                {/* Daily Rate */}
                <div className="space-y-2">
                  <Label
                    htmlFor="dailyRate"
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Daily Rate ($)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="dailyRate"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="50.00"
                      className="pl-8"
                      value={formData.dailyRate || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "dailyRate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  {errors.dailyRate && (
                    <p className="text-sm text-red-500">{errors.dailyRate}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Daily rate for guide services
                  </p>
                </div>
              </>
            )}

            {formData.role === "TOURIST" && (
              <>
                {/* Travel Preferences */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Travel Preferences
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {travelPreferencesList.map((preference) => (
                      <button
                        key={preference}
                        type="button"
                        onClick={() =>
                          handleArrayChange("travelPreferences", preference)
                        }
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          formData.travelPreferences.includes(preference)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {preference}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Selected: {formData.travelPreferences.length} preference(s)
                  </p>
                </div>
              </>
            )}

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
                className="min-w-[100px] bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
