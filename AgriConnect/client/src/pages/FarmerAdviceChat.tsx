import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Sprout, Send } from "lucide-react";
// Direct Gemini chat (no local rule hints)
import { GoogleGenAI } from "@google/genai";

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

  // No additional context needed

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

  // No rule-based advice; Gemini only

  // Google Gemini integration (client-side). Uses env var or provided fallback key
  const GEMINI_API_KEY =
    (import.meta as any)?.env?.VITE_GEMINI_API_KEY ||
    "Your-API Key";
  const gemini = useMemo(
    () => new GoogleGenAI({ apiKey: GEMINI_API_KEY }),
    [GEMINI_API_KEY]
  );

  const buildContents = (history: ChatMessage[], userText: string) => {
    const prior = history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    return [...prior, { role: "user", parts: [{ text: userText }] }];
  };

  const askGemini = async (text: string): Promise<string> => {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: buildContents(messages, text),
      });
      const textOut =
        (response as any)?.text ||
        (response as any)?.output_text ||
        (response as any)?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof textOut === "string" && textOut.trim().length > 0)
        return textOut.trim();
      return "Sorry, I couldn't generate a reply. Please try again.";
    } catch (e: any) {
      console.error("Gemini request failed", e);
      return "Sorry, I couldn't reach the AI service. Please try again.";
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
