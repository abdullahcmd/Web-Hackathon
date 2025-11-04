import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowUp, ArrowDown, Edit, Trash2, TrendingUp } from "lucide-react";

export interface PriceData {
  id: string;
  itemName: string;
  itemType: string;
  region: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
}

interface PriceTableProps {
  data: PriceData[];
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewTrend?: (itemName: string) => void;
}

export function PriceTable({
  data,
  isAdmin = false,
  onEdit,
  onDelete,
  onViewTrend,
}: PriceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const regions = Array.from(new Set(data.map((item) => item.region)));
  const types = Array.from(new Set(data.map((item) => item.itemType)));

  const filteredData = data.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === "all" || item.region === regionFilter;
    const matchesType = typeFilter === "all" || item.itemType === typeFilter;
    return matchesSearch && matchesRegion && matchesType;
  });

  const getPriceChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: change.toFixed(1),
      isPositive: change >= 0,
    };
  };

  return (
    <Card className="p-6" data-testid="card-price-table">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vegetables or fruits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-items"
          />
        </div>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-full md:w-40" data-testid="select-region-filter">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-40" data-testid="select-type-filter">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Previous Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => {
              const change = getPriceChange(item.currentPrice, item.previousPrice);
              return (
                <TableRow key={item.id} data-testid={`row-item-${item.id}`}>
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell className="capitalize">{item.itemType}</TableCell>
                  <TableCell>{item.region}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    PKR {item.currentPrice}/{item.unit}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    PKR {item.previousPrice}/{item.unit}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {change.isPositive ? (
                        <ArrowUp className="h-3 w-3 text-destructive" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-primary" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          change.isPositive ? "text-destructive" : "text-primary"
                        }`}
                      >
                        {Math.abs(parseFloat(change.value))}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewTrend?.(item.itemName)}
                        data-testid={`button-trend-${item.id}`}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit?.(item.id)}
                            data-testid={`button-edit-${item.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete?.(item.id)}
                            data-testid={`button-delete-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found</p>
        </div>
      )}
    </Card>
  );
}
