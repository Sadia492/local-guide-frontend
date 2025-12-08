export const categories = [
  { value: "Food", label: "Food & Drink", icon: "🍔" },
  { value: "Art", label: "Art & Architecture", icon: "🎨" },
  { value: "Adventure", label: "Adventure & Nature", icon: "🌲" },
  { value: "History", label: "History & Culture", icon: "🏛️" },
  { value: "Photography", label: "Photography", icon: "📸" },
  // Remove categories not in backend schema
];

export const languages = [
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

export const validateForm = (
  formData: any,
  images: File[]
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Must match backend Zod schema
  if (!formData.title?.trim()) {
    errors.title = "Title is required";
  } else if (formData.title.length < 5) {
    errors.title = "Title must be at least 5 characters";
  }

  if (!formData.description?.trim()) {
    errors.description = "Description is required";
  } else if (formData.description.length < 20) {
    // Match backend: min(20)
    errors.description = "Description must be at least 20 characters";
  }

  if (!formData.city?.trim()) {
    errors.city = "City is required";
  } else if (formData.city.length < 2) {
    // Match backend: min(2)
    errors.city = "City must be at least 2 characters";
  }

  if (!formData.category) {
    errors.category = "Category is required";
  } else if (
    !["Food", "Art", "Adventure", "History", "Photography"].includes(
      formData.category
    )
  ) {
    errors.category = "Invalid category selected";
  }

  if (!formData.fee || parseFloat(formData.fee) <= 0) {
    errors.fee = "Price must be greater than 0";
  }

  if (!formData.duration || parseInt(formData.duration) < 1) {
    errors.duration = "Duration must be at least 1 hour";
  }

  if (!formData.meetingPoint?.trim()) {
    errors.meetingPoint = "Meeting point is required";
  } else if (formData.meetingPoint.length < 3) {
    // Match backend: min(3)
    errors.meetingPoint = "Meeting point must be at least 3 characters";
  }

  if (!formData.maxGroupSize || parseInt(formData.maxGroupSize) < 1) {
    errors.maxGroupSize = "Group size must be at least 1";
  }

  if (images.length === 0) {
    errors.images = "At least one image is required";
  }

  return errors;
};

// Helper to format data for backend
export const formatListingData = (formData: any) => {
  return {
    title: formData.title,
    description: formData.description,
    city: formData.city,
    category: formData.category,
    fee: Number(formData.fee),
    duration: Number(formData.duration),
    maxGroupSize: Number(formData.maxGroupSize),
    meetingPoint: formData.meetingPoint,
    language: formData.language || "English",
    itinerary: formData.itinerary || "",
    // images will be sent as files
  };
};
