import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/:tab" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [accent] = useLocalStorage("petal-theme-accent", "rose");
  const [font] = useLocalStorage("petal-theme-font", "nunito");
  const [theme] = useLocalStorage("petal-theme-mode", "light");

  useEffect(() => {
    const root = document.documentElement;
    
    // Set theme (Light/Dark)
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    const COLORS = [
      { id: "rose", hex: "#eb3b76", value: "342 75% 58%" },
      { id: "lavender", hex: "#a25df2", value: "262 70% 64%" },
      { id: "mint", hex: "#1fb87a", value: "160 62% 43%" },
      { id: "peach", hex: "#f2642e", value: "20 85% 56%" },
      { id: "sky", hex: "#14aaf2", value: "198 85% 48%" },
      { id: "gold", hex: "#d99507", value: "42 85% 44%" },
    ];
    const colorObj = COLORS.find(c => c.id === accent);
    if (colorObj) {
      root.style.setProperty("--primary", colorObj.value);
      root.style.setProperty("--ring", colorObj.value);
    }
    
    const FONTS = [
      { id: "inter", label: "Inter", value: "'Inter', 'Noto Color Emoji', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif" },
      { id: "nunito", label: "Nunito", value: "'Nunito', 'Noto Color Emoji', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif" },
      { id: "outfit", label: "Outfit", value: "'Outfit', 'Noto Color Emoji', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif" },
      { id: "quicksand", label: "Quicksand", value: "'Quicksand', 'Noto Color Emoji', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif" },
      { id: "comfortaa", label: "Comfortaa", value: "'Comfortaa', 'Noto Color Emoji', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif" },
    ];
    const fontObj = FONTS.find(f => f.id === font);
    if (fontObj) {
      root.style.setProperty("--app-font-sans", fontObj.value);
      document.body.style.fontFamily = fontObj.value;
    }
  }, [accent, font, theme]);

  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
