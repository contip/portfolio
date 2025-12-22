"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Media } from "@/components/Media";
import type { Media as MediaType } from "@/types/payload-types";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
  images: MediaType[];
}

export function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-4/3 w-full bg-muted rounded-lg overflow-hidden group">
        <Media
          resource={images[currentIndex]}
          fill
          imgClassName="object-cover"
          size="(max-width: 768px) 100vw, 768px"
        />

        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full shadow-lg"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full shadow-lg"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToSlide(index)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
              aria-label={`Go to image ${index + 1}`}
            >
              <Media
                resource={image}
                fill
                imgClassName="object-cover"
                size="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
