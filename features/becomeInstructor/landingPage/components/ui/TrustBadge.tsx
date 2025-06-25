import { Badge } from "@/components/ui/badge";
import type { TrustBadgeProps } from "../../types/landing.types";
import { cn } from "@/lib/utils";

export function TrustBadge({
  icon: Icon,
  text,
  variant = "blue",
}: TrustBadgeProps) {
  const variantClasses = {
    green: "bg-green-600 hover:bg-green-600",
    blue: "bg-blue-600 hover:bg-blue-600",
    purple: "bg-purple-600 hover:bg-purple-600",
  };

  return (
    <Badge className={cn(variantClasses[variant])}>
      <Icon className="w-4 h-4 mr-1" />
      {text}
    </Badge>
  );
}
