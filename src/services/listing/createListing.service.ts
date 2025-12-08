export interface CreateListingData {
  title: string;
  description: string;
  city: string;
  category: string;
  fee: number;
  duration: number;
  maxGroupSize: number;
  meetingPoint: string;
  language: string;
  itinerary?: string; // Make optional to match backend
  images?: string[]; // Make optional to match backend
}

export const createListingService = {
  async createListing(data: CreateListingData, images: File[]): Promise<any> {
    try {
      const formData = new FormData();

      // Format data to match backend Zod schema
      const listingData = {
        title: data.title,
        description: data.description,
        city: data.city,
        category: data.category,
        fee: data.fee,
        duration: data.duration,
        maxGroupSize: data.maxGroupSize,
        meetingPoint: data.meetingPoint,
        language: data.language,
        itinerary: data.itinerary || "", // Ensure it's not undefined
      };

      formData.append("data", JSON.stringify(listingData));

      // Append images
      images.forEach((image) => {
        formData.append("files", image);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listing`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Check for Zod validation errors
        if (result.error === "Zod Error" && result.details) {
          const errorMessages = result.details
            .map((detail: any) => `${detail.path.join(".")}: ${detail.message}`)
            .join(", ");
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        throw new Error(result.message || "Failed to create listing");
      }

      return result;
    } catch (error) {
      console.error("Error creating listing:", error);
      throw error;
    }
  },
};
