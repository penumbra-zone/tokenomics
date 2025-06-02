import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { cn } from "@/common/helpers/utils";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface ShareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  isContentLoading?: boolean;
}

export default function ShareButton({ className, isContentLoading, ...props }: ShareButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isContentLoading}
      className={cn("text-neutral-50 hover:bg-primary/60", className)}
      {...props}
    >
      {isContentLoading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span className="hidden md:inline md:ml-2">{props.text ?? "Share"}</span>
        </>
      )}
    </Button>
  );
}
