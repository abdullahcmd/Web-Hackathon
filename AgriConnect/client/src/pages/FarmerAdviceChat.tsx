import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Sprout, Send } from "lucide-react";
import { marketApi, weatherApi } from "@/lib/api";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export default function FarmerAdviceChat() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-0",
      role: "assistant",
      content:
        "Assalam-o-Alaikum! I’m your Smart Farmer assistant. Ask about prices, weather or crop care.",
      timestamp: Date.now(),
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  // Load latest weather and market snapshot for lightweight, local advice
  const [weather, setWeather] = useState<any[]>([]);
  const [market, setMarket] = useState<any[]>([]);

  useEffect(() => {
    weatherApi
      .get()
      .then(setWeather)
      .catch(() => setWeather([]));
    marketApi
      .getAll()
      .then(setMarket)
      .catch(() => setMarket([]));
  }, []);

  const latestWeather = useMemo(() => weather[0], [weather]);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const push = (role: ChatMessage["role"], content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        role,
        content,
        timestamp: Date.now(),
      },
    ]);
  };

  // Very simple rule-based advice engine
  const generateAdvice = (text: string): string => {
    const t = text.toLowerCase();

    // Weather-aware hints
    if (latestWeather) {
      if (latestWeather.condition === "rainy") {
        return "Rain expected. Avoid watering fields today and ensure proper drainage.";
      }
      if (latestWeather.temperature >= 35) {
        return "High temperatures today. Water in early morning or evening to reduce evaporation.";
      }
      if (latestWeather.condition === "cloudy") {
        return "Cloudy weather; consider reducing irrigation slightly and monitor soil moisture.";
      }
    }

    // Price-aware hints
    const tomato = market.find(
      (m) => String(m.itemName).toLowerCase() === "tomato"
    );
    if (t.includes("tomato") && tomato) {
      return Number(tomato.currentPrice) > 150
        ? "Tomato prices are rising; consider selling within the next two days."
        : "Tomato prices are stable; monitor the market for a better window.";
    }

    // Generic intents
    if (t.includes("pest") || t.includes("spray")) {
      return "Inspect leaves early morning. Use integrated pest management and avoid spraying before rainfall.";
    }
    if (t.includes("fertil") || t.includes("urea") || t.includes("npk")) {
      return "Apply balanced NPK based on soil tests. Avoid overuse of urea; split doses around irrigation for best uptake.";
    }
    if (t.includes("seed") || t.includes("variety")) {
      return "Choose certified seeds suited to your region and season; ensure proper spacing for better yield.";
    }

    return "Keep monitoring local prices and weather. Share crop and region for more specific advice.";
  };

  // Google Gemini integration (client-side). Uses env var or provided fallback key
  const GEMINI_API_KEY =
    (import.meta as any)?.env?.VITE_GEMINI_API_KEY ||
    "AIzaSyB2S07NxCrbo6VNkhE2INHBwEI1tn5XFx0";

  const buildPrompt = (userText: string) => {
    const w = latestWeather
      ? `Weather context: city=${latestWeather.city || "unknown"}, temp=${
          latestWeather.temperature
        }°C, condition=${latestWeather.condition}, humidity=${
          latestWeather.humidity
        }%, wind=${latestWeather.windSpeed}km/h.`
      : "Weather context: unavailable.";
    const m =
      market
        .slice(0, 6)
        .map(
          (x) =>
            `${x.itemName} (${x.itemType || "item"}) in ${x.region}: PKR ${
              x.currentPrice
            }/${x.unit || "kg"}`
        )
        .join("; ") || "No market items available.";
    const system = `You are Smart Farmer, a concise agricultural assistant for Pakistani farmers. Use the provided weather and market context. Reply in 1-3 short sentences with practical advice. Avoid medical/chemical specifics; give safe, general guidance.`;
    const instruction = `User question: ${userText}`;
    return `${system}\n${w}\nMarket context: ${m}\n${instruction}`;
  };

  const askGemini = async (text: string): Promise<string> => {
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: buildPrompt(text) }],
              },
            ],
          }),
        }
      );

      if (!resp.ok) {
        throw new Error(`Gemini API error ${resp.status}`);
      }

      const data = await resp.json();
      const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof textOut === "string" && textOut.trim().length > 0)
        return textOut.trim();
      return generateAdvice(text); // fallback to rule-based if output missing
    } catch (e: any) {
      console.error("Gemini request failed", e);
      return generateAdvice(text);
    }
  };

  const onSend = async () => {
    const text = input.trim();
    if (!text) return;
    push("user", text);
    setInput("");
    setIsSending(true);
    const reply = await askGemini(text);
    push("assistant", reply);
    setIsSending(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Smart Farmer Advice</h1>
        </div>

        <Card className="p-0 overflow-hidden">
          <div
            ref={containerRef}
            className="h-[60vh] overflow-y-auto p-4 space-y-4 bg-muted/30"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "assistant"
                      ? "bg-background border"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex items-center gap-2">
            <Input
              placeholder="Ask about prices, weather, irrigation, pests..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <Button
              onClick={onSend}
              data-testid="button-send"
              disabled={isSending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
