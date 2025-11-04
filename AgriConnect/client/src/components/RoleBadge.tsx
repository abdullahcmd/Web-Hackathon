import { Badge } from "@/components/ui/badge";
import { Shield, Sprout } from "lucide-react";

interface RoleBadgeProps {
  role: "admin" | "farmer";
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <Badge variant="outline" className="gap-1" data-testid={`badge-role-${role}`}>
      {role === "admin" ? (
        <Shield className="h-3 w-3" />
      ) : (
        <Sprout className="h-3 w-3" />
      )}
      <span className="capitalize">{role}</span>
    </Badge>
  );
}
