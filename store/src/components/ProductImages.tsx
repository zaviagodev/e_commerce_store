import { useRef, useState, useEffect } from "react";
import { useIntersection } from "react-use";
import {
  SfScrollable,
  SfButton,
  SfIconChevronLeft,
  SfIconChevronRight,
  type SfScrollableOnDragEndData,
} from "@storefront-ui/react";
import classNames from "classnames";

type ProductImagesProps = {
  images: {
    imageSrc: string;
    imageThumbSrc: string;
    alt: string;
  }[];
};

const ProductImages = ({ images }: ProductImagesProps) => {
  const lastThumbRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const firstThumbRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("vertical");
  const [currentimages, setCurrentimages] = useState(0);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setDirection("horizontal");
      } else {
        setDirection("vertical");
      }
    };

    handleResize(); // Set initial direction
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let scrollableClassNames = "lg:ml-8 w-full h-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  // I have commented this because it should snap on both vertical and horizontal side.
  if (direction === "vertical") {
    scrollableClassNames += " snap-x snap-mandatory";
  }

  const firstThumbVisible = useIntersection(firstThumbRef, {
    root: thumbsRef.current,
    rootMargin: "0px",
    threshold: 1,
  });

  const lastThumbVisible = useIntersection(lastThumbRef, {
    root: thumbsRef.current,
    rootMargin: "0px",
    threshold: 1,
  });

  const onDragged = (event: SfScrollableOnDragEndData) => {
    if (event.swipeRight && activeIndex > 0) {
      setActiveIndex((currentActiveIndex) => currentActiveIndex - 1);
    } else if (event.swipeLeft && activeIndex < images.length - 1) {
      setActiveIndex((currentActiveIndex) => currentActiveIndex + 1);
    }
  };

  const onScroll = (event: SfScrollableOnScrollData) => {
    const totalImages = images.length; // Replace with your total number of images
    const currentImageNumber =
      Math.floor(event.left / (event.scrollWidth / totalImages)) + 1;
    const currentImagesText = `${currentImageNumber}/${totalImages}`;
    //setCurrentimages(currentImageNumber);
    console.log(currentImagesText);
    if (indicatorRef.current) {
      indicatorRef.current.textContent = currentImagesText;
    }
  };

  return (
    // <div className="relative flex w-full aspect-square lg:aspect-[4/3]">
    <div className="relative flex w-full">
      <SfScrollable
        ref={thumbsRef}
        className="hidden lg:flex sticky top-[calc(57px_+_16px)] items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        direction="vertical"
        activeIndex={activeIndex}
        prevDisabled={activeIndex === 0}
        nextDisabled={activeIndex === images.length - 1}
        // Button arrows may be used later, so I added 'hidden' class to them.
        slotPreviousButton={
          <SfButton
            className={classNames(
              "absolute !rounded-full z-10 top-4 rotate-90 bg-white hidden",
              {
                hidden: firstThumbVisible?.isIntersecting,
              }
            )}
            variant="secondary"
            size="sm"
            square
            slotPrefix={<SfIconChevronLeft size="sm" />}
          />
        }
        slotNextButton={
          <SfButton
            className={classNames(
              "absolute !rounded-full z-10 bottom-4 rotate-90 bg-white hidden",
              {
                hidden: lastThumbVisible?.isIntersecting,
              }
            )}
            variant="secondary"
            size="sm"
            square
            slotPrefix={<SfIconChevronRight size="sm" />}
          />
        }
      >
        {images.map(({ imageThumbSrc, alt }, index, thumbsArray) => (
          <button
            // eslint-disable-next-line no-nested-ternary
            ref={
              index === thumbsArray.length - 1
                ? lastThumbRef
                : index === 0
                ? firstThumbRef
                : null
            }
            type="button"
            aria-label={alt}
            aria-current={activeIndex === index}
            key={`${alt}-${index}-thumbnail`}
            className={classNames(
              "w-full h-auto relative shrink-0 snap-center cursor-pointer focus-visible:outline focus-visible:outline-offset transition-colors flex-grow md:flex-grow-0",
              {
                "border-primary-700": activeIndex === index,
                "border-transparent": activeIndex !== index,
              }
            )}
            onMouseOver={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
          >
            <img
              alt={alt}
              src={imageThumbSrc}
              width={134}
              height={134}
              className="object-scale-down w-full h-full aspect-square"
            />
          </button>
        ))}
      </SfScrollable>

      <SfScrollable
        className={scrollableClassNames}
        activeIndex={activeIndex}
        direction={direction}
        wrapperClassName="w-full"
        buttonsPlacement="none"
        isActiveIndexCentered
        drag={{ containerWidth: true }}
        onDragEnd={onDragged}
        onScroll={onScroll}
      >
        <div 
          ref={indicatorRef} 
          className="absolute px-2 py-1 text-darkgray-200 right-3 top-3 bg-white text-xs border border-darkgray-100 rounded-full"
        ></div>
        {images.map(({ imageSrc, alt }, index) => (
          <div
            key={`${alt}-${index}`}
            className="flex justify-start h-full basis-full shrink-0 grow snap-center min-h-[500px]"
          >
            <img
              aria-label={alt}
              aria-hidden={activeIndex !== index}
              className="object-contain w-full h-fit lg:min-w-[500px] lg:min-h-[500px]"
              alt={alt}
              src={imageSrc}
            />
          </div>
        ))}
      </SfScrollable>
    </div>
  );
};

export default ProductImages;
