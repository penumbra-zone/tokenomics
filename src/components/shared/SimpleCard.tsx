import React from 'react';
import CardWrapper from '@/components/ui/CardWrapper';
import { CardTitle } from "@/common/components/ui/Card";
import { cn } from '@/common/helpers/utils';

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
      <CardTitle className={cn("text-base font-medium text-neutral-50 mb-1 flex items-center", titleClassName)}>
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </CardTitle>
      {children}
    </CardWrapper>
  );
};

export default SimpleCard; 