import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { PriceTable } from "@/components/PriceTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, TrendingUp, MapPin, Plus } from "lucide-react";
import { marketApi, statsApi, type MarketData } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

export default function AdminDashboard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketData | null>(null);
  const { toast } = useToast();

  const { data: marketData = [], isLoading } = useQuery({
    queryKey: ["/api/market-data"],
    queryFn: marketApi.getAll,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: statsApi.get,
  });

  const createMutation = useMutation({
    mutationFn: marketApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/market-data"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setIsAddDialogOpen(false);
      toast({ title: "Success", description: "Item added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add item", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<MarketData, "id" | "updatedAt">> }) =>
      marketApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/market-data"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast({ title: "Success", description: "Item updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update item", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: marketApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/market-data"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Success", description: "Item deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    },
  });

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      itemName: formData.get("itemName") as string,
      itemType: formData.get("itemType") as string,
      region: formData.get("region") as string,
      currentPrice: formData.get("price") as string,
      unit: formData.get("unit") as string,
    });
  };

  const handleEditItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({
      id: editingItem.id,
      data: {
        currentPrice: formData.get("price") as string,
      },
    });
  };

  const handleEdit = (id: string) => {
    const item = marketData.find((d) => d.id === id);
    if (item) {
      setEditingItem(item);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  const tableData = marketData.map((item) => ({
    id: item.id,
    itemName: item.itemName,
    itemType: item.itemType,
    region: item.region,
    currentPrice: parseFloat(item.currentPrice),
    previousPrice: parseFloat(item.currentPrice) * 0.95,
    unit: item.unit,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage market data and monitor statistics
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Button
              className="gap-2"
              data-testid="button-add-item"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Market Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    name="itemName"
                    placeholder="e.g., Tomato"
                    data-testid="input-item-name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemType">Type</Label>
                    <Select name="itemType" required>
                      <SelectTrigger data-testid="select-item-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetable">Vegetable</SelectItem>
                        <SelectItem value="fruit">Fruit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select name="region" required>
                      <SelectTrigger data-testid="select-region">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Punjab">Punjab</SelectItem>
                        <SelectItem value="Sindh">Sindh</SelectItem>
                        <SelectItem value="KPK">KPK</SelectItem>
                        <SelectItem value="Balochistan">Balochistan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (PKR)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      data-testid="input-price"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      name="unit"
                      defaultValue="kg"
                      data-testid="input-unit"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" data-testid="button-submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Adding..." : "Add Item"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            label="Total Items"
            value={stats?.totalItems || 0}
            icon={ShoppingCart}
          />
          <StatsCard
            label="Avg Price"
            value={`PKR ${stats?.avgPrice || 0}`}
            icon={TrendingUp}
          />
          <StatsCard label="Regions Covered" value={stats?.regions || 0} icon={MapPin} />
        </div>

        {isLoading ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading market data...</p>
          </Card>
        ) : (
          <PriceTable
            data={tableData}
            isAdmin={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewTrend={(itemName) => console.log("View trend:", itemName)}
          />
        )}
      </main>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Market Price</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleEditItem} className="space-y-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input value={editingItem.itemName} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">New Price (PKR)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingItem.currentPrice}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
