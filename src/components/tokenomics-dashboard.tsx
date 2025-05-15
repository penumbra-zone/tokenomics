"use client";

import {
  BarChart3,
  CircleDollarSign,
  Coins,
  ExternalLink,
  GanttChartSquare,
  LineChart,
  Lock,
  Menu,
  Moon,
  PieChart,
  Sun,
  Wallet,
} from "lucide-react";

import { useState } from "react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function TokenomicsDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/20 via-transparent to-amber-900/20"></div>
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-emerald-700/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-1/2 h-1/2 rounded-full bg-amber-700/10 blur-3xl"></div>
      </div>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/90 backdrop-blur-lg border-r border-emerald-900/30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-emerald-900/30">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center">
                <Coins className="h-4 w-4 text-black" />
              </div>
              <span className="text-xl font-bold tracking-wider text-white">NEBULA</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm rounded-md bg-emerald-900/20 text-emerald-400 group"
            >
              <GanttChartSquare className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm rounded-md text-gray-400 hover:bg-emerald-900/10 hover:text-emerald-400 transition-colors group"
            >
              <PieChart className="mr-3 h-5 w-5" />
              <span>Distribution</span>
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm rounded-md text-gray-400 hover:bg-emerald-900/10 hover:text-emerald-400 transition-colors group"
            >
              <LineChart className="mr-3 h-5 w-5" />
              <span>Price History</span>
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm rounded-md text-gray-400 hover:bg-emerald-900/10 hover:text-emerald-400 transition-colors group"
            >
              <Lock className="mr-3 h-5 w-5" />
              <span>Vesting</span>
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm rounded-md text-gray-400 hover:bg-emerald-900/10 hover:text-emerald-400 transition-colors group"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              <span>Analytics</span>
            </a>
          </nav>

          <div className="p-4 border-t border-emerald-900/30">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-emerald-900/20"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-emerald-400" />
                )}
              </button>
              <a
                href="#"
                className="flex items-center text-sm text-emerald-400 hover:text-emerald-300"
              >
                <span className="mr-1">Docs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 md:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/50 backdrop-blur-lg border-b border-emerald-900/30">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-white">Tokenomics Dashboard</h1>
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/20 hover:text-emerald-300"
                    >
                      <CircleDollarSign className="h-4 w-4 mr-2" />
                      <span>$2.47</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current token price</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-black"
              >
                <Wallet className="h-4 w-4 mr-2" />
                <span>Connect Wallet</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black/60 border-emerald-900/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-400 text-lg">Total Supply</CardTitle>
                <CardDescription>Maximum token supply</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100,000,000</div>
                <div className="text-xs text-muted-foreground mt-1">NEBULA Tokens</div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-emerald-900/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-400 text-lg">Circulating Supply</CardTitle>
                <CardDescription>Currently in circulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42,750,000</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">42.75% of total</div>
                  <div className="text-xs text-emerald-400">↑ 1.2% (24h)</div>
                </div>
                <Progress value={42.75} className="h-1 mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-emerald-900/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-400 text-lg">Market Cap</CardTitle>
                <CardDescription>Current valuation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$105,592,500</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">Fully diluted: $247M</div>
                  <div className="text-xs text-amber-400">↓ 2.4% (24h)</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-emerald-900/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-400 text-lg">Staking APY</CardTitle>
                <CardDescription>Current staking rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4%</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">24.5M tokens staked</div>
                  <div className="text-xs text-emerald-400">↑ 0.3% (24h)</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Token distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-black/60 border-emerald-900/30 backdrop-blur-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-emerald-400">Token Distribution</CardTitle>
                <CardDescription>Allocation of total token supply</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full flex items-center justify-center">
                  <div className="relative w-full max-w-md aspect-square">
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>

                    {/* Community */}
                    <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-emerald-500 border-r-emerald-500 rotate-0"></div>

                    {/* Team & Advisors */}
                    <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-b-amber-500 rotate-[110deg]"></div>

                    {/* Foundation */}
                    <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-l-emerald-700 rotate-[200deg]"></div>

                    {/* Ecosystem */}
                    <div className="absolute inset-0 rounded-full border-[16px] border-transparent border-t-amber-700 rotate-[270deg]"></div>

                    {/* Center circle */}
                    <div className="absolute inset-[15%] rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-bold">100M</div>
                        <div className="text-xs text-muted-foreground">Total Supply</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <div className="text-sm">
                      <div className="font-medium">Community</div>
                      <div className="text-xs text-muted-foreground">40%</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <div className="text-sm">
                      <div className="font-medium">Team & Advisors</div>
                      <div className="text-xs text-muted-foreground">20%</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-700 mr-2"></div>
                    <div className="text-sm">
                      <div className="font-medium">Foundation</div>
                      <div className="text-xs text-muted-foreground">25%</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-700 mr-2"></div>
                    <div className="text-sm">
                      <div className="font-medium">Ecosystem</div>
                      <div className="text-xs text-muted-foreground">15%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-emerald-900/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-400">Vesting Schedule</CardTitle>
                <CardDescription>Token unlock timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Community</div>
                      <div className="text-sm font-medium">85% unlocked</div>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Team & Advisors</div>
                      <div className="text-sm font-medium">45% unlocked</div>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Foundation</div>
                      <div className="text-sm font-medium">30% unlocked</div>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Ecosystem</div>
                      <div className="text-sm font-medium">15% unlocked</div>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-medium mb-2">Next Unlock Events</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                        <span>Team Tokens (5%)</span>
                      </div>
                      <div className="text-muted-foreground">in 14 days</div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                        <span>Foundation (7.5%)</span>
                      </div>
                      <div className="text-muted-foreground">in 45 days</div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-700 mr-2"></div>
                        <span>Ecosystem (5%)</span>
                      </div>
                      <div className="text-muted-foreground">in 90 days</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Token metrics */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-black/60 border-emerald-900/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-400">Token Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="price" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="price">Price History</TabsTrigger>
                    <TabsTrigger value="volume">Trading Volume</TabsTrigger>
                    <TabsTrigger value="holders">Token Holders</TabsTrigger>
                    <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="price" className="space-y-4">
                    <div className="h-[300px] w-full relative">
                      {/* Simulated chart */}
                      <div className="absolute inset-0 flex items-end">
                        <div className="w-full h-full flex items-end">
                          {Array.from({ length: 30 }).map((_, i) => {
                            const height = 30 + Math.sin(i * 0.3) * 20 + Math.random() * 30;
                            return (
                              <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-emerald-500/50 to-emerald-500/5"
                                style={{ height: `${height}%` }}
                              ></div>
                            );
                          })}
                        </div>

                        {/* Chart line */}
                        <div className="absolute inset-0 flex items-end">
                          <svg className="w-full h-full" preserveAspectRatio="none">
                            <path
                              d={`M0,${70 + Math.sin(0) * 20} ${Array.from({
                                length: 30,
                              })
                                .map((_, i) => {
                                  const x = (i + 1) * (100 / 30);
                                  const y = 70 + Math.sin(i * 0.3) * 20;
                                  return `L${x},${y}`;
                                })
                                .join(" ")}`}
                              fill="none"
                              stroke="rgb(16, 185, 129)"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>

                        {/* Price markers */}
                        <div className="absolute inset-y-0 left-0 flex flex-col justify-between py-4 text-xs text-muted-foreground">
                          <div>$3.00</div>
                          <div>$2.50</div>
                          <div>$2.00</div>
                          <div>$1.50</div>
                          <div>$1.00</div>
                        </div>

                        {/* Time markers */}
                        <div className="absolute inset-x-0 bottom-0 flex justify-between px-8 text-xs text-muted-foreground">
                          <div>30d</div>
                          <div>20d</div>
                          <div>10d</div>
                          <div>Now</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="bg-black/40 border-emerald-900/20">
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground">Current Price</div>
                          <div className="text-lg font-bold">$2.47</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-black/40 border-emerald-900/20">
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground">All-Time High</div>
                          <div className="text-lg font-bold">$4.82</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-black/40 border-emerald-900/20">
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground">All-Time Low</div>
                          <div className="text-lg font-bold">$0.95</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-black/40 border-emerald-900/20">
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground">30d Change</div>
                          <div className="text-lg font-bold text-emerald-400">+12.8%</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="volume"
                    className="h-[400px] flex items-center justify-center"
                  >
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Volume data visualization would appear here</p>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="holders"
                    className="h-[400px] flex items-center justify-center"
                  >
                    <div className="text-center text-muted-foreground">
                      <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Token holders distribution would appear here</p>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="liquidity"
                    className="h-[400px] flex items-center justify-center"
                  >
                    <div className="text-center text-muted-foreground">
                      <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Liquidity metrics would appear here</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
