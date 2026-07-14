import { motion } from "framer-motion";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { WidgetSize, DEFAULT_WIDGET_SIZE } from "./widgets/registry";

interface WaterTrackerProps {
  size?: WidgetSize;
}

export default function WaterTracker({ size = DEFAULT_WIDGET_SIZE }: WaterTrackerProps) {
  const goal = 8;
  const today = format(new Date(), "yyyy-MM-dd");
  const [waterLogs, setWaterLogs] = useLocalStorage<Record<string, number>>("petal-water", {});
  
  const currentAmount = waterLogs[today] || 0;

  const toggleWater = (index: number) => {
    const newAmount = (currentAmount === index + 1) ? index : index + 1;
    setWaterLogs(prev => ({ ...prev, [today]: newAmount }));
  };

  const addWater = () => {
    setWaterLogs(prev => ({ ...prev, [today]: Math.min(goal, currentAmount + 1) }));
  };

  const removeWater = () => {
    setWaterLogs(prev => ({ ...prev, [today]: Math.max(0, currentAmount - 1) }));
  };

  if (size === "small") {
    // Compact View: Just a counter with +/- buttons
    return (
      <div className="flex flex-col h-full justify-between space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary">Hydration</h3>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2">
          <span className="text-3xl font-bold text-blue-500">{currentAmount}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">/ {goal} Glasses</span>
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={removeWater} disabled={currentAmount === 0}>
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full text-blue-500 border-blue-200 hover:bg-blue-50" onClick={addWater} disabled={currentAmount >= goal}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Medium / Large View: Interactive droplets
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary">Hydration</h3>
        <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {currentAmount} / {goal}
        </span>
      </div>
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
    </div>
  );
}