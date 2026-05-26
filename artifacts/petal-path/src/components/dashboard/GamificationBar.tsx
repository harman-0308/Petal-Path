import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function GamificationBar() {
  const today = format(new Date(), "yyyy-MM-dd");
  
  // Data hooks
  const [habitLogs] = useLocalStorage<Record<string, string[]>>("petal-habit-logs", {});
  const [todos] = useLocalStorage<any[]>("petal-todo", []);
  const [journalEntries] = useLocalStorage<any[]>("petal-journal-entries", []);
  const [waterLogs] = useLocalStorage<Record<string, number>>("petal-water-logs", {});
  const [moodLogs] = useLocalStorage<Record<string, any>>("petal-mood", {});
  const [studySessions] = useLocalStorage<any[]>("petal-study-sessions", []);
  const [gratitude] = useLocalStorage<Record<string, any>>("petal-gratitude", {});

  const [stats, setStats] = useState({ xp: 0, todayXP: 0, level: 1, streaks: [] as string[] });

  useEffect(() => {
    let totalXP = 0;
    let todayXP = 0;

    Object.keys(habitLogs).forEach(date => {
      const xp = (habitLogs[date]?.length || 0) * 10;
      totalXP += xp;
      if (date === today) todayXP += xp;
    });

    todos.forEach(t => {
      if (t.completed) {
        totalXP += 5;
        // Simplification for 'today': assuming completed is sufficient if no date
      }
    });

    journalEntries.forEach(j => {
      totalXP += 20;
      if (j.date === today) todayXP += 20;
    });

    Object.keys(waterLogs).forEach(date => {
      if (waterLogs[date] >= 8) {
        totalXP += 15;
        if (date === today) todayXP += 15;
      }
    });

    Object.keys(moodLogs).forEach(date => {
      totalXP += 10;
      if (date === today) todayXP += 10;
    });

    studySessions.forEach(s => {
      totalXP += 10;
    });

    const level = Math.floor(totalXP / 100) + 1;

    const getStreak = (logs: Record<string, any> | string[]) => {
      let streak = 0;
      let current = new Date();
      while (true) {
        const d = format(current, "yyyy-MM-dd");
        const hasLog = Array.isArray(logs) ? logs.some(l => l.date === d) : !!logs[d];
        if (hasLog || (streak === 0 && d === today)) {
          if (hasLog) streak++;
          current.setDate(current.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    };

    const habitDates = Object.keys(habitLogs).filter(k => habitLogs[k]?.length > 0).reduce((acc, k) => ({...acc, [k]: true}), {});
    const habitStreak = getStreak(habitDates);
    const journalStreak = getStreak(journalEntries);
    const gratitudeDates = Object.keys(gratitude).filter(k => gratitude[k]?.length > 0).reduce((acc, k) => ({...acc, [k]: true}), {});
    const gratitudeStreak = getStreak(gratitudeDates);

    const activeStreaks = [];
    if (habitStreak > 0) activeStreaks.push(`🔥 ${habitStreak} day habit streak`);
    if (gratitudeStreak > 0) activeStreaks.push(`🌸 ${gratitudeStreak} day gratitude streak`);
    if (journalStreak > 0) activeStreaks.push(`📔 ${journalStreak} day journal streak`);

    setStats({
      xp: totalXP,
      todayXP,
      level,
      streaks: activeStreaks.slice(0, 2)
    });
  }, [habitLogs, todos, journalEntries, waterLogs, moodLogs, studySessions, gratitude, today]);

  const getTierName = (lvl: number) => {
    if (lvl === 1) return "Seedling";
    if (lvl === 2) return "Sprout";
    if (lvl === 3) return "Bloomer";
    if (lvl === 4) return "Petal";
    if (lvl === 5) return "Blossom";
    return "Garden Goddess";
  };

  const getTodayBadge = (xp: number) => {
    if (xp >= 150) return "⭐ Star Day";
    if (xp >= 100) return "✨ Great Day";
    if (xp >= 50) return "🌱 Good Start";
    return null;
  };

  const todayBadge = getTodayBadge(stats.todayXP);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-4 bg-card/60 backdrop-blur-sm border border-border/30 rounded-2xl px-5 py-3 mb-6"
    >
      <div className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
        ✨ {stats.xp} XP
      </div>
      <div className="text-xs font-bold bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full">
        Lv. {stats.level} {getTierName(stats.level)}
      </div>
      {stats.streaks.map((s, i) => (
        <div key={i} className="text-xs font-bold bg-accent/10 text-accent-foreground px-3 py-1 rounded-full">
          {s}
        </div>
      ))}
      {todayBadge && (
        <div className="text-xs font-bold bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full">
          {todayBadge}
        </div>
      )}
    </motion.div>
  );
}
