import { PriceTable } from "../PriceTable";

export default function PriceTableExample() {
  const mockData = [
    {
      id: "1",
      itemName: "Tomato",
      itemType: "vegetable",
      region: "Punjab",
      currentPrice: 95,
      previousPrice: 88,
      unit: "kg",
    },
    {
      id: "2",
      itemName: "Potato",
      itemType: "vegetable",
      region: "Sindh",
      currentPrice: 58,
      previousPrice: 62,
      unit: "kg",
    },
    {
      id: "3",
      itemName: "Onion",
      itemType: "vegetable",
      region: "KPK",
      currentPrice: 132,
      previousPrice: 125,
      unit: "kg",
    },
    {
      id: "4",
      itemName: "Mango",
      itemType: "fruit",
      region: "Sindh",
      currentPrice: 180,
      previousPrice: 175,
      unit: "kg",
    },
    {
      id: "5",
      itemName: "Apple",
      itemType: "fruit",
      region: "Balochistan",
      currentPrice: 220,
      previousPrice: 230,
      unit: "kg",
    },
  ];

  return (
    <div className="p-8">
      <PriceTable
        data={mockData}
        isAdmin={true}
        onEdit={(id) => console.log("Edit clicked:", id)}
        onDelete={(id) => console.log("Delete clicked:", id)}
        onViewTrend={(itemName) => console.log("View trend:", itemName)}
      />
    </div>
  );
}
