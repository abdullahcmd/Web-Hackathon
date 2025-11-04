import { PriceChart } from "../PriceChart";

export default function PriceChartExample() {
  const singleCropData = [
    { date: "Jan 1", price: 80 },
    { date: "Jan 2", price: 85 },
    { date: "Jan 3", price: 82 },
    { date: "Jan 4", price: 90 },
    { date: "Jan 5", price: 88 },
    { date: "Jan 6", price: 92 },
    { date: "Jan 7", price: 95 },
  ];

  const multiCropData = [
    { date: "Jan 1", price: 80, itemName: "Tomato" },
    { date: "Jan 2", price: 85, itemName: "Tomato" },
    { date: "Jan 3", price: 82, itemName: "Tomato" },
    { date: "Jan 4", price: 90, itemName: "Tomato" },
    { date: "Jan 5", price: 88, itemName: "Tomato" },
    { date: "Jan 6", price: 92, itemName: "Tomato" },
    { date: "Jan 7", price: 95, itemName: "Tomato" },
    { date: "Jan 1", price: 50, itemName: "Potato" },
    { date: "Jan 2", price: 52, itemName: "Potato" },
    { date: "Jan 3", price: 48, itemName: "Potato" },
    { date: "Jan 4", price: 55, itemName: "Potato" },
    { date: "Jan 5", price: 53, itemName: "Potato" },
    { date: "Jan 6", price: 56, itemName: "Potato" },
    { date: "Jan 7", price: 58, itemName: "Potato" },
    { date: "Jan 1", price: 120, itemName: "Onion" },
    { date: "Jan 2", price: 118, itemName: "Onion" },
    { date: "Jan 3", price: 125, itemName: "Onion" },
    { date: "Jan 4", price: 122, itemName: "Onion" },
    { date: "Jan 5", price: 130, itemName: "Onion" },
    { date: "Jan 6", price: 128, itemName: "Onion" },
    { date: "Jan 7", price: 132, itemName: "Onion" },
  ];

  return (
    <div className="space-y-8 p-8">
      <PriceChart
        title="Tomato Price Trend"
        data={singleCropData}
        dateRange="January 1-7, 2025"
      />
      <PriceChart
        title="Multi-Crop Comparison"
        data={multiCropData}
        multiCrop={true}
        dateRange="January 1-7, 2025"
      />
    </div>
  );
}
