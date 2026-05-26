import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent } from "@/components/ui/card";

export default function Affirmations() {
  const defaultAffirmations = [
    "I am worthy of peace and a beautiful life.",
    "My progress is gentle but powerful.",
    "I choose to bloom at my own pace.",
    "Rest is productive and necessary.",
    "I am creating a life that feels good on the inside."
  ];

  const [affirmations] = useLocalStorage<string[]>("petal-affirmations", defaultAffirmations);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % affirmations.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [affirmations.length]);

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-none shadow-sm hover-elevate relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
      <CardContent
        className="p-8 flex flex-col items-center justify-center text-center min-h-[160px] relative z-10 cursor-pointer"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % affirmations.length)}
        data-testid="affirmation-card"
      >
        <span className="text-xl mb-4 opacity-50">✨</span>
        <p className="text-lg font-medium text-foreground/80 leading-relaxed font-serif italic">
          "{affirmations[currentIndex]}"
        </p>
      </CardContent>
    </Card>
  );
}
