import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sprout } from "lucide-react";
import marketImage from "@assets/generated_images/Pakistani_vegetable_market_scene_751faa3c.png";
import { useLocation } from "wouter";
import { apiFetch, endpoints } from "@/lib/api/url";
import { useAuth } from "@/lib/auth";

export default function CreateAccount() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { login: setAuthUser } = useAuth();

  const go = (path: string) => {
    try {
      (navigate as any)(path, { replace: true });
      setTimeout(() => {
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== path
        ) {
          window.location.assign(path);
        }
      }, 0);
    } catch {
      if (typeof window !== "undefined") window.location.assign(path);
    }
  };

  // Base URL and endpoints are centralized

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      // Register farmer account via API (username treated as email)
      const data = await apiFetch<{
        success: boolean;
        data: { user: any; token?: string };
      }>(endpoints.auth.register, {
        method: "POST",
        bodyJson: {
          name: fullName || username,
          email: username,
          password,
          role: "farmer",
        },
      });
      const token = data?.data?.token as string | undefined;
      const user = data?.data?.user as { role?: string } | undefined;

      if (!token || !user) {
        throw new Error("Malformed response from server");
      }

      // Persist auth (farmer receives token on registration)
      localStorage.setItem("auth_user", JSON.stringify(user));
      if (token) {
        localStorage.setItem("auth_token", token);
      }

      // Update auth context immediately
      try {
        setAuthUser(user as any, token);
      } catch {}

      toast({
        title: "Account created",
        description: "Welcome to the platform!",
      });
      // Navigate based on role (registration currently creates farmer accounts)
      if (user.role === "admin") {
        go("/admin");
      } else {
        go("/farmer");
      }
    } catch (error: any) {
      toast({
        title: "Account creation failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${marketImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-bold mb-4">
            Empowering Pakistani Farmers
          </h1>
          <p className="text-xl text-white/90">
            Access real-time market rates, weather insights, and price trends
            all in one place
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center gap-2 mb-6">
            <Sprout className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold">Create Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => go("/")}
            >
              Back to Login
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
