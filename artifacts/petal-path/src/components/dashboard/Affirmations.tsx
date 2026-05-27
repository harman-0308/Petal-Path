import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, X, Plus, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const DEFAULT_AFFIRMATIONS = [
  "I am worthy of peace and a beautiful life.",
  "My progress is gentle but powerful.",
  "I choose to bloom at my own pace.",
  "Rest is productive and necessary.",
  "I am creating a life that feels good on the inside."
];

export default function Affirmations() {
  const [affirmations, setAffirmations] = useLocalStorage<string[]>("petal-affirmations", DEFAULT_AFFIRMATIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    if (isEditing) return;
    if (affirmations.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % affirmations.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [affirmations.length, isEditing]);

  const addAffirmation = () => {
    const text = newText.trim();
    if (!text) return;
    setAffirmations([...affirmations, text]);
    setNewText("");
  };

  const deleteAffirmation = (index: number) => {
    const next = affirmations.filter((_, i) => i !== index);
    setAffirmations(next);
    if (currentIndex >= next.length) setCurrentIndex(Math.max(0, next.length - 1));
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-none shadow-sm hover-elevate relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />

      <div className="absolute top-2 right-2 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
          className="h-6 w-6 text-muted-foreground hover:text-primary opacity-60 hover:opacity-100"
        >
          {isEditing ? <Check className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
        </Button>
      </div>

      <CardContent className="p-6 relative z-10">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">My Affirmations</p>
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                {affirmations.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 group">
                    <span className="text-xs text-foreground/80 flex-1 leading-relaxed italic">"{a}"</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAffirmation(i)}
                      className="h-5 w-5 flex-shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {affirmations.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">No affirmations yet ✨</p>
                )}
              </div>
              <div className="flex gap-2 pt-2 border-t border-border/30">
                <Input
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addAffirmation()}
                  placeholder="Add a new affirmation..."
                  className="h-7 text-xs"
                />
                <Button size="sm" onClick={addAffirmation} className="h-7 px-2 bg-primary hover:bg-primary/90">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`affirmation-${currentIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              onClick={() => affirmations.length > 0 && setCurrentIndex((prev) => (prev + 1) % affirmations.length)}
              className="flex flex-col items-center justify-center text-center min-h-[120px] cursor-pointer select-none"
              data-testid="affirmation-card"
            >
              <span className="text-xl mb-4 opacity-50">✨</span>
              {affirmations.length > 0 ? (
                <p className="text-lg font-medium text-foreground/80 leading-relaxed font-serif italic">
                  "{affirmations[currentIndex] ?? affirmations[0]}"
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Tap the pencil to add affirmations ✨</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
