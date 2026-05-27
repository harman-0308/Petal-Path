import { useState, useMemo } from "react";
import { format, subDays, addDays, differenceInDays, parseISO, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isBefore } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { Droplet, Calendar as CalendarIcon, Heart, Moon, Activity, Sparkles, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PeriodCycle = { id: string; startDate: string; endDate: string | null; };
type PeriodLog = { symptoms: string[]; notes: string; };

const SYMPTOMS = ["Cramps", "Bloating", "Fatigue", "Mood Swings", "Headache", "Spotting", "Acne", "Backache"];
const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;

export default function WellnessView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Data from LocalStorage
  const [cycles, setCycles] = useLocalStorage<PeriodCycle[]>("petal-period-cycles", []);
  const [logs, setLogs] = useLocalStorage<Record<string, PeriodLog>>("petal-period-logs", {});
  const [moodLogs] = useLocalStorage<Record<string, { mood: string; intensity: number; note: string }>>("petal-mood", {});
  const [energyLogs] = useLocalStorage<Record<string, { energy: number; motivation: number; stress: number; social: number }>>("petal-energy", {});
  const [sleepLogs] = useLocalStorage<Record<string, { sleepTime: string; wakeTime: string; quality: number; duration: string }>>("petal-sleep", {});
  const [gratitudeLogs] = useLocalStorage<Record<string, { id: string; text: string }[]>>("petal-gratitude", {});

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const currentLog = logs[selectedDateStr] || { symptoms: [], notes: "" };

  // Period Tracker Logic
  const activeCycle = useMemo(() => {
    return [...cycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
  }, [cycles]);

  const togglePeriodStart = () => {
    if (activeCycle && !activeCycle.endDate && activeCycle.startDate === selectedDateStr) {
      // Remove cycle if started today and toggled off
      setCycles(cycles.filter(c => c.id !== activeCycle.id));
    } else if (activeCycle && !activeCycle.endDate) {
      // End current cycle
      setCycles(cycles.map(c => c.id === activeCycle.id ? { ...c, endDate: selectedDateStr } : c));
    } else {
      // Start new cycle
      setCycles([...cycles, { id: Date.now().toString(), startDate: selectedDateStr, endDate: null }]);
    }
  };

  const isPeriodDay = (dateStr: string) => {
    return cycles.some(c => {
      const start = new Date(c.startDate);
      const end = c.endDate ? new Date(c.endDate) : addDays(start, DEFAULT_PERIOD_LENGTH - 1);
      const target = new Date(dateStr);
      return target >= start && target <= end;
    });
  };

  const getPrediction = (dateStr: string) => {
    if (!activeCycle) return null;
    const lastStart = new Date(activeCycle.startDate);
    const nextPredictedStart = addDays(lastStart, DEFAULT_CYCLE_LENGTH);
    const target = new Date(dateStr);
    
    if (target >= nextPredictedStart && target <= addDays(nextPredictedStart, DEFAULT_PERIOD_LENGTH - 1)) {
      return "predicted";
    }
    
    const fertileStart = addDays(lastStart, 10);
    const fertileEnd = addDays(lastStart, 16);
    if (target >= fertileStart && target <= fertileEnd) {
      return "fertile";
    }
    return null;
  };

  const nextPeriodDate = activeCycle ? addDays(new Date(activeCycle.startDate), DEFAULT_CYCLE_LENGTH) : null;
  const currentCycleDay = activeCycle ? differenceInDays(new Date(), new Date(activeCycle.startDate)) + 1 : 0;

  const updateLog = (updates: Partial<PeriodLog>) => {
    setLogs({ ...logs, [selectedDateStr]: { ...currentLog, ...updates } });
  };

  const toggleSymptom = (symptom: string) => {
    const newSymptoms = currentLog.symptoms.includes(symptom)
      ? currentLog.symptoms.filter(s => s !== symptom)
      : [...currentLog.symptoms, symptom];
    updateLog({ symptoms: newSymptoms });
  };

  // Calendar rendering
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const prevMonth = () => setCurrentMonth(subDays(monthStart, 1));
  const nextMonth = () => setCurrentMonth(addDays(monthEnd, 1));

  // Analytics Data
  const last14Days = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const d = subDays(new Date(), 13 - i);
      const dateStr = format(d, "yyyy-MM-dd");
      return {
        date: format(d, "MMM dd"),
        mood: moodLogs[dateStr]?.intensity || 0,
        energy: energyLogs[dateStr]?.energy || 0,
        stress: energyLogs[dateStr]?.stress || 0,
        sleep: sleepLogs[dateStr]?.quality || 0,
      };
    });
  }, [moodLogs, energyLogs, sleepLogs]);

  const last7Days = last14Days.slice(-7);

  const gratitudeStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
      if (gratitudeLogs[dateStr] && gratitudeLogs[dateStr].length > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [gratitudeLogs]);

  const avgMood = last7Days.reduce((sum, d) => sum + d.mood, 0) / 7;
  const avgEnergy = last7Days.reduce((sum, d) => sum + d.energy, 0) / 7;

  return (
    <div className="space-y-6 pb-24">
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card hover-elevate">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <Heart className="h-5 w-5 text-primary mb-1" />
            <div className="text-2xl font-bold text-foreground">{avgMood > 0 ? avgMood.toFixed(1) : "-"}</div>
            <div className="text-xs text-muted-foreground">Avg Mood (7d)</div>
          </CardContent>
        </Card>
        <Card className="bg-card hover-elevate">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <Activity className="h-5 w-5 text-yellow-500 mb-1" />
            <div className="text-2xl font-bold text-foreground">{avgEnergy > 0 ? avgEnergy.toFixed(1) : "-"}</div>
            <div className="text-xs text-muted-foreground">Avg Energy (7d)</div>
          </CardContent>
        </Card>
        <Card className="bg-card hover-elevate">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <Sparkles className="h-5 w-5 text-accent mb-1" />
            <div className="text-2xl font-bold text-foreground">{gratitudeStreak}</div>
            <div className="text-xs text-muted-foreground">Gratitude Streak</div>
          </CardContent>
        </Card>
        <Card className="bg-card hover-elevate">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
            <Moon className="h-5 w-5 text-secondary mb-1" />
            <div className="text-2xl font-bold text-foreground">
              {sleepLogs[format(new Date(), "yyyy-MM-dd")]?.duration || "-"}
            </div>
            <div className="text-xs text-muted-foreground">Last Sleep</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Period Tracker Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card/50 border-primary/20 shadow-sm overflow-hidden">
            <div className="bg-primary/10 p-4 border-b border-primary/10 flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <Droplet className="h-5 w-5 fill-primary" /> Cycle Tracker
                </CardTitle>
                <CardDescription className="text-primary/70 mt-1">
                  {nextPeriodDate ? `Next expected: ${format(nextPeriodDate, "MMM d")}` : "No active cycle"}
                  {currentCycleDay > 0 && ` • Day ${currentCycleDay}`}
                </CardDescription>
              </div>
              <Button 
                onClick={togglePeriodStart} 
                variant={activeCycle && !activeCycle.endDate ? "default" : "outline"}
                className={`rounded-full ${activeCycle && !activeCycle.endDate ? 'bg-primary hover:bg-primary/90 text-white' : 'border-primary text-primary hover:bg-primary/10'}`}
              >
                {activeCycle && !activeCycle.endDate ? "End Period" : "Log Period"}
              </Button>
            </div>
            <CardContent className="p-4 space-y-6">
              {/* Custom Calendar */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 text-muted-foreground hover:text-primary"><ChevronLeft className="h-4 w-4" /></Button>
                  <div className="font-bold text-sm text-foreground">{format(currentMonth, "MMMM yyyy")}</div>
                  <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 text-muted-foreground hover:text-primary"><ChevronRight className="h-4 w-4" /></Button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-[10px] font-semibold text-muted-foreground">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const period = isPeriodDay(dateStr);
                    const prediction = getPrediction(dateStr);
                    
                    let bgClass = "bg-transparent hover:bg-muted/50";
                    let textClass = isCurrentMonth ? "text-foreground" : "text-muted-foreground/30";
                    
                    if (period) {
                      bgClass = "bg-primary/20 border-primary/40";
                      textClass = "text-primary font-bold";
                    } else if (prediction === "predicted") {
                      bgClass = "bg-secondary/20 border-secondary/40 border-dashed border";
                      textClass = "text-secondary-foreground";
                    } else if (prediction === "fertile") {
                      bgClass = "bg-accent/20";
                      textClass = "text-accent-foreground";
                    }
                    
                    if (isSelected) {
                      bgClass += " ring-2 ring-primary ring-offset-2 ring-offset-background";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square flex items-center justify-center rounded-full text-xs transition-all ${bgClass} ${textClass}`}
                      >
                        {format(day, "d")}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-4 justify-center mt-4 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary/40" /> Period</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border border-dashed border-secondary/60 bg-secondary/20" /> Predicted</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent/40" /> Fertile</div>
                </div>
              </div>

              {/* Log for selected date */}
              <div className="pt-4 border-t border-border/50">
                <h4 className="font-semibold text-sm mb-3 flex items-center justify-between">
                  <span>Log for {format(selectedDate, "MMM d")}</span>
                  {isToday(selectedDate) && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Today</span>}
                </h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Symptoms</Label>
                    <div className="flex flex-wrap gap-2">
                      {SYMPTOMS.map(s => {
                        const active = currentLog.symptoms.includes(s);
                        return (
                          <button
                            key={s}
                            onClick={() => toggleSymptom(s)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                              active 
                                ? "bg-secondary text-secondary-foreground border-secondary" 
                                : "bg-transparent text-muted-foreground border-border hover:border-secondary/50"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Notes</Label>
                    <Textarea 
                      value={currentLog.notes}
                      onChange={(e) => updateLog({ notes: e.target.value })}
                      placeholder="How are you feeling today?"
                      className="min-h-[80px] text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Cycle History */}
              {cycles.length > 0 && (
                <div className="pt-4 border-t border-border/50">
                  <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Cycle History</h4>
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                    {[...cycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map(c => {
                      const start = new Date(c.startDate);
                      const end = c.endDate ? new Date(c.endDate) : null;
                      const duration = end ? differenceInDays(end, start) + 1 : currentCycleDay;
                      return (
                        <div key={c.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-muted/30">
                          <span className="font-medium text-foreground">{format(start, "MMM d, yyyy")}</span>
                          <span className="text-muted-foreground text-xs">{duration} days {!c.endDate && "(Current)"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card hover-elevate">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-foreground">Mood & Energy (14 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last14Days} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "var(--shadow-md)" }}
                      cursor={{ stroke: "hsl(var(--muted))", strokeWidth: 2 }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                    <Line type="monotone" name="Mood" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Energy" dataKey="energy" stroke="#eab308" strokeWidth={3} dot={{ r: 4, fill: "#eab308", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card hover-elevate">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground">Stress vs Energy (7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={last7Days} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <RechartsTooltip cursor={{ fill: "hsl(var(--muted)/0.4)" }} contentStyle={{ borderRadius: "8px", border: "none" }} />
                      <Bar name="Energy" dataKey="energy" fill="#eab308" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar name="Stress" dataKey="stress" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card hover-elevate">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground">Sleep Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={last7Days} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                      <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
                      <Line type="step" name="Sleep Quality" dataKey="sleep" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--accent))", strokeWidth: 2, stroke: "#fff" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
