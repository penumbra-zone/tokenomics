import React from 'react';
import CardWrapper from '@/components/ui/CardWrapper';
import { CardTitle, CardDescription } from "@/common/components/ui/Card"; // Assuming these are correctly pathed from MarketCapCard
import { LoadingSpinner } from '@/common/components/ui/LoadingSpinner';
import AnimatedNumber from '@/components/AnimatedNumber';
import { cn } from '@/common/helpers/utils';

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
  valuePrefix = '',
  valueSuffix = '',
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
    if (typeof value === 'number') {
      content = <AnimatedNumber value={value} format={valueFormatter} />;
    } else if (value) {
      content = <>{value}</>;
    } else if (children) {
      content = children;
    } else {
      return null;
    }
    return <>{valuePrefix}{content}{valueSuffix}</>;
  };

  return (
    <CardWrapper className={cardClassName}>
      <CardTitle className={cn("text-base font-medium text-neutral-50 mb-1 flex items-center", titleClassName)}>
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </CardTitle>
      
      <div className={cn("text-4xl font-bold text-primary my-2", valueClassName)}>
        {renderContent()}
      </div>

      {description && (
        <CardDescription className={cn("text-xs text-neutral-500 mt-1", descriptionClassName)}>
          {description}
        </CardDescription>
      )}
    </CardWrapper>
  );
};

export default InfoCard; 