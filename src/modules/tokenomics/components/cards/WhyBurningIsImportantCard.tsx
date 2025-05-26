import CardWrapper from "@/common/components/cards/CardWrapper";
import Image from "next/image";

const mockData = {
  title: "Why is burning important?",
  description:
    "Burning permanently removes tokens from circulation. This reduces supply, which can help increase scarcity and potentially support value over time.",
};

export function WhyBurningIsImportantCard() {
  return (
    <CardWrapper className="h-full">
      <div className="flex flex-row items-center h-full">
        <div className="flex-shrink-0 flex items-center h-full">
          <Image src="/lightbulb.svg" alt="Lightbulb icon" width={24} height={24} />
        </div>
        <div className="ml-4 flex flex-col justify-center">
          <span className="text-sm font-medium text-neutral-50">{mockData.title}</span>
          <span className="text-xs text-neutral-400 mt-1">{mockData.description}</span>
        </div>
      </div>
    </CardWrapper>
  );
}
