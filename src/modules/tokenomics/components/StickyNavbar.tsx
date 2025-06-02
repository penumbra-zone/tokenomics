"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { cn } from "@/common/helpers/utils";
import { NAV_ACTIVE_WITH_UNDERLINE } from "@/common/styles/activeStates";
import { NAV_ITEM_BASE_STYLES, NAV_ITEM_INACTIVE_STYLES } from "@/common/styles/componentStyles";
import { shouldShowLiquidityTournament } from "@/lib/env/client";
import type { SectionId } from "@/lib/types/sections";
import { SECTION_IDS } from "@/lib/types/sections";
import ShareButton from "./ShareButton";

interface NavItem {
  id: SectionId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: SECTION_IDS.SUPPLY_VISUALIZATION, label: "Supply" },
  { id: SECTION_IDS.ISSUANCE_METRICS, label: "Issuance" },
  { id: SECTION_IDS.BURN_METRICS, label: "Tokens Burned" },
  { id: SECTION_IDS.TOKEN_DISTRIBUTION, label: "Token Distribution" },
];

if (shouldShowLiquidityTournament()) {
  NAV_ITEMS.push({ id: SECTION_IDS.LQT, label: "Liquidity Tournament" });
}

interface StickyNavbarProps {
  onShare: () => void;
  isGeneratingImage: boolean;
  isSubmitting: boolean;
}

export default function StickyNavbar({
  onShare,
  isGeneratingImage,
  isSubmitting,
}: StickyNavbarProps) {
  const [activeSection, setActiveSection] = useState<SectionId>(NAV_ITEMS[0].id);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  const handleNavClick = () => {
    isNavigatingRef.current = true;
    setShowNavbar(true);

    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    navigationTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1200);
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = 100;
      let current: SectionId = NAV_ITEMS[0].id;
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
          <ShareButton onClick={onShare} />
        </div>
      </div>
    </header>
  );
}
