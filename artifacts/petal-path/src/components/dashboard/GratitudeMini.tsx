import { useState } from "react";
import { format, subDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Flame } from "lucide-react";

type GratitudeItem = { id: string; text: string };

function calcStreak(entries: Record<string, GratitudeItem[]>): number {
  let streak = 0;
  let d = new Date();
  for (let i = 0; i < 60; i++) {
    const key = format(d, "yyyy-MM-dd");
    if (entries[key] && entries[key].length > 0) {
      streak++;
      d = subDays(d, 1);
    } else if (i === 0) {
      d = subDays(d, 1);
    } else {
      break;
    }
  }
  return streak;
}

const PROMPTS = [
  "Something that made you smile today…",
  "A person you're grateful for…",
  "A small joy you noticed…",
  "Something you're looking forward to…",
  "A moment of peace today…",
];

export default function GratitudeMini() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [entries, setEntries] = useLocalStorage<Record<string, GratitudeItem[]>>("petal-gratitude", {});
  const [text, setText] = useState("");

  const todayList = entries[today] || [];
  const streak = calcStreak(entries);
  const prompt = PROMPTS[todayList.length % PROMPTS.length];

  const add = () => {
    const t = text.trim();
    if (!t) return;
    const next = [...todayList, { id: Date.now().toString(), text: t }];
    setEntries({ ...entries, [today]: next });
    setText("");
  };

  const remove = (id: string) => {
    setEntries({ ...entries, [today]: todayList.filter(g => g.id !== id) });
  };

  return (
    <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20 hover-elevate">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base text-primary font-bold flex items-center gap-1.5">
          🌸 Gratitude
        </CardTitle>
        {streak > 0 && (
          <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
            <Flame className="h-3 w-3" /> {streak}d
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {todayList.map(g => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              className="flex items-start gap-2 group"
            >
              <span className="text-primary/60 mt-0.5 text-xs">✦</span>
              <span className="text-sm text-foreground/80 flex-1 leading-snug">{g.text}</span>
              <button
                onClick={() => remove(g.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive mt-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {todayList.length === 0 && (
          <p className="text-xs text-muted-foreground italic text-center py-1">
            What are you grateful for today? ✨
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            placeholder={prompt}
            className="h-8 text-xs border-primary/20 focus-visible:ring-primary/30 bg-white/50 dark:bg-card/50"
          />
          <Button
            onClick={add}
            size="icon"
            className="h-8 w-8 rounded-xl bg-primary hover:bg-primary/90 text-white shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
