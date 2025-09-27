import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DistanceBadgeProps {
  distance: number;
  className?: string;
}

export function DistanceBadge({ distance, className }: DistanceBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-foreground border border-border/50",
      className
    )}>
      <MapPin className="h-3 w-3 text-electric-purple" />
      <span>{distance.toFixed(1)} km away</span>
    </div>
  );
}