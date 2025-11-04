import { WeatherCard } from "../WeatherCard";

export default function WeatherCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-8">
      <WeatherCard
        city="Karachi"
        temperature={32}
        condition="sunny"
        humidity={65}
        windSpeed={15}
      />
      <WeatherCard
        city="Lahore"
        temperature={28}
        condition="cloudy"
        humidity={70}
        windSpeed={10}
      />
      <WeatherCard
        city="Islamabad"
        temperature={24}
        condition="rainy"
        humidity={85}
        windSpeed={20}
      />
      <WeatherCard
        city="Faisalabad"
        temperature={30}
        condition="sunny"
        humidity={60}
        windSpeed={12}
      />
      <WeatherCard
        city="Multan"
        temperature={35}
        condition="sunny"
        humidity={55}
        windSpeed={8}
      />
    </div>
  );
}
