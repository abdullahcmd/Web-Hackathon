// Dummy/Mock implementations - no backend required

export interface User {
  id: string;
  username: string;
  role: "admin" | "farmer";
  fullName?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface MarketData {
  id: string;
  itemName: string;
  itemType: string;
  region: string;
  currentPrice: string;
  unit: string;
  updatedAt: Date;
}

export interface PriceHistory {
  id: string;
  itemName: string;
  region: string;
  price: string;
  date: Date;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy";
  humidity: number;
  windSpeed: number;
}

export interface Stats {
  totalItems: number;
  avgPrice: number;
  regions: number;
}

// Dummy market data
const dummyMarketData: MarketData[] = [
  {
    id: "1",
    itemName: "Tomato",
    itemType: "vegetable",
    region: "Punjab",
    currentPrice: "95.00",
    unit: "kg",
    updatedAt: new Date(),
  },
  {
    id: "2",
    itemName: "Potato",
    itemType: "vegetable",
    region: "Sindh",
    currentPrice: "58.00",
    unit: "kg",
    updatedAt: new Date(),
  },
  {
    id: "3",
    itemName: "Onion",
    itemType: "vegetable",
    region: "KPK",
    currentPrice: "132.00",
    unit: "kg",
    updatedAt: new Date(),
  },
  {
    id: "4",
    itemName: "Mango",
    itemType: "fruit",
    region: "Sindh",
    currentPrice: "180.00",
    unit: "kg",
    updatedAt: new Date(),
  },
  {
    id: "5",
    itemName: "Apple",
    itemType: "fruit",
    region: "Balochistan",
    currentPrice: "220.00",
    unit: "kg",
    updatedAt: new Date(),
  },
  {
    id: "6",
    itemName: "Carrot",
    itemType: "vegetable",
    region: "Punjab",
    currentPrice: "72.00",
    unit: "kg",
    updatedAt: new Date(),
  },
];

// In-memory storage for dummy data (simulates backend)
let marketDataStore = [...dummyMarketData];

// Helper to generate dummy price history
function generatePriceHistory(itemName: string, region: string, days: number): PriceHistory[] {
  const history: PriceHistory[] = [];
  const basePrice = parseFloat(
    marketDataStore.find((item) => item.itemName === itemName && item.region === region)?.currentPrice || "100"
  );
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const variance = 0.15;
    const price = (basePrice * (0.85 + Math.random() * variance)).toFixed(2);
    
    history.push({
      id: `ph-${itemName}-${region}-${i}`,
      itemName,
      region,
      price,
      date,
    });
  }
  
  return history;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Dummy authentication - accept admin/admin123 or farmer/farmer123
    if (
      (credentials.username === "admin" && credentials.password === "admin123") ||
      (credentials.username === "farmer" && credentials.password === "farmer123")
    ) {
      const user: User = {
        id: credentials.username === "admin" ? "admin-1" : "farmer-1",
        username: credentials.username,
        role: credentials.username === "admin" ? "admin" : "farmer",
        fullName: credentials.username === "admin" ? "Admin User" : "Ahmed Khan",
      };
      
      // Store in localStorage for session
      localStorage.setItem("dummy_user", JSON.stringify(user));
      
      return { user };
    }
    
    throw new Error("Invalid credentials");
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    localStorage.removeItem("dummy_user");
  },

  me: async (): Promise<{ user: User }> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const storedUser = localStorage.getItem("dummy_user");
    if (storedUser) {
      return { user: JSON.parse(storedUser) };
    }
    
    throw new Error("Not authenticated");
  },
};

export const marketApi = {
  getAll: async (): Promise<MarketData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...marketDataStore];
  },

  getById: async (id: string): Promise<MarketData> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const item = marketDataStore.find((item) => item.id === id);
    if (!item) throw new Error("Market data not found");
    return item;
  },

  create: async (data: Omit<MarketData, "id" | "updatedAt">): Promise<MarketData> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newItem: MarketData = {
      ...data,
      id: `item-${Date.now()}`,
      updatedAt: new Date(),
    };
    marketDataStore.push(newItem);
    return newItem;
  },

  update: async (id: string, data: Partial<Omit<MarketData, "id" | "updatedAt">>): Promise<MarketData> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = marketDataStore.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Market data not found");
    
    marketDataStore[index] = {
      ...marketDataStore[index],
      ...data,
      updatedAt: new Date(),
    };
    
    return marketDataStore[index];
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = marketDataStore.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Market data not found");
    marketDataStore.splice(index, 1);
  },
};

export const priceHistoryApi = {
  get: async (itemName: string, region: string, days = 7): Promise<PriceHistory[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return generatePriceHistory(itemName, region, days);
  },
};

export const weatherApi = {
  get: async (): Promise<WeatherData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [
      {
        city: "Karachi",
        temperature: 32,
        condition: "sunny",
        humidity: 65,
        windSpeed: 15,
      },
      {
        city: "Lahore",
        temperature: 28,
        condition: "cloudy",
        humidity: 70,
        windSpeed: 10,
      },
      {
        city: "Islamabad",
        temperature: 24,
        condition: "rainy",
        humidity: 85,
        windSpeed: 20,
      },
      {
        city: "Faisalabad",
        temperature: 30,
        condition: "sunny",
        humidity: 60,
        windSpeed: 12,
      },
      {
        city: "Multan",
        temperature: 35,
        condition: "sunny",
        humidity: 55,
        windSpeed: 8,
      },
    ];
  },
};

export const statsApi = {
  get: async (): Promise<Stats> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const allData = marketDataStore;
    const totalItems = allData.length;
    const avgPrice =
      allData.length > 0
        ? Math.round(
            allData.reduce((sum, item) => sum + parseFloat(item.currentPrice), 0) / allData.length
          )
        : 0;
    const regions = new Set(allData.map((item) => item.region)).size;

    return {
      totalItems,
      avgPrice,
      regions,
    };
  },
};
