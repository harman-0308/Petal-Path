import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function GamificationBar() {
  const today = format(new Date(), "yyyy-MM-dd");

  const [habitLogs] = useLocalStorage<Record<string, string[]>>("petal-habit-logs", {});
  const [todos] = useLocalStorage<{ id: string; text: string; done: boolean; priority: string }[]>("petal-todos", []);
  const [journalEntries] = useLocalStorage<{ id: string; date: string }[]>("petal-journal-entries", []);
  const [waterLogs] = useLocalStorage<Record<string, number>>("petal-water", {});
  const [moodLogs] = useLocalStorage<Record<string, unknown>>("petal-mood", {});
  const [studySessions] = useLocalStorage<{ id: string; date: string }[]>("petal-study-sessions", []);
  const [gratitude] = useLocalStorage<Record<string, unknown[]>>("petal-gratitude", {});

  const [stats, setStats] = useState({ xp: 0, todayXP: 0, level: 1, streaks: [] as string[] });

  useEffect(() => {
    let totalXP = 0;
    let todayXP = 0;

    // Habits — 10 XP per habit log per day
    Object.keys(habitLogs).forEach(date => {
      const xp = (habitLogs[date]?.length || 0) * 10;
      totalXP += xp;
      if (date === today) todayXP += xp;
    });

    // Todos — 5 XP per completed task
    todos.forEach(t => {
      if (t.done) {
        totalXP += 5;
        todayXP += 5; // no date on todos, conservative credit to today
      }
    });

    // Journal entries — 20 XP each
    journalEntries.forEach(j => {
      totalXP += 20;
      if (j.date === today) todayXP += 20;
    });

    // Water — 15 XP if 8+ glasses logged
    Object.keys(waterLogs).forEach(date => {
      if ((waterLogs[date] || 0) >= 8) {
        totalXP += 15;
        if (date === today) todayXP += 15;
      }
    });

    // Mood — 10 XP per log
    Object.keys(moodLogs).forEach(date => {
      totalXP += 10;
      if (date === today) todayXP += 10;
    });

    // Study sessions — 10 XP each
    studySessions.forEach(() => {
      totalXP += 10;
    });

    const level = Math.floor(totalXP / 100) + 1;

    // Safe streak calculator — max 365 days lookback
    const getStreak = (dateMap: Record<string, unknown>): number => {
      let streak = 0;
      const d = new Date();
      for (let i = 0; i < 365; i++) {
        const dateStr = format(d, "yyyy-MM-dd");
        if (dateMap[dateStr]) {
          streak++;
          d.setDate(d.getDate() - 1);
        } else if (i === 0) {
          // allow missing today — check yesterday
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    };

    const habitDates = Object.fromEntries(
      Object.keys(habitLogs).filter(k => (habitLogs[k]?.length || 0) > 0).map(k => [k, true])
    );
    const gratitudeDates = Object.fromEntries(
      Object.keys(gratitude).filter(k => (gratitude[k]?.length || 0) > 0).map(k => [k, true])
    );
    const journalDates = Object.fromEntries(
      journalEntries.map(j => [j.date, true])
    );

    const habitStreak = getStreak(habitDates);
    const gratitudeStreak = getStreak(gratitudeDates);
    const journalStreak = getStreak(journalDates);

    const activeStreaks: string[] = [];
    if (habitStreak > 0) activeStreaks.push(`🔥 ${habitStreak} day habit streak`);
    if (gratitudeStreak > 0) activeStreaks.push(`🌸 ${gratitudeStreak} day gratitude streak`);
    if (journalStreak > 0) activeStreaks.push(`📔 ${journalStreak} day journal streak`);

    setStats({ xp: totalXP, todayXP, level, streaks: activeStreaks.slice(0, 2) });
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
  const xpInLevel = stats.xp % 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3 bg-card/60 backdrop-blur-sm border border-border/30 rounded-2xl px-5 py-3 mb-6"
    >
      <div className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
        ✨ {stats.xp} XP
      </div>
      <div className="text-xs font-bold bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full">
        Lv. {stats.level} {getTierName(stats.level)}
      </div>
      {xpInLevel > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${xpInLevel}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">{xpInLevel}/100</span>
        </div>
      )}
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
