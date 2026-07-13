import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSettings } from "@/hooks/use-settings";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function WeeklyView() {
  const { settings } = useSettings();
  const [habits] = useLocalStorage<{ id: string; name: string; streak: number }[]>("petal-habits", []);
  const [habitLogs] = useLocalStorage<Record<string, string[]>>("petal-habit-logs", {});
  const [sleepLogs] = useLocalStorage<Record<string, { duration?: string }>>("petal-sleep", {});
  const [weekNotes, setWeekNotes] = useLocalStorage<Record<string, string>>("petal-week-notes", {});

  const today = new Date();
  const weekStartsOn = settings.weekStart === "monday" ? 1 : 0;
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

  let totalHabitsCompleted = 0;
  let totalSleepMins = 0;
  let sleepDays = 0;

  weekDays.forEach(day => {
    const dateStr = format(day, "yyyy-MM-dd");
    totalHabitsCompleted += (habitLogs[dateStr] || []).length;
    const sleep = sleepLogs[dateStr];
    if (sleep?.duration) {
      const match = sleep.duration.match(/(\d+)h\s*((\d+)m)?/);
      if (match) {
        totalSleepMins += parseInt(match[1] || '0') * 60 + parseInt(match[3] || '0');
        sleepDays++;
      }
    }
  });

  const avgSleepMins = sleepDays > 0 ? totalSleepMins / sleepDays : 0;
  const avgSleep = avgSleepMins > 0
    ? `${Math.floor(avgSleepMins / 60)}h ${Math.floor(avgSleepMins % 60)}m`
    : '—';

  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak ?? 0)) : 0;

  const updateNote = (dateStr: string, value: string) => {
    setWeekNotes(prev => ({ ...prev, [dateStr]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/10 border-none shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-primary mb-1">{totalHabitsCompleted}</span>
            <span className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Habits Completed</span>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10 border-none shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-secondary-foreground mb-1">{bestStreak}</span>
            <span className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Best Streak</span>
          </CardContent>
        </Card>
        <Card className="bg-accent/10 border-none shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-accent-foreground mb-1">{avgSleep}</span>
            <span className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Avg Sleep</span>
          </CardContent>
        </Card>
      </div>

      {/* Habit Heatmap */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-primary font-bold">Habit Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left font-medium text-muted-foreground pb-4 min-w-[120px]">Habit</th>
                  {weekDays.map(day => (
                    <th key={day.toISOString()} className="font-medium text-muted-foreground pb-4 px-2 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xs uppercase">{format(day, 'EEE')}</span>
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full mt-1 text-xs ${
                          isSameDay(day, today) ? 'bg-primary text-white font-bold' : ''
                        }`}>
                          {format(day, 'd')}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map((habit, idx) => (
                  <motion.tr
                    key={habit.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-t border-border/30"
                  >
                    <td className="py-3 font-medium text-foreground/90 text-sm">{habit.name}</td>
                    {weekDays.map(day => {
                      const dateStr = format(day, "yyyy-MM-dd");
                      const isDone = (habitLogs[dateStr] || []).includes(habit.id);
                      return (
                        <td key={day.toISOString()} className="py-3 text-center px-2">
                          <div className={`mx-auto w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                            isDone ? 'bg-primary/20 shadow-sm shadow-primary/10' : 'bg-muted/30'
                          }`}>
                            {isDone && <span className="text-primary text-xs font-bold">✓</span>}
                          </div>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
                {habits.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-muted-foreground text-sm italic">
                      🌱 No habits yet — add some on the Daily tab to see them here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Week at a Glance — editable notes per day */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-primary font-bold">Week at a Glance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekDays.map(day => {
              const dateStr = format(day, "yyyy-MM-dd");
              const isToday = isSameDay(day, today);
              return (
                <div
                  key={day.toISOString()}
                  className={`rounded-xl p-3 min-h-[120px] border flex flex-col gap-2 transition-colors ${
                    isToday
                      ? 'bg-primary/5 border-primary/30 shadow-sm'
                      : 'bg-muted/20 border-border/50'
                  }`}
                >
                  <div className={`font-bold text-xs uppercase tracking-wide ${isToday ? 'text-primary' : 'text-foreground/70'}`}>
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-lg font-extrabold leading-none ${isToday ? 'text-primary' : 'text-foreground/50'}`}>
                    {format(day, 'd')}
                  </div>
                  <textarea
                    value={weekNotes[dateStr] || ""}
                    onChange={e => updateNote(dateStr, e.target.value)}
                    placeholder="Notes..."
                    rows={3}
                    className="flex-1 w-full text-xs bg-transparent border-none outline-none resize-none text-foreground/70 placeholder:text-muted-foreground/40 pretty-scroll mt-auto"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
