import CardWrapper from "@/common/components/cards/CardWrapper";
import { cn } from "@/common/helpers/utils";
import React from "react";
import { CardTitle } from "../../../components/ui/card";

export interface SimpleCardProps {
  title: string;
  icon?: React.ReactNode;
  cardClassName?: string;
  titleClassName?: string;
  children?: React.ReactNode;
}

const SimpleCard: React.FC<SimpleCardProps> = ({
  title,
  icon,
  cardClassName,
  titleClassName,
  children,
}) => {
  return (
    <CardWrapper className={cardClassName}>
      <CardTitle
        className={cn(
          "text-base font-medium text-neutral-50 mb-1 flex items-center",
          titleClassName
        )}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </CardTitle>
      {children}
    </CardWrapper>
  );
};

export default SimpleCard;
