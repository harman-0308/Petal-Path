import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useLocation } from "wouter";
import HomeView from "../components/dashboard/HomeView";
import WellnessView from "../components/dashboard/WellnessView";
import FocusView from "../components/dashboard/FocusView";
import GoalsView from "../components/dashboard/GoalsView";
import WeatherWidget from "../components/dashboard/WeatherWidget";
import ThemeToggle from "../components/dashboard/ThemeToggle";
import LofiPlayer from "../components/dashboard/LofiPlayer";
import GamificationBar from "../components/dashboard/GamificationBar";
import FinanceView from "../components/dashboard/FinanceView";
import ProfileView from "../components/dashboard/ProfileView";
import OnboardingView from "../components/dashboard/OnboardingView";
import SettingsView from "../components/dashboard/SettingsView";
import Login, { type UserProfile } from "../components/dashboard/Login";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSettings } from "@/hooks/use-settings";
import {
  Sun,
  CalendarRange,
  CalendarDays,
  Heart,
  BrainCircuit,
  PenLine,
  Wallet,
  LogOut,
  User,
  Settings,
} from "lucide-react";

const TABS = [
  { id: "home", label: "Home", icon: Sun },
  { id: "goals", label: "Goals", icon: PenLine },
  { id: "wellness", label: "Wellness", icon: Heart },
  { id: "focus", label: "Focus", icon: BrainCircuit },
  { id: "finance", label: "Finance", icon: Wallet },
];

