"use client";

import { createLucideIcon, type IconNode as LucideIconNode } from "lucide-react";

// Define the icon node structure explicitly if needed, or rely on LucideIconNode
const iconNode: LucideIconNode = [
  [
    "path",
    {
      d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
      strokeWidth: "0", // Ensuring no stroke is rendered, relying on fill
      fill: "currentColor", // Default fill, can be overridden by className or style
    },
  ],
];

const CustomXIcon = createLucideIcon("CustomX", iconNode);

export default CustomXIcon;
