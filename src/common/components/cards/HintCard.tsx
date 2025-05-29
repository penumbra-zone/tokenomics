import CardWrapper from "@/common/components/cards/CardWrapper";
import Image from "next/image";

export interface HintCardProps {
  title: string;
  description: string;
  iconSrc?: string;
  iconAlt?: string;
  className?: string;
}

export function HintCard({
  title,
  description,
  iconSrc = "/lightbulb.svg",
  iconAlt = "Hint icon",
  className,
}: HintCardProps) {
  return (
    <CardWrapper className={`h-full ${className || ""}`}>
      <div className="flex flex-row items-center h-full">
        <div className="flex-shrink-0 flex items-center h-full">
          <Image src={iconSrc} alt={iconAlt} width={24} height={24} />
        </div>
        <div className="ml-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-neutral-50">{title}</span>
          <span className="text-xs text-neutral-400 mt-1">{description}</span>
        </div>
      </div>
    </CardWrapper>
  );
}
