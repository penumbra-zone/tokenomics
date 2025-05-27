"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { cn } from "@/common/helpers/utils";
import { NAV_ACTIVE_WITH_UNDERLINE } from "@/common/styles/activeStates";
import { NAV_ITEM_BASE_STYLES, NAV_ITEM_INACTIVE_STYLES } from "@/common/styles/componentStyles";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { id: "summary", label: "Summary" },
  { id: "supply-visualization", label: "Dashboard" },
  { id: "issuance-metrics", label: "Issuance" },
  { id: "burn-metrics", label: "Tokens Burned" },
  { id: "token-distribution", label: "Token Distribution" },
  { id: "lqt", label: "Liquidity Tournament" },
];

export default function StickyNavbar() {
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0].id);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  const handleNavClick = () => {
    isNavigatingRef.current = true;
    setShowNavbar(true);

    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Reset navigation state after smooth scroll completes (typically ~1000ms)
    navigationTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1200);
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = 100;
      let current = NAV_ITEMS[0].id;
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top - offset <= 0) {
            current = id;
          }
        }
      }
      setActiveSection(current);

      // Don't hide navbar if we're currently navigating
      if (isNavigatingRef.current) {
        return;
      }

      if (window.scrollY < 10) {
        setShowNavbar(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clean up timeout on unmount
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-black/80 backdrop-blur-lg transition-transform duration-300 will-change-transform ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Image src="/penumbra-logo.svg" alt="Penumbra Logo" width={120} height={24} priority />
        <nav className="hidden md:flex items-center bg-neutral-800 rounded-full p-1 ml-4 mr-4">
          {NAV_ITEMS.map((item, idx) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => handleNavClick()}
              className={cn(
                NAV_ITEM_BASE_STYLES,
                activeSection === item.id ? NAV_ACTIVE_WITH_UNDERLINE : NAV_ITEM_INACTIVE_STYLES,
                idx === NAV_ITEMS.length - 1 ? "mr-1" : ""
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-neutral-800 hover:bg-neutral-700 w-8 h-8"
          >
            <Image src="/extensions_ico.svg" alt="Other Apps" width={16} height={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-neutral-800 hover:bg-neutral-700 w-8 h-8"
          >
            <Image src="/prax_ico.svg" alt="Prax Logo" width={16} height={16} />
          </Button>
        </div>
      </div>
    </header>
  );
}
