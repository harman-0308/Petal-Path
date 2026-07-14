import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { WidgetSize, DEFAULT_WIDGET_SIZE } from "./widgets/registry";

interface DailyPlannerProps {
  size?: WidgetSize;
}

export default function DailyPlanner({ size = DEFAULT_WIDGET_SIZE }: DailyPlannerProps) {
  const [entries, setEntries] = useLocalStorage<Record<string, {text: string, done: boolean}>>("petal-planner", {});
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Decide how many hours to show based on size
  let hours = Array.from({length: 18}, (_, i) => i + 6); // 6am to 11pm
  
  if (size === "small") {
    // Show only the upcoming 4 hours based on current time
    const currentHour = new Date().getHours();
    const startHour = Math.max(6, Math.min(20, currentHour));
    hours = Array.from({length: 4}, (_, i) => i + startHour);
  } else if (size === "medium") {
    // Show 8 hours
    const currentHour = new Date().getHours();
    const startHour = Math.max(6, Math.min(16, currentHour - 1));
    hours = Array.from({length: 8}, (_, i) => i + startHour);
  }

  const updateEntry = (hour: number, field: "text" | "done", value: any) => {
    const key = `${today}-${hour}`;
    setEntries(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        text: prev[key]?.text || "",
        done: prev[key]?.done || false,
        [field]: value
      }
    }));
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-primary font-bold">Daily Planner</h3>
        {size !== "large" && <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Upcoming</span>}
      </div>
      <div className="space-y-2">
        {hours.map((hour) => {
          const key = `${today}-${hour}`;
          const entry = entries[key] || { text: "", done: false };
          const displayHour = hour > 12 ? `${hour-12}pm` : hour === 12 ? '12pm' : `${hour}am`;
          return (
            <motion.div 
              key={hour}
              className="flex items-center gap-3 p-1 rounded-lg hover:bg-muted/30 transition-colors"
              layout
            >
              <div className="w-12 text-xs font-semibold text-muted-foreground text-right">{displayHour}</div>
              <Checkbox 
                checked={entry.done} 
                onCheckedChange={(c) => updateEntry(hour, "done", c === true)}
                className="rounded-full border-primary data-[state=checked]:bg-primary"
                data-testid={`planner-check-${hour}`}
              />
              <Input
                value={entry.text}
                onChange={(e) => updateEntry(hour, "text", e.target.value)}
                placeholder={size === "small" ? "..." : "What's happening?"}
                className={`border-0 bg-transparent shadow-none h-8 px-2 text-sm focus-visible:ring-1 focus-visible:ring-primary/20 ${entry.done ? 'line-through text-muted-foreground' : ''}`}
                data-testid={`planner-input-${hour}`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}