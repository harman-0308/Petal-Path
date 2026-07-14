import { useState, useRef, memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { WidgetDef, WidgetSize } from "./widgets/registry";
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

  const [isOpen, setIsOpen] = useState(false);
  const pointerDownTime = useRef(0);

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

  const supportedSizes = widget.supportedSizes || ["small", "medium", "large"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative w-full ${currentSpan}`}
    >
      {/* Master Button (Bottom Right) - Drag & Resize */}
      <div 
        className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <DropdownMenu 
          open={isOpen} 
          onOpenChange={(open) => {
            if (!open) setIsOpen(false);
          }}
        >
          <DropdownMenuTrigger asChild>
            <button 
              {...attributes}
              {...listeners}
              onPointerDown={(e) => {
                pointerDownTime.current = Date.now();
                listeners?.onPointerDown?.(e);
              }}
              onClick={(e) => {
                if (Date.now() - pointerDownTime.current < 250) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsOpen(true);
                }
                listeners?.onKeyDown?.(e);
              }}
              className="p-1.5 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:bg-background shadow-sm hover:text-foreground cursor-grab active:cursor-grabbing"
              title="Click for sizes, Hold & Drag to move"
            >
              {/* Combine idea of drag + more */}
              <GripHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          {supportedSizes.length > 1 && (
            <DropdownMenuContent align="end" className="w-32">
              {supportedSizes.includes("small") && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onResize("small"); }}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${size === "small" ? "bg-primary" : "bg-transparent border border-muted-foreground"}`} />
                  Small
                </DropdownMenuItem>
              )}
              {supportedSizes.includes("medium") && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onResize("medium"); }}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${size === "medium" || (!size && supportedSizes.includes("medium")) ? "bg-primary" : "bg-transparent border border-muted-foreground"}`} />
                  Medium
                </DropdownMenuItem>
              )}
              {supportedSizes.includes("large") && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onResize("large"); }}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${size === "large" ? "bg-primary" : "bg-transparent border border-muted-foreground"}`} />
                  Large
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
      
      {/* Widget Container - Adaptive Box */}
      <div className={`bg-card rounded-3xl shadow-sm border border-border/50 p-5 hover:shadow-md ${isDragging ? 'shadow-2xl scale-[1.02] border-primary/50' : ''} transition-all duration-200`}>
        {/* Render the widget component, passing down the size */}
        {widget.component(size || (supportedSizes.includes("medium") ? "medium" : supportedSizes[0]))}
      </div>
    </div>
  );
}

export const SortableWidget = memo(SortableWidgetComponent);
