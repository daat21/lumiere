"use client";

import { useState, useEffect } from "react";
import { NavigationBar } from "@/components/home/navagationBar";
import { Footer } from "@/components/home/footer";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrollUpVisible, setIsScrollUpVisible] = useState(false);

  const toggleScrollUpVisibility = () => {
    if (window.scrollY > 300) {
      setIsScrollUpVisible(true);
    } else {
      setIsScrollUpVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleScrollUpVisibility);

    return () => {
      window.removeEventListener("scroll", toggleScrollUpVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <NavigationBar />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <Footer />

      <Button
        // variant="secondary"
        onClick={scrollToTop}
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-transform duration-800 ease-in-out shadow-2xl rounded-full cursor-pointer ${
          isScrollUpVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-20 opacity-0"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4 mr-1" />
        <span className="text-base font-semibold">Back to top</span>
      </Button>
    </>
  );
}
