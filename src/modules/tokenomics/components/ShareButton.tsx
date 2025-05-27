import { cn } from "@/common/helpers/utils";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface ShareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function ShareButton({ className, ...props }: ShareButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("border-primary text-neutral-50 hover:bg-primary/60", className)}
      {...props}
    >
      <Share2 className="h-4 w-4" />
      <span className="hidden md:inline md:ml-2">Share</span>
    </Button>
  );
}
