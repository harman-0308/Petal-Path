import { useState, useEffect } from "react";
import { Settings, Sun, Moon } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const COLORS = [
  { id: "rose", hex: "#eb3b76", value: "342 75% 58%" },
  { id: "lavender", hex: "#a25df2", value: "262 70% 64%" },
  { id: "mint", hex: "#1fb87a", value: "160 62% 43%" },
  { id: "peach", hex: "#f2642e", value: "20 85% 56%" },
  { id: "sky", hex: "#14aaf2", value: "198 85% 48%" },
  { id: "gold", hex: "#d99507", value: "42 85% 44%" },
];

const FONTS = [
  { id: "inter", label: "Inter", value: "'Inter', sans-serif" },
  { id: "nunito", label: "Nunito", value: "'Nunito', sans-serif" },
  { id: "outfit", label: "Outfit", value: "'Outfit', sans-serif" },
  { id: "quicksand", label: "Quicksand", value: "'Quicksand', sans-serif" },
  { id: "comfortaa", label: "Comfortaa", value: "'Comfortaa', sans-serif" },
];

export default function ThemePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [accent, setAccent] = useLocalStorage("petal-theme-accent", "rose");
  const [font, setFont] = useLocalStorage("petal-theme-font", "nunito");
  const [theme, setTheme] = useLocalStorage("petal-theme-mode", "light");

  useEffect(() => {
    const root = document.documentElement;
    
    // Set theme (Light/Dark)
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Set accent color
    const colorObj = COLORS.find(c => c.id === accent);
    if (colorObj) {
      root.style.setProperty("--primary", colorObj.value);
      root.style.setProperty("--ring", colorObj.value);
    }
    
    // Set font family
    const fontObj = FONTS.find(f => f.id === font);
    if (fontObj) {
      root.style.setProperty("--app-font-sans", fontObj.value);
      document.body.style.fontFamily = fontObj.value;
    }
  }, [accent, font, theme]);

  return (
    <div className="relative inline-block">
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full shadow-sm bg-card hover:bg-muted press-scale"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings className="h-5 w-5 text-muted-foreground" />
      </Button>

      {isOpen && (
        <Card className="absolute bottom-14 right-0 w-64 p-4 rounded-2xl shadow-lg flex flex-col gap-4 bg-card border border-border/50 z-50 animate-fade-in animate-duration-200">
          
          {/* Accent Color Selection */}
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Accent Color</h4>
            <div className="flex gap-2.5 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setAccent(c.id)}
                  className={`w-6 h-6 rounded-full transition-all press-scale ${
                    accent === c.id 
                      ? 'scale-110 ring-2 ring-offset-2 ring-primary border border-transparent' 
                      : 'hover:scale-105 border border-border/20 shadow-2xs'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-border/40" />

          {/* Light / Dark Mode Theme Selector */}
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Theme Mode</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "light", label: "Light", icon: Sun },
                { id: "dark", label: "Dark", icon: Moon }
              ].map(t => {
                const Icon = t.icon;
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all press-scale ${
                      isActive
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-xs"
                        : "bg-muted/40 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-[11px] font-bold">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-border/40" />

          {/* Font Selector with Inline Preview */}
          <div>
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Typography</h4>
            <div className="flex flex-col gap-1.5 max-h-[170px] overflow-y-auto pr-1 pretty-scroll">
              {FONTS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFont(f.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all text-left press-scale ${
                    font === f.id
                      ? "bg-primary/10 border-primary text-primary font-bold"
                      : "bg-muted/30 border-transparent text-foreground hover:bg-muted hover:border-border/40"
                  }`}
                  style={{ fontFamily: f.value }}
                >
                  <span className="text-xs font-bold">{f.label}</span>
                  <span className="text-xs opacity-75 font-medium tracking-wide">Aa Bb</span>
                </button>
              ))}
            </div>
          </div>

        </Card>
      )}
    </div>
  );
}
