import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { PriceTable } from "@/components/PriceTable";
import { WeatherCard } from "@/components/WeatherCard";
import { PriceChart, PriceDataPoint } from "@/components/PriceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingDown, TrendingUp, Sprout } from "lucide-react";
import {
  marketApi,
  weatherApi,
  priceHistoryApi,
  type MarketData,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function FarmerDashboard() {
  const [, navigate] = useLocation();
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    region: string;
  } | null>(null);
  const [isUrdu, setIsUrdu] = useState(false);

  const { data: marketData = [], isLoading } = useQuery({
    queryKey: ["/api/market-data"],
    queryFn: marketApi.getAll,
  });

  const { data: weatherData = [] } = useQuery({
    queryKey: ["/api/weather"],
    queryFn: weatherApi.get,
  });

  const { data: priceHistory = [] } = useQuery({
    queryKey: ["/api/price-history", selectedItem?.name, selectedItem?.region],
    queryFn: () =>
      selectedItem
        ? priceHistoryApi.get(selectedItem.name, selectedItem.region, 7)
        : Promise.resolve([]),
    enabled: !!selectedItem,
  });

  const tableData = marketData.map((item) => ({
    id: item.id,
    itemName: item.itemName,
    itemType: item.itemType,
    region: item.region,
    currentPrice: parseFloat(item.currentPrice),
    previousPrice: parseFloat(item.currentPrice) * 0.95,
    unit: item.unit,
  }));

  const avgPrice =
    marketData.length > 0
      ? Math.round(
          marketData.reduce(
            (sum, item) => sum + parseFloat(item.currentPrice),
            0
          ) / marketData.length
        )
      : 0;

  const priceIncreases = tableData.filter(
    (item) => item.currentPrice > item.previousPrice
  ).length;
  const priceDecreases = tableData.filter(
    (item) => item.currentPrice < item.previousPrice
  ).length;

  const multiCropItems = ["Tomato", "Potato", "Onion"];
  const multiCropData: PriceDataPoint[] = [];

  const handleViewTrend = (itemName: string) => {
    const item = marketData.find((d) => d.itemName === itemName);
    if (item) {
      setSelectedItem({ name: item.itemName, region: item.region });
    }
  };

  const chartData: PriceDataPoint[] = priceHistory.map((h) => ({
    date: new Date(h.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    price: parseFloat(h.price),
  }));

  // Urdu localization for market list items (showcase only)
  const urduItemMap: Record<string, string> = {
    Tomato: "ٹماٹر",
    Potato: "آلو",
    Onion: "پیاز",
    Mango: "آم",
    Apple: "سیب",
    Carrot: "گاجر",
  };
  const urduTypeMap: Record<string, string> = {
    vegetable: "سبزی",
    fruit: "پھل",
  };
  const urduRegionMap: Record<string, string> = {
    Punjab: "پنجاب",
    Sindh: "سندھ",
    KPK: "خیبر پختونخوا",
    Balochistan: "بلوچستان",
  };
  const urduUnitMap: Record<string, string> = {
    kg: "کلو",
    Kg: "کلو",
    KG: "کلو",
  };

  const localizedTableData = isUrdu
    ? tableData.map((row) => ({
        ...row,
        itemName: urduItemMap[row.itemName] || row.itemName,
        itemType:
          urduTypeMap[row.itemType?.toLowerCase?.() || row.itemType] ||
          row.itemType,
        region: urduRegionMap[row.region] || row.region,
        unit: urduUnitMap[row.unit] ? `${urduUnitMap[row.unit]}` : row.unit,
      }))
    : tableData;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">
              {isUrdu ? "کاشتکار ڈیش بورڈ" : "Farmer Dashboard"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isUrdu
                ? "مارکیٹ ریٹس، موسم کی تازہ کاری اور قیمتوں کے رجحانات دیکھیں"
                : "View market rates, weather updates, and price trends"}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              onClick={() => setIsUrdu((v) => !v)}
              data-testid="button-toggle-language"
            >
              {isUrdu ? "Switch to English" : "اردو میں دیکھیں"}
            </Button>
            <Button
              onClick={() => navigate("/farmer/advice")}
              data-testid="button-open-advice"
            >
              {isUrdu ? "سمارٹ کسان مشورہ" : "Smart Farmer Advice"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/farmer/community")}
              data-testid="button-open-community"
            >
              {isUrdu ? "کمیونٹی فورم" : "Community Forum"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            label={isUrdu ? "اوسط قیمت" : "Average Price"}
            value={`PKR ${avgPrice}`}
            icon={Sprout}
          />
          <StatsCard
            label={isUrdu ? "قیمت میں اضافہ" : "Price Increases"}
            value={priceIncreases}
            icon={TrendingUp}
          />
          <StatsCard
            label={isUrdu ? "قیمت میں کمی" : "Price Decreases"}
            value={priceDecreases}
            icon={TrendingDown}
          />
        </div>

        <Tabs defaultValue="prices" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
            <TabsTrigger value="prices" data-testid="tab-prices">
              {isUrdu ? "مارکیٹ قیمتیں" : "Market Prices"}
            </TabsTrigger>
            <TabsTrigger value="weather" data-testid="tab-weather">
              {isUrdu ? "موسم" : "Weather"}
            </TabsTrigger>
            <TabsTrigger value="trends" data-testid="tab-trends">
              {isUrdu ? "قیمتوں کے رجحانات" : "Price Trends"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prices" className="space-y-6">
            {isLoading ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  {isUrdu
                    ? "مارکیٹ ڈیٹا لوڈ ہو رہا ہے..."
                    : "Loading market data..."}
                </p>
              </Card>
            ) : (
              <PriceTable
                data={localizedTableData}
                isAdmin={false}
                onViewTrend={handleViewTrend}
              />
            )}
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {weatherData.map((weather) => (
                <WeatherCard key={weather.city} {...weather} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="p-6">
              <p className="text-muted-foreground text-center">
                {isUrdu
                  ? "7 دن کا رجحان دیکھنے کے لیے مارکیٹ قیمتوں میں آئٹم کے آئیکن پر کلک کریں"
                  : "Click on any item's trend icon in the Market Prices tab to view its 7-day price trend"}
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.name} Price Trend - {selectedItem?.region}
            </DialogTitle>
          </DialogHeader>
          {chartData.length > 0 && (
            <PriceChart
              title={`${selectedItem?.name} - 7 Day Trend`}
              data={chartData}
              dateRange="Last 7 Days"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
