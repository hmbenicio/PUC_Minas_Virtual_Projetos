import { useEffect, useState } from "react";

const MOBILE_QHD_WIDTH = 1440;
const MOBILE_QHD_HEIGHT = 2560;

const evaluateViewport = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const { innerWidth: width, innerHeight: height } = window;
  const isPortrait = height >= width;

  return (
    width <= MOBILE_QHD_WIDTH &&
    height <= MOBILE_QHD_HEIGHT &&
    isPortrait
  );
};

export default function useQuadHdMobile() {
  const [isMobileQuadHd, setIsMobileQuadHd] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const root = document.documentElement;

    const handleViewportChange = () => {
      const matches = evaluateViewport();
      setIsMobileQuadHd(matches);

      if (matches) {
        root.classList.add("mobile-qhd");
      } else {
        root.classList.remove("mobile-qhd");
      }
    };

    handleViewportChange();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);

    return () => {
      root.classList.remove("mobile-qhd");
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
    };
  }, []);

  return isMobileQuadHd;
}
