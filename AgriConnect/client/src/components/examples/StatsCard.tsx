import { StatsCard } from "../StatsCard";
import { ShoppingCart, TrendingUp, MapPin, Sprout } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
      <StatsCard
        label="Total Items"
        value={124}
        icon={ShoppingCart}
        trend={{ value: 12.5, isPositive: true }}
      />
      <StatsCard
        label="Avg Price"
        value="PKR 85"
        icon={TrendingUp}
        trend={{ value: 3.2, isPositive: false }}
      />
      <StatsCard
        label="Regions"
        value={5}
        icon={MapPin}
      />
      <StatsCard
        label="Crop Types"
        value={48}
        icon={Sprout}
      />
    </div>
  );
}
