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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("daily");
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
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans selection:bg-primary/20 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        <ThemePanel />
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary text-xl">✿</span>
              <span className="font-bold text-muted-foreground tracking-wider uppercase text-xs">Petal Path</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
              {getGreeting()} <WeatherWidget />
            </h1>
            <p className="text-muted-foreground mt-2 font-medium">
              {format(time, "EEEE, MMMM do")} • {format(time, "h:mm a")}
            </p>
          </div>

          <div className="flex bg-card p-1 rounded-full border border-border/50 shadow-sm shadow-primary/5 overflow-x-auto no-scrollbar">
            {[
              { id: "daily", label: "Daily" },
              { id: "weekly", label: "Weekly" },
              { id: "monthly", label: "Monthly" },
              { id: "wellness", label: "Wellness" },
              { id: "focus", label: "Focus" },
              { id: "journal", label: "Journal" },
              { id: "finance", label: "Finance" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap tracking-wide ${
                  activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
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
    </div>
  );
}