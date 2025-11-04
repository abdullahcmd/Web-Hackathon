import { RoleBadge } from "../RoleBadge";

export default function RoleBadgeExample() {
  return (
    <div className="flex gap-4 p-8">
      <RoleBadge role="admin" />
      <RoleBadge role="farmer" />
    </div>
  );
}