export default function Dashboard() {
  const { settings } = useSettings();
  const [location, setLocation] = useLocation();
  const activeTab = location === "/" ? "home" : location.replace("/", "");
  const setActiveTab = (tab: string) => {
    setLocation(tab === "home" ? "/" : `/${tab}`);
  };

  const [time, setTime] = useState(new Date());
  const [user, setUser] = useLocalStorage<UserProfile | null>("petal-user", null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Profile & Onboarding State
  const [profile] = useLocalStorage<any>("petal-user-profile", { isComplete: false });
  const [hasSkippedOnboarding, setHasSkippedOnboarding] = useLocalStorage("petal-onboarding-skipped", false);
  const [hasShownReminder, setHasShownReminder] = useLocalStorage("petal-onboarding-reminder-shown", false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Gentle Reminder Logic (2 minutes after skipping)
  useEffect(() => {
    if (!user || !hasSkippedOnboarding || profile.isComplete || hasShownReminder) {
      return;
    }
    
    const reminderTimer = setTimeout(() => {
      toast("Complete your profile ✿", {
        description: "Want better personalized AI insights and widget recommendations? Take a moment to finish your profile setup.",
        action: {
          label: "Complete Now",
          onClick: () => {
            setActiveTab("profile");
            setHasShownReminder(true);
          },
        },
        duration: 10000, // Show for 10 seconds
      });
      setHasShownReminder(true);
    }, 120000); // 2 minutes (120,000 ms)

    return () => clearTimeout(reminderTimer);
  }, [user, hasSkippedOnboarding, profile.isComplete, hasShownReminder, setHasShownReminder]);

  const handleLoginSuccess = useCallback((profile: UserProfile) => {
    setUser(profile);
  }, [setUser]);

  const handleSignOut = useCallback(() => {
    setUser(null);
    // Also revoke Google session if available
    try {
      // @ts-ignore
      if (window.google?.accounts?.id) {
        // @ts-ignore
        window.google.accounts.id.disableAutoSelect();
      }
    } catch {/* ignore */}
  }, [setUser]);

  const getGreeting = () => {
    const hour = time.getHours();
    const firstName = user?.name?.split(" ")[0] ?? "";
    const suffix = firstName ? `, ${firstName}` : "";
    if (hour < 12) return `Good morning${suffix}`;
    if (hour < 18) return `Good afternoon${suffix}`;
    return `Good evening${suffix}`;
  };

  // Show login screen if not authenticated
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (!profile.isComplete && !hasSkippedOnboarding) {
    return (
      <OnboardingView 
        onComplete={() => setActiveTab("home")} 
        onSkip={() => setHasSkippedOnboarding(true)} 
      />
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className={`min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden pb-32 ${settings.privacyBlur ? 'blur-active' : ''}`}>
      {/* Settings Modal */}
      <SettingsView open={isSettingsOpen} onOpenChange={setIsSettingsOpen} onNavigateToProfile={() => setActiveTab("profile")} />

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8">
        
        {/* Compact Content Header */}
        <header className="pb-4 border-b border-border/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-bold text-muted-foreground tracking-wider uppercase">
              <span className="text-primary text-sm leading-none">✿</span>
              <span>Petal Path</span>
              <span className="opacity-40">•</span>
              <span>{format(time, "EEEE, MMMM do")}</span>
              <span className="opacity-40">•</span>
              <span>{format(time, settings.timeFormat === "24h" ? "HH:mm" : "h:mm a")}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              {getGreeting()} <WeatherWidget />
            </h1>
          </div>
          
          {/* Integrated Stats Bar */}
          <div className="flex-shrink-0">
            <GamificationBar />
          </div>
        </header>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div key="home" variants={containerVariants} initial="hidden" animate="show" exit="exit">
              <HomeView />
            </motion.div>
          )}

          {activeTab === "wellness" && (
            <motion.div key="wellness" variants={containerVariants} initial="hidden" animate="show" exit="exit">
              <WellnessView />
            </motion.div>
          )}

          {activeTab === "focus" && (
            <motion.div key="focus" variants={containerVariants} initial="hidden" animate="show" exit="exit">
              <FocusView />
            </motion.div>
          )}

          {activeTab === "goals" && (
            <motion.div key="goals" variants={containerVariants} initial="hidden" animate="show" exit="exit">
              <GoalsView />
            </motion.div>
          )}

          {activeTab === "finance" && (
            <motion.div key="finance" variants={containerVariants} initial="hidden" animate="show" exit="exit">
              <FinanceView />
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div key="profile" variants={containerVariants} initial="hidden" animate="show" exit="exit">
              <ProfileView />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom Floating Navigation Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card/85 backdrop-blur-lg border border-primary/20 shadow-lg rounded-full p-1.5 flex items-center gap-1 md:gap-1.5 max-w-[95vw] md:max-w-max select-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-bold transition-all duration-200 press-scale whitespace-nowrap ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline leading-none">{tab.label}</span>
            </button>
          );
        })}
        <div className="h-5 w-px bg-border/60 mx-1 shrink-0" />
        <ThemeToggle />
        <div className="h-5 w-px bg-border/60 mx-1 shrink-0" />
        <LofiPlayer />
        <div className="h-5 w-px bg-border/60 mx-1 shrink-0" />
        {/* Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full h-9 w-9 overflow-hidden border-2 border-primary/30 hover:border-primary/60 transition-all press-scale shadow-sm focus:outline-none"
              title={user.name}
              aria-label="Profile menu"
            >
              <Avatar className="h-full w-full">
                <AvatarImage src={user.picture} alt={user.name} referrerPolicy="no-referrer" />
                <AvatarFallback className="bg-pink-100 text-pink-600 text-xs font-bold">
                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={12}
            className="w-56 rounded-2xl border border-border/40 shadow-xl bg-card/95 backdrop-blur-md p-1.5"
          >
            {/* User info header */}
            <DropdownMenuLabel className="flex items-center gap-3 p-3 rounded-xl">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user.picture} alt={user.name} referrerPolicy="no-referrer" />
                <AvatarFallback className="bg-pink-100 text-pink-600 text-xs font-bold">
                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-foreground truncate">{user.name}</span>
                <span className="text-[11px] text-muted-foreground truncate">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 cursor-pointer focus:bg-primary/10 focus:text-primary"
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 cursor-pointer focus:bg-primary/10 focus:text-primary"
              onSelect={(e) => {
                e.preventDefault();
                setIsSettingsOpen(true);
              }}
            >
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  );
}