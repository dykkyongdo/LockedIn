import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  variant?: "default" | "gradient" | "outline";
}

const TagChip = React.forwardRef<HTMLButtonElement, TagChipProps>(
  ({ label, selected = false, onClick, onRemove, disabled = false, variant = "default" }, ref) => {
    const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-purple focus:ring-offset-1";
    
    const variantClasses = {
      default: selected 
        ? "bg-gradient-primary text-white shadow-md" 
        : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border",
      gradient: selected 
        ? "bg-gradient-secondary text-white shadow-md" 
        : "bg-gradient-subtle text-foreground hover:bg-gradient-subtle/80 border border-border",
      outline: selected 
        ? "bg-gradient-primary text-white border-2 border-transparent shadow-md" 
        : "bg-transparent text-foreground border-2 border-border hover:border-electric-purple/50",
    };

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          baseClasses,
          variantClasses[variant],
          disabled && "opacity-50 cursor-not-allowed",
          "cursor-pointer hover:scale-105"
        )}
      >
        <span>{label}</span>
        {onRemove && (
          <X 
            className="h-3 w-3 cursor-pointer hover:opacity-70" 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          />
        )}
      </button>
    );
  }
);

TagChip.displayName = "TagChip";

export { TagChip };