import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RoleBadge } from "./RoleBadge";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/lib/auth";
import { LogOut, Sprout } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Support both legacy (fullName/username) and backend (name/email)
  const userName = (user as any).fullName || (user as any).username || user.name || user.email || "User";
  const baseForInitials = userName.includes(" ") ? userName : (user.email || userName);
  const initials = baseForInitials
    .split(" ")
    .map((n) => (n && n[0]) || "")
    .join("")
    .replace(/@.*/, "") // if email, take part before @
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 border-b bg-background" data-testid="header-main">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Farmer Platform</h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium">{userName}</span>
              <RoleBadge role={user.role} />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
