"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { id: "supply-visualization", label: "Dashboard" },
  { id: "educational", label: "Educational" },
  { id: "services", label: "Services" },
  { id: "lqt", label: "Liquidity Tournament" },
];

export default function StickyNavbar() {
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0].id);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-black/80 backdrop-blur-lg transition-transform duration-300 will-change-transform ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Image src="/penumbra-logo.svg" alt="Penumbra Logo" width={120} height={24} priority />
        <nav className="hidden md:flex items-center bg-neutral-800 rounded-full p-1">
          {NAV_ITEMS.map((item, idx) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
                activeSection === item.id
                  ? "text-white border-b-2 border-primary"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-700"
              }${idx === NAV_ITEMS.length - 1 ? " mr-1" : ""}`}
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
