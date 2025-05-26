import { cn } from "@/common/helpers/utils";
import React from "react";
import { Card } from "../../../components/ui/card";

interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ children, className, ...props }) => {
  return (
    <Card
      className={cn(
        "bg-neutral-900 border-neutral-800 rounded-lg p-6 min-h-[160px] flex flex-col justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

export default CardWrapper;
