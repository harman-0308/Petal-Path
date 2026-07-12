import { useState, useEffect } from "react";
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
import { 
  Menu, 
  X, 
  Sun, 
  CalendarRange, 
  CalendarDays, 
  Heart, 
  BrainCircuit, 
  PenLine, 
  Wallet 
} from "lucide-react";

const TABS = [
  { id: "daily", label: "Daily", icon: Sun },
  { id: "weekly", label: "Weekly", icon: CalendarRange },
  { id: "monthly", label: "Monthly", icon: CalendarDays },
  { id: "wellness", label: "Wellness", icon: Heart },
  { id: "focus", label: "Focus", icon: BrainCircuit },
  { id: "journal", label: "Journal", icon: PenLine },
  { id: "finance", label: "Finance", icon: Wallet },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("daily");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

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
        
        {/* Header */}
        <header className="pb-6 border-b border-border/40 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-primary text-xl">✿</span>
            <span className="font-bold text-muted-foreground tracking-wider uppercase text-xs">Petal Path</span>
          </div>
          <div className="flex justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                {getGreeting()} <WeatherWidget />
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">
                {format(time, "EEEE, MMMM do")} • {format(time, "h:mm a")}
              </p>
            </div>
          </div>
        </header>

        <GamificationBar />

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
        </AnimatePresence>

        <LofiPlayer />
      </div>

      {/* Bottom Floating Navigation Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card/85 backdrop-blur-lg border border-primary/20 shadow-lg rounded-full px-4 py-2 flex items-center gap-1.5 md:gap-2 max-w-[95vw] md:max-w-max select-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 press-scale whitespace-nowrap ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.05]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <Icon className="h-4.5 w-4.5 animate-duration-300" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
        <div className="h-5 w-px bg-border/60 mx-1 shrink-0" />
        <ThemePanel />
      </div>

    </div>
  );
}