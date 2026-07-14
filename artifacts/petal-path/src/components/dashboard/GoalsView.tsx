import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DailyView from "./DailyView";
import WeeklyView from "./WeeklyView";
import MonthlyView from "./MonthlyView";

const GOALS_TABS = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

export default function GoalsView() {
  const [activeTab, setActiveTab] = useState("daily");

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div className="space-y-6">
      {/* Segmented Controls / Tabs aligned to top right */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex items-center p-1 bg-muted/50 rounded-full border border-border/50">
          {GOALS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-2 text-sm font-bold rounded-full transition-colors ${
                activeTab === tab.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="goals-tab-indicator"
                  className="absolute inset-0 bg-primary rounded-full shadow-sm"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === "daily" && (
          <motion.div key="daily" variants={containerVariants} initial="hidden" animate="show" exit="exit">
            <DailyView />
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
      </AnimatePresence>
    </div>
  );
}
