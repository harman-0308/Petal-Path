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

export const DEFAULT_WIDGET_SIZE: WidgetSize = "small";

export type WidgetDef = {
  id: string;
  title: string;
  icon: any; // Lucide icon
  component: (size?: WidgetSize) => ReactNode;
  defaultSpan: "col-span-1" | "col-span-2" | "col-span-3" | "col-span-4" | "lg:col-span-2" | "lg:col-span-4" | "lg:col-span-8";
  supportedSizes?: WidgetSize[];
  category: "Overview" | "Productivity" | "Wellness" | "Finance" | "Goals & Tracking" | "Journaling" | "Other";
};

export const WIDGET_REGISTRY: Record<string, WidgetDef> = {
  // New Widgets
  "today-overview": { id: "today-overview", title: "Today's Overview", icon: PieChart, component: (size) => <TodayTasksOverview />, defaultSpan: "lg:col-span-2", category: "Overview" },
  "productivity-analytics": { id: "productivity-analytics", title: "Productivity", icon: LineChart, component: (size) => <ProductivityAnalytics />, defaultSpan: "lg:col-span-2", category: "Productivity" },
  "finance-snapshot": { id: "finance-snapshot", title: "Finance Snapshot", icon: Wallet, component: (size) => <FinanceSnapshot />, defaultSpan: "lg:col-span-2", category: "Finance" },
  "wellness-overview": { id: "wellness-overview", title: "Wellness Overview", icon: Activity, component: (size) => <WellnessOverview />, defaultSpan: "lg:col-span-2", category: "Wellness" },
  "focus-timer": { id: "focus-timer", title: "Focus Timer", icon: Timer, component: (size) => <FocusTimerWidget />, defaultSpan: "lg:col-span-2", category: "Productivity" },
  "upcoming-events": { id: "upcoming-events", title: "Upcoming Events", icon: CalendarIcon, component: (size) => <UpcomingEvents />, defaultSpan: "lg:col-span-2", category: "Overview" },
  "goals-progress": { id: "goals-progress", title: "Goals Progress", icon: Target, component: (size) => <GoalsProgress />, defaultSpan: "lg:col-span-2", category: "Goals & Tracking" },
  "contacted-home": { id: "contacted-home", title: "Contacted Home", icon: Phone, component: (size) => <ContactedHome />, defaultSpan: "col-span-1", category: "Other" },
  "streaks": { id: "streaks", title: "Streaks & Consistency", icon: Flame, component: (size) => <StreaksConsistency />, defaultSpan: "col-span-1", category: "Goals & Tracking" },
  "weather-summary": { id: "weather-summary", title: "Weather Summary", icon: CloudSun, component: (size) => <WeatherSummary />, defaultSpan: "col-span-1", category: "Overview" },

  // Existing Widgets
  "todo-list": { id: "todo-list", title: "Todo List", icon: CheckSquare, component: (size) => <TodoList size={size} />, defaultSpan: "lg:col-span-2", supportedSizes: ["small", "medium", "large"], category: "Productivity" },
  "habit-tracker": { id: "habit-tracker", title: "Habit Tracker", icon: Activity, component: (size) => <HabitTracker size={size} />, defaultSpan: "lg:col-span-2", supportedSizes: ["small", "medium"], category: "Goals & Tracking" },
  "daily-planner": { id: "daily-planner", title: "Daily Planner", icon: CalendarIcon, component: (size) => <DailyPlanner size={size} />, defaultSpan: "lg:col-span-4", supportedSizes: ["small", "medium", "large"], category: "Productivity" },
  "digital-journal": { id: "digital-journal", title: "Digital Journal", icon: BookOpen, component: (size) => <DigitalJournal size={size} />, defaultSpan: "lg:col-span-4", supportedSizes: ["small", "medium", "large"], category: "Journaling" },
  "notes": { id: "notes", title: "Quick Notes", icon: StickyNote, component: (size) => <Notes />, defaultSpan: "lg:col-span-4", category: "Productivity" },
  
  "water-tracker": { id: "water-tracker", title: "Water Tracker", icon: Droplet, component: (size) => <WaterTracker size={size} />, defaultSpan: "col-span-1", supportedSizes: ["small", "medium"], category: "Wellness" },
  "sleep-tracker": { id: "sleep-tracker", title: "Sleep Tracker", icon: Moon, component: (size) => <SleepTracker />, defaultSpan: "col-span-1", category: "Wellness" },
  "exercise-tracker": { id: "exercise-tracker", title: "Exercise Tracker", icon: Dumbbell, component: (size) => <ExerciseTracker />, defaultSpan: "col-span-1", category: "Wellness" },
  "meal-tracker": { id: "meal-tracker", title: "Meal Tracker", icon: Utensils, component: (size) => <MealTracker />, defaultSpan: "col-span-1", category: "Wellness" },
  "affirmations": { id: "affirmations", title: "Affirmations", icon: MessageSquareHeart, component: (size) => <Affirmations />, defaultSpan: "col-span-1", category: "Journaling" },
  "mood-tracker": { id: "mood-tracker", title: "Mood Tracker", icon: Smile, component: (size) => <MoodTracker size={size} />, defaultSpan: "col-span-1", supportedSizes: ["small", "medium", "large"], category: "Wellness" },
  "energy-tracker": { id: "energy-tracker", title: "Energy Tracker", icon: Zap, component: (size) => <EnergyTracker />, defaultSpan: "col-span-1", category: "Wellness" },
  "self-care": { id: "self-care", title: "Self Care", icon: HeartHandshake, component: (size) => <SelfCareChecklist />, defaultSpan: "lg:col-span-2", category: "Wellness" },
  "little-things": { id: "little-things", title: "Little Things", icon: Sparkles, component: (size) => <LittleThings />, defaultSpan: "col-span-1", category: "Journaling" },
  "gratitude": { id: "gratitude", title: "Gratitude", icon: Gift, component: (size) => <GratitudeMini />, defaultSpan: "col-span-1", category: "Journaling" },
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
