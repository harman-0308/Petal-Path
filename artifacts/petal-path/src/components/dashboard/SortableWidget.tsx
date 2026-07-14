import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, MoreHorizontal } from "lucide-react";
import { WidgetDef, WidgetSize } from "./widgets/registry";
import { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortableWidgetProps {
  widget: WidgetDef;
  size?: WidgetSize;
  onResize: (size: WidgetSize) => void;
}

const SIZE_CLASSES: Record<WidgetSize, string> = {
  small: "col-span-1 lg:col-span-2",
  medium: "col-span-1 md:col-span-2 lg:col-span-4",
  large: "col-span-1 md:col-span-2 lg:col-span-4", // Usually larger widgets will just grow taller natively
};

function SortableWidgetComponent({ widget, size, onResize }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  // Determine effective span (no row-span, let height adapt naturally)
  let currentSpan: string = widget.defaultSpan.replace(/row-span-\d+/g, "").trim();
  if (size && SIZE_CLASSES[size]) {
    currentSpan = SIZE_CLASSES[size];
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative w-full ${currentSpan}`}
    >
      {/* Top Right: Drag Handle */}
      <div 
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-10 p-2 rounded-md bg-background/50 backdrop-blur-sm border border-border/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:bg-background shadow-sm hover:text-foreground"
      >
        <GripHorizontal className="w-4 h-4" />
      </div>

      {/* Bottom Right: Resize Controls */}
      <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:bg-background shadow-sm hover:text-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onResize("small")}>
              <span className={`w-2 h-2 rounded-full mr-2 ${size === "small" ? "bg-primary" : "bg-transparent border border-muted-foreground"}`} />
              Small
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResize("medium")}>
              <span className={`w-2 h-2 rounded-full mr-2 ${size === "medium" || !size ? "bg-primary" : "bg-transparent border border-muted-foreground"}`} />
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResize("large")}>
              <span className={`w-2 h-2 rounded-full mr-2 ${size === "large" ? "bg-primary" : "bg-transparent border border-muted-foreground"}`} />
              Large
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Widget Container - Adaptive Box */}
      <div className={`bg-card rounded-2xl shadow-sm border border-border/50 p-4 hover:shadow-md ${isDragging ? 'shadow-2xl scale-[1.02] border-primary/50' : ''} transition-all duration-200`}>
        {/* Render the widget component, passing down the size */}
        {widget.component(size || "medium")}
      </div>
    </div>
  );
}

export const SortableWidget = memo(SortableWidgetComponent);
