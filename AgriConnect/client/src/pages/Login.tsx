import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sprout } from "lucide-react";
import { useLocation } from "wouter";
import marketImage from "@assets/generated_images/Pakistani_vegetable_market_scene_751faa3c.png";
import { apiFetch, endpoints } from "@/lib/api/url";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { login: setAuthUser } = useAuth();

  const go = (path: string) => {
    try {
      // Prefer SPA navigation
      (navigate as any)(path, { replace: true });
      // Fallback to hard navigation if SPA routing is not wired
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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     const data = await apiFetch<{
  //       success: boolean;
  //       data: { user: any; token?: string };
  //     }>(endpoints.auth.login, {
  //       method: "POST",
  //       bodyJson: { email: username, password },
  //     });
  //     const token = data?.data?.token as string | undefined;
  //     const user = data?.data?.user as { role?: string } | undefined;

  //     if (!user) {
  //       throw new Error("Malformed response from server");
  //     }

  //     // Persist auth: only store token if provided (farmer only)
  //     localStorage.setItem("auth_user", JSON.stringify(user));
  //     if (token) {
  //       localStorage.setItem("auth_token", token);
  //     } else {
  //       localStorage.removeItem("auth_token");
  //     }

  //     toast({ title: "Login successful" });

  //     // Navigate by role
  //     if (user.role === "farmer") {
  //       // navigate("/admin");
  //       navigate("/farmer");
  //     } else {
  //     }
  //   } catch (error: any) {
  //     toast({
  //       title: "Login Failed",
  //       description: error.message || "Invalid username or password",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await apiFetch<{
        success: boolean;
        data: { user: any; token?: string };
      }>(endpoints.auth.login, {
        method: "POST",
        bodyJson: { email: username, password },
      });

      const token = data?.data?.token;
      const user = data?.data?.user;

      if (!user) throw new Error("Malformed response from server");

      localStorage.setItem("auth_user", JSON.stringify(user));
      if (token) localStorage.setItem("auth_token", token);

      toast({ title: "Login successful" });

      // Update auth context so any route guards react immediately
      try {
        setAuthUser(user, token);
      } catch {}

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/farmer");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
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
            <h2 className="text-2xl font-bold">Farmer Platform</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="input-username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              data-testid="button-login"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <Button
              type="button"
              className="w-full"
              onClick={() => navigate("/create-account")}
              data-testid="button-create-account"
            >
              Create Account
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
