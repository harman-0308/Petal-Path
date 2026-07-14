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

export type WidgetSize = "small" | "medium" | "large";

export type WidgetDef = {
  id: string;
  title: string;
  icon: any; // Lucide icon
  component: (size?: WidgetSize) => ReactNode;
  defaultSpan: "col-span-1" | "col-span-2" | "col-span-3" | "col-span-4" | "lg:col-span-2" | "lg:col-span-4" | "lg:col-span-8";
};

export const WIDGET_REGISTRY: Record<string, WidgetDef> = {
  // New Widgets
  "today-overview": { id: "today-overview", title: "Today's Overview", icon: PieChart, component: (size) => <TodayTasksOverview />, defaultSpan: "lg:col-span-2" },
  "productivity-analytics": { id: "productivity-analytics", title: "Productivity", icon: LineChart, component: (size) => <ProductivityAnalytics />, defaultSpan: "lg:col-span-2" },
  "finance-snapshot": { id: "finance-snapshot", title: "Finance Snapshot", icon: Wallet, component: (size) => <FinanceSnapshot />, defaultSpan: "lg:col-span-2" },
  "wellness-overview": { id: "wellness-overview", title: "Wellness Overview", icon: Activity, component: (size) => <WellnessOverview />, defaultSpan: "lg:col-span-2" },
  "focus-timer": { id: "focus-timer", title: "Focus Timer", icon: Timer, component: (size) => <FocusTimerWidget />, defaultSpan: "lg:col-span-2" },
  "upcoming-events": { id: "upcoming-events", title: "Upcoming Events", icon: CalendarIcon, component: (size) => <UpcomingEvents />, defaultSpan: "lg:col-span-2" },
  "goals-progress": { id: "goals-progress", title: "Goals Progress", icon: Target, component: (size) => <GoalsProgress />, defaultSpan: "lg:col-span-2" },
  "contacted-home": { id: "contacted-home", title: "Contacted Home", icon: Phone, component: (size) => <ContactedHome />, defaultSpan: "col-span-1" },
  "streaks": { id: "streaks", title: "Streaks & Consistency", icon: Flame, component: (size) => <StreaksConsistency />, defaultSpan: "col-span-1" },
  "weather-summary": { id: "weather-summary", title: "Weather Summary", icon: CloudSun, component: (size) => <WeatherSummary />, defaultSpan: "col-span-1" },

  // Existing Widgets
  "todo-list": { id: "todo-list", title: "Todo List", icon: CheckSquare, component: (size) => <TodoList size={size} />, defaultSpan: "lg:col-span-2" },
  "habit-tracker": { id: "habit-tracker", title: "Habit Tracker", icon: Activity, component: (size) => <HabitTracker size={size} />, defaultSpan: "lg:col-span-2" },
  "daily-planner": { id: "daily-planner", title: "Daily Planner", icon: CalendarIcon, component: (size) => <DailyPlanner />, defaultSpan: "lg:col-span-4" },
  "digital-journal": { id: "digital-journal", title: "Digital Journal", icon: BookOpen, component: (size) => <DigitalJournal />, defaultSpan: "lg:col-span-4" },
  "notes": { id: "notes", title: "Quick Notes", icon: StickyNote, component: (size) => <Notes />, defaultSpan: "lg:col-span-4" },
  
  "water-tracker": { id: "water-tracker", title: "Water Tracker", icon: Droplet, component: (size) => <WaterTracker size={size} />, defaultSpan: "col-span-1" },
  "sleep-tracker": { id: "sleep-tracker", title: "Sleep Tracker", icon: Moon, component: (size) => <SleepTracker />, defaultSpan: "col-span-1" },
  "exercise-tracker": { id: "exercise-tracker", title: "Exercise Tracker", icon: Dumbbell, component: (size) => <ExerciseTracker />, defaultSpan: "col-span-1" },
  "meal-tracker": { id: "meal-tracker", title: "Meal Tracker", icon: Utensils, component: (size) => <MealTracker />, defaultSpan: "col-span-1" },
  "affirmations": { id: "affirmations", title: "Affirmations", icon: MessageSquareHeart, component: (size) => <Affirmations />, defaultSpan: "col-span-1" },
  "mood-tracker": { id: "mood-tracker", title: "Mood Tracker", icon: Smile, component: (size) => <MoodTracker />, defaultSpan: "col-span-1" },
  "energy-tracker": { id: "energy-tracker", title: "Energy Tracker", icon: Zap, component: (size) => <EnergyTracker />, defaultSpan: "col-span-1" },
  "self-care": { id: "self-care", title: "Self Care", icon: HeartHandshake, component: (size) => <SelfCareChecklist />, defaultSpan: "lg:col-span-2" },
  "little-things": { id: "little-things", title: "Little Things", icon: Sparkles, component: (size) => <LittleThings />, defaultSpan: "col-span-1" },
  "gratitude": { id: "gratitude", title: "Gratitude", icon: Gift, component: (size) => <GratitudeMini />, defaultSpan: "col-span-1" },
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
