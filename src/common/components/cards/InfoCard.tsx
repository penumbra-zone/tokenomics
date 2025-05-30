import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import { cn } from "@/common/helpers/utils";
import { defaultThemeColors, ThemeColors } from "@/common/styles/themeColors";
import AnimatedNumber from "@/components/AnimatedNumber";
import React from "react";
import SimpleCard from "./SimpleCard"; // Import the new SimpleCard

export interface InfoCardProps {
  title: string | React.ReactNode;
  isLoading: boolean;
  value?: number | string | React.ReactNode;
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
  themeColors?: ThemeColors;
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
  themeColors = defaultThemeColors,
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
      title={typeof title === "string" ? title : ""}
      icon={icon}
      cardClassName={cardClassName}
      titleClassName={titleClassName}
    >
      {typeof title !== "string" && (
        <div className={cn("text-lg font-semibold", titleClassName)}>{title}</div>
      )}

      <div
        className={cn("text-4xl font-bold my-2", valueClassName)}
        style={{ color: themeColors.primary.value.DEFAULT }}
      >
        {renderContent()}
      </div>

      {description &&
        (typeof description === "string" ? (
          <div
            className={cn("text-xs mt-1", descriptionClassName)}
            style={{ color: themeColors.textSecondary.value }}
          >
            {description}
          </div>
        ) : (
          <div
            className={cn("text-xs mt-1", descriptionClassName)}
            style={{ color: themeColors.textSecondary.value }}
          >
            {description}
          </div>
        ))}
    </SimpleCard>
  );
};

export default InfoCard;
