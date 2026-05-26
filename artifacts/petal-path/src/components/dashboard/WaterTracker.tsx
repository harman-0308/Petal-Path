import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WaterTracker() {
  const goal = 8;
  const today = format(new Date(), "yyyy-MM-dd");
  const [waterLogs, setWaterLogs] = useLocalStorage<Record<string, number>>("petal-water", {});
  
  const currentAmount = waterLogs[today] || 0;

  const toggleWater = (index: number) => {
    // If clicking on the exact current amount (the last filled drop), unfill it
    // Otherwise, fill up to the clicked index
    const newAmount = (currentAmount === index + 1) ? index : index + 1;
    setWaterLogs(prev => ({ ...prev, [today]: newAmount }));
  };

  return (
    <Card className="bg-card hover-elevate">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-primary font-bold">Hydration</CardTitle>
        <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {currentAmount} / {goal}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-between gap-1 py-2">
          {Array.from({ length: goal }).map((_, i) => {
            const isFilled = i < currentAmount;
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleWater(i)}
                className="text-2xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full"
                data-testid={`water-drop-${i}`}
              >
                <motion.div
                  initial={false}
                  animate={{ 
                    opacity: isFilled ? 1 : 0.3,
                    filter: isFilled ? "grayscale(0%)" : "grayscale(100%)",
                    y: isFilled ? [0, -5, 0] : 0
                  }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  💧
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}