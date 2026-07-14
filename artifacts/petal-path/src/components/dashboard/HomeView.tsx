import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { LayoutGrid, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";

import { WIDGET_REGISTRY, DEFAULT_WIDGET_LAYOUT, WidgetSize } from "./widgets/registry";
import { SortableWidget } from "./SortableWidget";
import WidgetPicker from "./WidgetPicker";

export default function HomeView() {
  const [activeWidgetIds, setActiveWidgetIds] = useLocalStorage<string[]>("petal-home-layout", DEFAULT_WIDGET_LAYOUT);
  const [widgetSizes, setWidgetSizes] = useLocalStorage<Record<string, WidgetSize>>("petal-widget-sizes", {});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setActiveWidgetIds((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddWidget = (id: string) => {
    if (!activeWidgetIds.includes(id)) {
      setActiveWidgetIds([...activeWidgetIds, id]);
    }
  };

  const handleRemoveWidget = (id: string) => {
    setActiveWidgetIds(activeWidgetIds.filter((w) => w !== id));
  };

  const handleResizeWidget = (id: string, size: WidgetSize) => {
    setWidgetSizes((prev) => ({ ...prev, [id]: size }));
  };

  // Ensure we only try to render widgets that actually exist in the registry
  const validActiveWidgets = useMemo(() => {
    return activeWidgetIds
      .map(id => WIDGET_REGISTRY[id])
      .filter(Boolean);
  }, [activeWidgetIds]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-foreground/80">
          <LayoutGrid className="w-5 h-5 text-primary" />
          Dashboard
        </h2>
        
        <WidgetPicker 
          activeWidgetIds={activeWidgetIds}
          onAddWidget={handleAddWidget}
          onRemoveWidget={handleRemoveWidget}
        >
          <Button variant="outline" size="sm" className="gap-2 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary">
            <Plus className="w-4 h-4" /> Add Widget
          </Button>
        </WidgetPicker>
      </div>

      {validActiveWidgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-2xl bg-card/50">
          <LayoutGrid className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-bold">Your dashboard is empty</h3>
          <p className="text-muted-foreground max-w-sm mb-6 mt-2">
            Click the "Add Widget" button above to customize your dashboard with the tools you need.
          </p>
          <WidgetPicker 
            activeWidgetIds={activeWidgetIds}
            onAddWidget={handleAddWidget}
            onRemoveWidget={handleRemoveWidget}
          >
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Widgets
            </Button>
          </WidgetPicker>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={activeWidgetIds}
            strategy={rectSortingStrategy}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6 auto-rows-auto items-start"
            >
              {validActiveWidgets.map((widget) => (
                <SortableWidget 
                  key={widget.id} 
                  widget={widget} 
                  size={widgetSizes[widget.id]} 
                  onResize={(size) => handleResizeWidget(widget.id, size)} 
                />
              ))}
            </motion.div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
