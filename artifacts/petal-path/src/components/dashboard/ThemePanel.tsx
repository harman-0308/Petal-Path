import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const COLORS = [
  { id: "rose", hex: "#f472b6", value: "345 65% 72%" },
  { id: "lavender", hex: "#c084fc", value: "265 55% 78%" },
  { id: "mint", hex: "#4ade80", value: "155 45% 70%" },
  { id: "peach", hex: "#fb923c", value: "20 80% 75%" },
  { id: "sky", hex: "#38bdf8", value: "200 70% 72%" },
  { id: "butter", hex: "#fde047", value: "45 93% 75%" },
];

const FONTS = [
  { id: "nunito", label: "Nunito", value: "'Nunito', sans-serif" },
  { id: "quicksand", label: "Quicksand", value: "'Quicksand', sans-serif" },
  { id: "outfit", label: "Outfit", value: "'Outfit', sans-serif" },
];

const BACKGROUNDS = [
  { id: "warm-white", label: "Warm White", value: "40 30% 98%" },
  { id: "soft-cream", label: "Soft Cream", value: "35 40% 96%" },
];

export default function ThemePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [accent, setAccent] = useLocalStorage("petal-theme-accent", "rose");
  const [font, setFont] = useLocalStorage("petal-theme-font", "nunito");
  const [bg, setBg] = useLocalStorage("petal-theme-bg", "warm-white");

  useEffect(() => {
    const root = document.documentElement;
    const colorObj = COLORS.find(c => c.id === accent);
    if (colorObj) {
      root.style.setProperty("--primary", colorObj.value);
      root.style.setProperty("--ring", colorObj.value);
    }
    
    const fontObj = FONTS.find(f => f.id === font);
    if (fontObj) {
      root.style.setProperty("--app-font-sans", fontObj.value);
      document.body.style.fontFamily = fontObj.value;
    }

    const bgObj = BACKGROUNDS.find(b => b.id === bg);
    if (bgObj) {
      root.style.setProperty("--background", bgObj.value);
    }
  }, [accent, font, bg]);

  return (
    <div className="relative inline-block">
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full shadow-sm bg-card hover:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings className="h-5 w-5 text-muted-foreground" />
      </Button>

      {isOpen && (
        <Card className="absolute top-12 left-0 w-56 p-4 rounded-2xl shadow-lg flex flex-col gap-4 bg-card z-50">
          <div>
            <h4 className="text-xs font-bold text-muted-foreground mb-2">Accent Color</h4>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setAccent(c.id)}
                  className={`w-6 h-6 rounded-full transition-transform ${accent === c.id ? 'scale-125 ring-2 ring-offset-2 ring-primary' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-muted-foreground mb-2">Font</h4>
            <div className="flex gap-2 flex-wrap">
              {FONTS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFont(f.id)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${font === f.id ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-muted-foreground mb-2">Background</h4>
            <div className="flex gap-2 flex-col">
              {BACKGROUNDS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setBg(b.id)}
                  className={`text-xs px-3 py-2 rounded-lg text-left transition-colors ${bg === b.id ? 'bg-primary/10 text-primary font-bold border border-primary/20' : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent'}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
