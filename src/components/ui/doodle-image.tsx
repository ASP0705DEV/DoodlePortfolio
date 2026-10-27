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
  onLoad,
  ...props
}) => {
  const resolved = resolveImageUrl(src, fallbackSrc);
  const [errorUrl, setErrorUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Directly derive currentSrc without an effect delay
  const isFailed = errorUrl === resolved;
  const currentSrc = isFailed ? fallbackSrc : resolved;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!isFailed) {
      setErrorUrl(resolved);
    }
    onError?.(e);
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`${className} transition-opacity duration-200 ${isLoaded ? "opacity-100" : "opacity-95"}`}
        suppressHydrationWarning
        {...props}
      />
      {isFailed && showFallbackBadge && (
        <div className="absolute bottom-2 right-2 rounded-md bg-card/90 border border-ink px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground flex items-center gap-1 shadow-xs">
          <ImageOff className="h-3 w-3 text-coral" />
          <span>Fallback Image</span>
        </div>
      )}
    </div>
  );
};
