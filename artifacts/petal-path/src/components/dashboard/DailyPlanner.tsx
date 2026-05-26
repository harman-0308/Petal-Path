import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function DailyPlanner() {
  const [entries, setEntries] = useLocalStorage<Record<string, {text: string, done: boolean}>>("petal-planner", {});
  const today = format(new Date(), "yyyy-MM-dd");
  
  const hours = Array.from({length: 18}, (_, i) => i + 6); // 6am to 11pm

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
    <Card className="h-full bg-card hover-elevate">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary font-bold">Daily Planner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {hours.map((hour) => {
          const key = `${today}-${hour}`;
          const entry = entries[key] || { text: "", done: false };
          const displayHour = hour > 12 ? `${hour-12}pm` : hour === 12 ? '12pm' : `${hour}am`;
          return (
            <motion.div 
              key={hour}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
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
                placeholder="What's happening?"
                className={`border-0 bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 ${entry.done ? 'line-through text-muted-foreground' : ''}`}
                data-testid={`planner-input-${hour}`}
              />
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}