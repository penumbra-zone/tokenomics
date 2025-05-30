import Image from "next/image";
import React from "react";

import { cn } from "@/common/helpers/utils";

interface SharePreviewWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SharePreviewWrapper = React.forwardRef<HTMLDivElement, SharePreviewWrapperProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-neutral-900 border border-neutral-800 rounded-lg p-6 min-h-[400px] flex flex-col justify-between",
          className
        )}
        {...props}
      >
        {/* Main content */}
        <div className="flex-grow">{children}</div>

        {/* Penumbra branding at the bottom */}
        <div className="flex justify-center items-center mt-6 pt-4 border-t border-neutral-800">
          <Image
            src="/penumbra-logo.svg"
            alt="Penumbra"
            width={120}
            height={24}
            className="opacity-80"
          />
        </div>
      </div>
    );
  }
);

SharePreviewWrapper.displayName = "SharePreviewWrapper";

export default SharePreviewWrapper;
