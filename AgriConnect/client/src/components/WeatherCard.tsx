import { Card } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";

interface WeatherCardProps {
  city: string;
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy";
  humidity: number;
  windSpeed: number;
}

export function WeatherCard({
  city,
  temperature,
  condition,
  humidity,
  windSpeed,
}: WeatherCardProps) {
  const getWeatherIcon = () => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-16 w-16 text-primary" />;
      case "cloudy":
        return <Cloud className="h-16 w-16 text-muted-foreground" />;
      case "rainy":
        return <CloudRain className="h-16 w-16 text-primary" />;
    }
  };

  return (
    <Card className="p-6" data-testid={`card-weather-${city.toLowerCase()}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">{city}</h3>
        <div className="flex justify-center mb-4">{getWeatherIcon()}</div>
        <div className="text-4xl font-bold font-mono mb-2">{temperature}°C</div>
        <p className="text-sm text-muted-foreground capitalize mb-4">{condition}</p>
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Wind className="h-4 w-4" />
            <span>{windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💧</span>
            <span>{humidity}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
