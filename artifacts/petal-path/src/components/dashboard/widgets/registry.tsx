import { ReactNode } from "react";
import { 
  CheckSquare, 
  Activity, 
  Calendar as CalendarIcon, 
  Droplet, 
  Moon, 
  Dumbbell, 
  Utensils, 
  MessageSquareHeart, 
  StickyNote, 
  Smile, 
  Zap, 
  HeartHandshake, 
  Sparkles, 
  Gift, 
  BookOpen,
  PieChart,
  LineChart,
  Wallet,
  Timer,
  Target,
  Phone,
  Flame,
  CloudSun
} from "lucide-react";

// Existing Components
import TodoList from "../TodoList";
import HabitTracker from "../HabitTracker";
import DailyPlanner from "../DailyPlanner";
import WaterTracker from "../WaterTracker";
import SleepTracker from "../SleepTracker";
import ExerciseTracker from "../ExerciseTracker";
import MealTracker from "../MealTracker";
import Affirmations from "../Affirmations";
import Notes from "../Notes";
import MoodTracker from "../MoodTracker";
import EnergyTracker from "../EnergyTracker";
import SelfCareChecklist from "../SelfCareChecklist";
import LittleThings from "../LittleThings";
import GratitudeMini from "../GratitudeMini";
import DigitalJournal from "../DigitalJournal";

// New Placeholders
import { 
  TodayTasksOverview,
  ProductivityAnalytics,
  FinanceSnapshot,
  WellnessOverview,
  FocusTimerWidget,
  UpcomingEvents,
  GoalsProgress,
  ContactedHome,
  StreaksConsistency,
  WeatherSummary
} from "./WidgetPlaceholders";

export type WidgetDef = {
  id: string;
  title: string;
  icon: any; // Lucide icon
  component: ReactNode;
  defaultSpan: "col-span-1" | "col-span-2" | "col-span-3" | "col-span-4" | "lg:col-span-2" | "lg:col-span-4" | "lg:col-span-8";
};

export const WIDGET_REGISTRY: Record<string, WidgetDef> = {
  // New Widgets
  "today-overview": { id: "today-overview", title: "Today's Overview", icon: PieChart, component: <TodayTasksOverview />, defaultSpan: "lg:col-span-2" },
  "productivity-analytics": { id: "productivity-analytics", title: "Productivity", icon: LineChart, component: <ProductivityAnalytics />, defaultSpan: "lg:col-span-2" },
  "finance-snapshot": { id: "finance-snapshot", title: "Finance Snapshot", icon: Wallet, component: <FinanceSnapshot />, defaultSpan: "lg:col-span-2" },
  "wellness-overview": { id: "wellness-overview", title: "Wellness Overview", icon: Activity, component: <WellnessOverview />, defaultSpan: "lg:col-span-2" },
  "focus-timer": { id: "focus-timer", title: "Focus Timer", icon: Timer, component: <FocusTimerWidget />, defaultSpan: "lg:col-span-2" },
  "upcoming-events": { id: "upcoming-events", title: "Upcoming Events", icon: CalendarIcon, component: <UpcomingEvents />, defaultSpan: "lg:col-span-2" },
  "goals-progress": { id: "goals-progress", title: "Goals Progress", icon: Target, component: <GoalsProgress />, defaultSpan: "lg:col-span-2" },
  "contacted-home": { id: "contacted-home", title: "Contacted Home", icon: Phone, component: <ContactedHome />, defaultSpan: "col-span-1" },
  "streaks": { id: "streaks", title: "Streaks & Consistency", icon: Flame, component: <StreaksConsistency />, defaultSpan: "col-span-1" },
  "weather-summary": { id: "weather-summary", title: "Weather Summary", icon: CloudSun, component: <WeatherSummary />, defaultSpan: "col-span-1" },

  // Existing Widgets
  "todo-list": { id: "todo-list", title: "Todo List", icon: CheckSquare, component: <TodoList />, defaultSpan: "lg:col-span-2" },
  "habit-tracker": { id: "habit-tracker", title: "Habit Tracker", icon: Activity, component: <HabitTracker />, defaultSpan: "lg:col-span-2" },
  "daily-planner": { id: "daily-planner", title: "Daily Planner", icon: CalendarIcon, component: <DailyPlanner />, defaultSpan: "lg:col-span-4" },
  "digital-journal": { id: "digital-journal", title: "Digital Journal", icon: BookOpen, component: <DigitalJournal />, defaultSpan: "lg:col-span-4" },
  "notes": { id: "notes", title: "Quick Notes", icon: StickyNote, component: <Notes />, defaultSpan: "lg:col-span-4" },
  
  "water-tracker": { id: "water-tracker", title: "Water Tracker", icon: Droplet, component: <WaterTracker />, defaultSpan: "col-span-1" },
  "sleep-tracker": { id: "sleep-tracker", title: "Sleep Tracker", icon: Moon, component: <SleepTracker />, defaultSpan: "col-span-1" },
  "exercise-tracker": { id: "exercise-tracker", title: "Exercise Tracker", icon: Dumbbell, component: <ExerciseTracker />, defaultSpan: "col-span-1" },
  "meal-tracker": { id: "meal-tracker", title: "Meal Tracker", icon: Utensils, component: <MealTracker />, defaultSpan: "col-span-1" },
  "affirmations": { id: "affirmations", title: "Affirmations", icon: MessageSquareHeart, component: <Affirmations />, defaultSpan: "col-span-1" },
  "mood-tracker": { id: "mood-tracker", title: "Mood Tracker", icon: Smile, component: <MoodTracker />, defaultSpan: "col-span-1" },
  "energy-tracker": { id: "energy-tracker", title: "Energy Tracker", icon: Zap, component: <EnergyTracker />, defaultSpan: "col-span-1" },
  "self-care": { id: "self-care", title: "Self Care", icon: HeartHandshake, component: <SelfCareChecklist />, defaultSpan: "lg:col-span-2" },
  "little-things": { id: "little-things", title: "Little Things", icon: Sparkles, component: <LittleThings />, defaultSpan: "col-span-1" },
  "gratitude": { id: "gratitude", title: "Gratitude", icon: Gift, component: <GratitudeMini />, defaultSpan: "col-span-1" },
};

export const DEFAULT_WIDGET_LAYOUT = [
  "today-overview",
  "productivity-analytics",
  "todo-list",
  "habit-tracker",
  "daily-planner",
  "water-tracker",
  "mood-tracker",
  "digital-journal"
];
