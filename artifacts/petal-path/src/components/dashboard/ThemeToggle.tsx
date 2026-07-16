import { Sun, Moon } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage("petal-theme-mode", "light");

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="rounded-full h-9 w-9 shadow-sm bg-card border border-border/40 hover:bg-muted press-scale flex items-center justify-center"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle theme mode"
    >
      {theme === "dark" ? (
        <Sun className="h-4.5 w-4.5 text-amber-500" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-muted-foreground" />
      )}
    </Button>
  );
}
