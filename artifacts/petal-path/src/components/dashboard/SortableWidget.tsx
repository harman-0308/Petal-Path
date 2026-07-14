import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, MoreHorizontal } from "lucide-react";
import { WidgetDef } from "./widgets/registry";
import { memo } from "react";
import { WidgetSize } from "./HomeView";
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
  small: "col-span-1 lg:col-span-2 row-span-1",
  medium: "col-span-1 md:col-span-2 lg:col-span-4 row-span-2",
  large: "col-span-1 md:col-span-2 lg:col-span-4 row-span-3",
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

  // Determine effective size (default to medium if not set, or parse from defaultSpan)
  let currentSpan: string = widget.defaultSpan;
  if (size && SIZE_CLASSES[size]) {
    currentSpan = SIZE_CLASSES[size];
  } else if (!size) {
    // If no explicit size, try to infer or use default
    if (currentSpan.includes("row-span")) {
      // already has row span
    } else {
      // provide a default row span based on defaultSpan
      if (currentSpan.includes("col-span-4") || currentSpan.includes("col-span-8")) {
        currentSpan += " row-span-2";
      } else {
        currentSpan += " row-span-1";
      }
    }
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
              <span className={`w-2 h-2 rounded-full mr-2 ${size === "medium" || (!size && currentSpan.includes("col-span-4")) ? "bg-primary" : "bg-transparent border border-muted-foreground"}`} />
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResize("large")}>
              <span className={`w-2 h-2 rounded-full mr-2 ${size === "large" ? "bg-primary" : "bg-transparent border border-muted-foreground"}`} />
              Large
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Widget Container - Bounded Box */}
      <div className={`h-full flex flex-col overflow-hidden bg-card ${isDragging ? 'shadow-2xl scale-[1.02] border-primary/50' : ''} transition-all duration-200 rounded-xl`}>
        {/* Inner Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
          {/* We wrap the component in a div that passes height down if needed, but since most widgets are Cards, we can just render it. The Card might have its own padding. */}
          {widget.component}
        </div>
      </div>
    </div>
  );
}

export const SortableWidget = memo(SortableWidgetComponent);
