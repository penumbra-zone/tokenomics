// Active state styles for interactive components

// Base gradient underline effect for active states
const ACTIVE_UNDERLINE_BASE = [
  "relative",
  "after:absolute",
  "after:bottom-0",
  "after:left-1/2",
  "after:-translate-x-1/2",
  "after:h-0.5",
  "after:bg-gradient-to-r",
  "after:from-transparent",
  "after:via-primary",
  "after:to-transparent",
].join(" ");

// Active underline variants with different widths
export const ACTIVE_UNDERLINE_FULL = [
  ...ACTIVE_UNDERLINE_BASE.split(" "),
  "after:w-full",
].join(" ");

export const ACTIVE_UNDERLINE_MEDIUM = [
  ...ACTIVE_UNDERLINE_BASE.split(" "),
  "after:w-3/4",
].join(" ");

export const ACTIVE_UNDERLINE_SMALL = [
  ...ACTIVE_UNDERLINE_BASE.split(" "),
  "after:w-2/3",
].join(" ");

export const ACTIVE_UNDERLINE_MINIMAL = [
  ...ACTIVE_UNDERLINE_BASE.split(" "),
  "after:w-1/2",
].join(" ");

// Tab active states
export const TAB_ACTIVE_WITH_UNDERLINE = [
  "data-[state=active]:text-white",
  "data-[state=active]:bg-transparent",
  "data-[state=active]:shadow-none",
  "data-[state=active]:after:absolute",
  "data-[state=active]:after:bottom-0",
  "data-[state=active]:after:left-1/2",
  "data-[state=active]:after:-translate-x-1/2",
  "data-[state=active]:after:w-full",
  "data-[state=active]:after:h-0.5",
  "data-[state=active]:after:bg-gradient-to-r",
  "data-[state=active]:after:from-transparent",
  "data-[state=active]:after:via-primary",
  "data-[state=active]:after:to-transparent",
  "relative",
].join(" ");

// Navigation active states
export const NAV_ACTIVE_WITH_UNDERLINE = [
  "text-white",
  ...ACTIVE_UNDERLINE_MEDIUM.split(" "),
].join(" ");

// Button active states (for future use)
export const BUTTON_ACTIVE_PRIMARY = "bg-primary text-primary-foreground";
export const BUTTON_ACTIVE_SECONDARY = "bg-secondary text-secondary-foreground";

// Link active states (for future use)
export const LINK_ACTIVE_UNDERLINE = "text-primary underline underline-offset-4";
export const LINK_ACTIVE_NO_UNDERLINE = "text-primary"; 