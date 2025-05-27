"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { LoadingSpinner } from "@/common/components/LoadingSpinner";
import CardWrapper from "@/common/components/cards/CardWrapper";
import SimpleCard from "@/common/components/cards/SimpleCard";
import { cn } from "@/common/helpers/utils";
import { TAB_ACTIVE_WITH_UNDERLINE } from "@/common/styles/activeStates";
import { TAB_BASE_STYLES, TAB_LIST_STYLES } from "@/common/styles/componentStyles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for now - this should come from an API
const mockPositions = Array.from({ length: 10 }, (_, i) => ({
  rank: i + 1,
  wallet: "plpld1tvj0vpdxhuu0tjxsskgf05f6ldp0xqjqvywptrs0fvvvhvecjqtaxv...",
  liquidityProvided: "2.00 USDC",
}));

interface Position {
  rank: number;
  wallet: string;
  liquidityProvided: string;
}

export function LQTPositionsTable() {
  const [isLoading] = useState(false);

  const truncateWallet = (wallet: string) => {
    if (wallet.length <= 20) return wallet;
    return `${wallet.slice(0, 20)}...`;
  };

  const renderTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="border-neutral-800 hover:bg-transparent">
          <TableHead className="text-neutral-400 text-sm font-medium py-3 px-4">Rank</TableHead>
          <TableHead className="text-neutral-400 text-sm font-medium py-3 px-4">Wallet</TableHead>
          <TableHead className="text-neutral-400 text-sm font-medium py-3 px-4 text-right">
            Liquidity Provided
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockPositions.map((position) => (
          <TableRow
            key={position.rank}
            className="border-neutral-800 hover:bg-neutral-800/50 transition-colors"
          >
            <TableCell className="text-white text-sm py-3 px-4">{position.rank}</TableCell>
            <TableCell className="text-white text-sm py-3 px-4">
              <div className="flex items-center space-x-2">
                <span className="font-mono">{truncateWallet(position.wallet)}</span>
                <ExternalLink className="h-3 w-3 text-neutral-400 hover:text-white cursor-pointer" />
              </div>
            </TableCell>
            <TableCell className="text-white text-sm py-3 px-4 text-right">
              {position.liquidityProvided}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <SimpleCard title="Positions" titleClassName="text-white text-lg font-medium mb-6">
      <CardWrapper>
        <Tabs defaultValue="all-time" className="w-full">
          <TabsList className={TAB_LIST_STYLES}>
            <TabsTrigger
              value="all-time"
              className={cn(TAB_BASE_STYLES, "mr-8", TAB_ACTIVE_WITH_UNDERLINE)}
            >
              All Time
            </TabsTrigger>
            <TabsTrigger
              value="last-month"
              className={cn(TAB_BASE_STYLES, TAB_ACTIVE_WITH_UNDERLINE)}
            >
              Last Month
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-time" className="mt-0">
            {isLoading ? <LoadingSpinner className="h-20 w-20 mx-auto" /> : renderTable()}
          </TabsContent>

          <TabsContent value="last-month" className="mt-0">
            {isLoading ? <LoadingSpinner className="h-20 w-20 mx-auto" /> : renderTable()}
          </TabsContent>
        </Tabs>
      </CardWrapper>
    </SimpleCard>
  );
}
