"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative mb-8">
      <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
        {images && images.length > 0 ? (
          <img
            src={images[selectedImageIndex]}
            alt={title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <Compass className="w-20 h-20 text-white/50" />
          </div>
        )}

        {images && images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-blue-600" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-blue-600" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images && images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-transparent hover:border-blue-400"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
