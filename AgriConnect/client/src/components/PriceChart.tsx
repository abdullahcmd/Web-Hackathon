import { Card } from "@/components/ui/card";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface PriceDataPoint {
  date: string;
  price: number;
  itemName?: string;
}

interface PriceChartProps {
  title: string;
  data: PriceDataPoint[];
  multiCrop?: boolean;
  dateRange?: string;
}

export function PriceChart({ title, data, multiCrop = false, dateRange }: PriceChartProps) {
  const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

  const processedData = multiCrop
    ? (() => {
        const groupedByDate: Record<string, any> = {};
        data.forEach((point) => {
          if (!groupedByDate[point.date]) {
            groupedByDate[point.date] = { date: point.date };
          }
          if (point.itemName) {
            groupedByDate[point.date][point.itemName] = point.price;
          }
        });
        return Object.values(groupedByDate);
      })()
    : data;

  const dataKeys = multiCrop
    ? Array.from(new Set(data.map((d) => d.itemName).filter(Boolean)))
    : ["price"];

  return (
    <Card className="p-6" data-testid={`chart-price-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        {dateRange && (
          <p className="text-sm text-muted-foreground mt-1">{dateRange}</p>
        )}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            label={{ value: "Price (PKR/kg)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          {multiCrop && <Legend />}
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
