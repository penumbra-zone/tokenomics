import { cn } from "@/common/helpers/utils";
import { Button } from "@/components/ui/button";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ShareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function ShareButton({ className, children, ...props }: PropsWithChildren<ShareButtonProps>) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "border-primary text-neutral-50 hover:bg-primary/60",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
} 