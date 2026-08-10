import React, { useState, useEffect } from "react";
import { resolveImageUrl, DEFAULT_DOODLE_FALLBACK_IMAGE } from "@/lib/image-utils";
import { ImageOff } from "lucide-react";

export interface DoodleImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null | undefined;
  fallbackSrc?: string;
  containerClassName?: string;
  showFallbackBadge?: boolean;
}

export const DoodleImage: React.FC<DoodleImageProps> = ({
  src,
  fallbackSrc = DEFAULT_DOODLE_FALLBACK_IMAGE,
  alt = "Doodle Portfolio Image",
  className = "",
  containerClassName = "",
  showFallbackBadge = false,
  onError,
  ...props
}) => {
  const resolved = resolveImageUrl(src, fallbackSrc);
  const [currentSrc, setCurrentSrc] = useState<string>(resolved);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const nextResolved = resolveImageUrl(src, fallbackSrc);
    setCurrentSrc(nextResolved);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <img
        src={currentSrc}
        alt={alt}
        onError={handleError}
        className={className}
        {...props}
      />
      {hasError && showFallbackBadge && (
        <div className="absolute bottom-2 right-2 rounded-md bg-card/90 border border-ink px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground flex items-center gap-1 shadow-xs">
          <ImageOff className="h-3 w-3 text-coral" />
          <span>Fallback Image</span>
        </div>
      )}
    </div>
  );
};
