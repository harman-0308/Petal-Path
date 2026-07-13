import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import DailyPlanner from "../components/dashboard/DailyPlanner";
import TodoList from "../components/dashboard/TodoList";
import HabitTracker from "../components/dashboard/HabitTracker";
import WaterTracker from "../components/dashboard/WaterTracker";
import SleepTracker from "../components/dashboard/SleepTracker";
import ExerciseTracker from "../components/dashboard/ExerciseTracker";
import MealTracker from "../components/dashboard/MealTracker";
import Affirmations from "../components/dashboard/Affirmations";
import Notes from "../components/dashboard/Notes";
import WeeklyView from "../components/dashboard/WeeklyView";
import MonthlyView from "../components/dashboard/MonthlyView";
import WellnessView from "../components/dashboard/WellnessView";
import FocusView from "../components/dashboard/FocusView";
import JournalView from "../components/dashboard/JournalView";
import MoodTracker from "../components/dashboard/MoodTracker";
import EnergyTracker from "../components/dashboard/EnergyTracker";
import SelfCareChecklist from "../components/dashboard/SelfCareChecklist";
import LittleThings from "../components/dashboard/LittleThings";
import WeatherWidget from "../components/dashboard/WeatherWidget";
import GratitudeMini from "../components/dashboard/GratitudeMini";
import LofiPlayer from "../components/dashboard/LofiPlayer";
import ThemePanel from "../components/dashboard/ThemePanel";
import GamificationBar from "../components/dashboard/GamificationBar";
import FinanceView from "../components/dashboard/FinanceView";
import ProfileView from "../components/dashboard/ProfileView";
import Login, { type UserProfile } from "../components/dashboard/Login";
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
} from "lucide-react";

const TABS = [
  { id: "daily", label: "Daily", icon: Sun },
  { id: "weekly", label: "Weekly", icon: CalendarRange },
  { id: "monthly", label: "Monthly", icon: CalendarDays },
  { id: "wellness", label: "Wellness", icon: Heart },
  { id: "focus", label: "Focus", icon: BrainCircuit },
  { id: "journal", label: "Journal", icon: PenLine },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "profile", label: "Profile", icon: User },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("daily");
  const [time, setTime] = useState(new Date());
  const [user, setUser] = useLocalStorage<UserProfile | null>("petal-user", null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden pb-32">
      
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
              <span>{format(time, "h:mm a")}</span>
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
          {activeTab === "daily" && (
            <motion.div 
              key="daily"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column (Wider) */}
              <div className="lg:col-span-8 space-y-6">
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TodoList />
                  <HabitTracker />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <DailyPlanner />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Notes />
                </motion.div>
              </div>

              {/* Right Column (Narrower) */}
              <div className="lg:col-span-4 space-y-6">
                <motion.div variants={itemVariants}>
                  <MoodTracker />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <EnergyTracker />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <SelfCareChecklist />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <LittleThings />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <GratitudeMini />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Affirmations />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <WaterTracker />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <SleepTracker />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <ExerciseTracker />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <MealTracker />
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "weekly" && (
            <motion.div key="weekly" variants={containerVariants} initial="hidden" animate="show" exit="exit">
              <WeeklyView />
            </motion.div>
          )}

          {activeTab === "monthly" && (
            <motion.div key="monthly" variants={containerVariants} initial="hidden" animate="show" exit="exit">
              <MonthlyView />
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

          {activeTab === "journal" && (
            <motion.div key="journal" variants={containerVariants} initial="hidden" animate="show" exit="exit">
              <JournalView />
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
        <ThemePanel />
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
              className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 cursor-default text-muted-foreground"
              disabled
            >
              <User className="h-4 w-4" />
              My Profile
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