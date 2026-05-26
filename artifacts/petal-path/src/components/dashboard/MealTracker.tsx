import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type MealItem = { id: string, text: string };
type Meals = { Breakfast: MealItem[], Lunch: MealItem[], Dinner: MealItem[], Snacks: MealItem[] };
const defaultMeals: Meals = { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] };

export default function MealTracker() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [logs, setLogs] = useLocalStorage<Record<string, Meals>>("petal-meals", {});
  const todayMeals = logs[today] || defaultMeals;

  const [inputs, setInputs] = useState({ Breakfast: "", Lunch: "", Dinner: "", Snacks: "" });

  const addItem = (category: keyof Meals, e?: FormEvent) => {
    if (e) e.preventDefault();
    const text = inputs[category].trim();
    if (!text) return;

    const newItem = { id: Date.now().toString(), text };
    const updatedMeals = {
      ...todayMeals,
      [category]: [...(todayMeals[category] || []), newItem]
    };

    setLogs({ ...logs, [today]: updatedMeals });
    setInputs(prev => ({ ...prev, [category]: "" }));
  };

  const deleteItem = (category: keyof Meals, id: string) => {
    const updatedMeals = {
      ...todayMeals,
      [category]: todayMeals[category].filter(i => i.id !== id)
    };
    setLogs({ ...logs, [today]: updatedMeals });
  };

  const categories: (keyof Meals)[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  return (
    <Card className="bg-card hover-elevate">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary font-bold">Nourishment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map(cat => (
          <div key={cat} className="space-y-1">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{cat}</h4>
            
            <div className="space-y-1 pl-1 border-l-2 border-primary/20">
              <AnimatePresence>
                {(todayMeals[cat] || []).map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between text-sm group pl-2"
                  >
                    <span className="text-foreground">{item.text}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteItem(cat, item.id)}
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <form onSubmit={(e) => addItem(cat, e)} className="flex gap-1 pl-2 pt-1">
                <Input 
                  placeholder="Add item..." 
                  value={inputs[cat]}
                  onChange={e => setInputs(prev => ({ ...prev, [cat]: e.target.value }))}
                  className="h-6 text-xs border-0 bg-transparent shadow-none px-1 focus-visible:ring-1 focus-visible:ring-primary/30"
                />
                <Button type="submit" variant="ghost" size="icon" className="h-6 w-6 text-primary shrink-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </form>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}