import React, { useState } from "react";
import SvgSkeleton from "./skeletons/SvgSkeleton";

export interface ProgressiveImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
}

const ProgressiveImage = React.forwardRef<
  HTMLImageElement,
  ProgressiveImageProps
>(({ className, skeletonClassName, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <>
      <img
        {...props}
        className={`${className} ${isLoaded ? "" : "hidden"}`}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && <SvgSkeleton className={skeletonClassName} />}
    </>
  );
});

export default ProgressiveImage;
