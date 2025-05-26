import { CardDescription } from "@/common/components/card";
import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { cn } from "@/common/helpers/utils";
import AnimatedNumber from "@/components/AnimatedNumber";
import React from "react";
import SimpleCard from "./SimpleCard"; // Import the new SimpleCard

export interface InfoCardProps {
  title: string;
  isLoading: boolean;
  value?: number | string;
  children?: React.ReactNode;
  description?: string | React.ReactNode;
  valueFormatter?: (val: number) => string;
  valuePrefix?: string;
  valueSuffix?: string;
  cardClassName?: string;
  titleClassName?: string;
  valueClassName?: string;
  descriptionClassName?: string;
  icon?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  isLoading,
  value,
  children,
  description,
  valueFormatter,
  valuePrefix = "",
  valueSuffix = "",
  cardClassName,
  titleClassName,
  valueClassName,
  descriptionClassName,
  icon,
}) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner className="h-10 w-10 mx-auto my-2" />;
    }

    let content;
    if (typeof value === "number") {
      content = <AnimatedNumber value={value} format={valueFormatter} />;
    } else if (value) {
      content = <>{value}</>;
    } else if (children) {
      content = children;
    } else {
      return null;
    }
    return (
      <>
        {valuePrefix}
        {content}
        {valueSuffix}
      </>
    );
  };

  return (
    <SimpleCard
      title={title}
      icon={icon}
      cardClassName={cardClassName}
      titleClassName={titleClassName}
    >
      <div className={cn("text-4xl font-bold text-primary my-2", valueClassName)}>
        {renderContent()}
      </div>

      {description &&
        (typeof description === "string" ? (
          <CardDescription className={cn("text-xs text-neutral-500 mt-1", descriptionClassName)}>
            {description}
          </CardDescription>
        ) : (
          <div className={cn("text-xs text-neutral-500 mt-1", descriptionClassName)}>
            {description}
          </div>
        ))}
    </SimpleCard>
  );
};

export default InfoCard;
