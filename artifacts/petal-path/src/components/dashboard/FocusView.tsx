import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, subDays, isSameDay, parseISO } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSettings } from "@/hooks/use-settings";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, Plus, BookOpen, Clock, BrainCircuit, Flame, Trophy, CheckCircle2, Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

// Types
type SessionType = "Pomodoro" | "Deep Work" | "Review";
type StudySession = {
  id: string;
  date: string; // ISO yyyy-MM-dd
  subject: string;
  duration: number; // minutes
  type: SessionType;
  notes?: string;
  timestamp: number;
};
type TimerMode = "Focus" | "Short Break" | "Long Break";
type TimerDurations = Record<TimerMode, number>;

const DEFAULT_DURATIONS: TimerDurations = {
  "Focus": 25 * 60,
  "Short Break": 5 * 60,
  "Long Break": 15 * 60,
};

const CHART_COLORS = [
  "hsl(345, 65%, 72%)", // primary
  "hsl(265, 55%, 78%)", // secondary
  "hsl(155, 45%, 70%)", // accent
  "hsl(45, 93%, 80%)", // chart-4
  "hsl(20, 80%, 85%)", // chart-5
];

export default function FocusView() {
  // === Local Storage Data ===
  const [studySessions, setStudySessions] = useLocalStorage<StudySession[]>("petal-study-sessions", []);
  const [subjects, setSubjects] = useLocalStorage<string[]>("petal-subjects", ["General Study", "Math", "Reading", "Coding"]);
  const [focusStreak, setFocusStreak] = useLocalStorage<number>("petal-focus-streak", 0);
  const [lastStudyDate, setLastStudyDate] = useLocalStorage<string>("petal-last-study-date", "");
  const [durations, setDurations] = useLocalStorage<TimerDurations>("petal-timer-durations", DEFAULT_DURATIONS);

  // === Pomodoro State ===
  const [mode, setMode] = useState<TimerMode>("Focus");
  const [timeLeft, setTimeLeft] = useState(durations["Focus"]);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const timerRef = useRef<number | null>(null);

  const { settings } = useSettings();

  // === Settings State ===
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editDurations, setEditDurations] = useState<TimerDurations>(durations);

  // === Logging Form State ===
  const [logSubject, setLogSubject] = useState(subjects[0] || "");
  const [logDuration, setLogDuration] = useState("25");
  const [logType, setLogType] = useState<SessionType>("Pomodoro");
  const [logNotes, setLogNotes] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // Sync time left when duration settings change if not active
  useEffect(() => {
    if (!isActive) setTimeLeft(durations[mode]);
  }, [durations, mode, isActive]);

  // === Sound ===
  const playChime = useCallback(() => {
    if (!settings.soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, []);

  // === Timer Logic ===
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft <= 0) {
      setIsActive(false);
      playChime();
      
      if (mode === "Focus") {
        const newCount = pomodoroCount + 1;
        setPomodoroCount(newCount);
        // Auto log session
        const today = format(new Date(), "yyyy-MM-dd");
        const newSession: StudySession = {
          id: Date.now().toString(),
          date: today,
          subject: logSubject || subjects[0] || "Focus",
          duration: Math.round(durations["Focus"] / 60),
          type: "Pomodoro",
          timestamp: Date.now()
        };
        setStudySessions(prev => [...prev, newSession]);
        updateStreak(today);
        toast.success("Focus session completed & logged! Take a break.");
        
        // Switch mode
        if (newCount % 4 === 0) {
          switchMode("Long Break");
        } else {
          switchMode("Short Break");
        }
      } else {
        toast.info("Break is over! Time to focus.");
        switchMode("Focus");
      }
      
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, pomodoroCount, playChime, logSubject, subjects, setStudySessions, durations]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsActive(false);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[mode]);
  };

  // === Settings Logic ===
  const handleSaveSettings = () => {
    setDurations(editDurations);
    setIsSettingsOpen(false);
    toast.success("Timer durations updated");
  };

  // === Logging Logic ===
  const updateStreak = useCallback((todayStr: string) => {
    if (lastStudyDate === todayStr) return; // already updated today
    
    const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");
    if (lastStudyDate === yesterdayStr) {
      setFocusStreak(prev => prev + 1);
    } else if (lastStudyDate !== todayStr) {
      setFocusStreak(1); // reset to 1 if missed a day
    }
    setLastStudyDate(todayStr);
  }, [lastStudyDate, setFocusStreak, setLastStudyDate]);

  const handleManualLog = () => {
    const dur = parseInt(logDuration);
    if (isNaN(dur) || dur <= 0) {
      toast.error("Please enter a valid duration");
      return;
    }
    if (!logSubject) {
      toast.error("Please select a subject");
      return;
    }

    const today = format(new Date(), "yyyy-MM-dd");
    const newSession: StudySession = {
      id: Date.now().toString(),
      date: today,
      subject: logSubject,
      duration: dur,
      type: logType,
      notes: logNotes,
      timestamp: Date.now()
    };

    setStudySessions(prev => [...prev, newSession]);
    updateStreak(today);
    setLogNotes("");
    toast.success("Session logged successfully!");
  };

  const handleAddSubject = () => {
    if (newSubjectName.trim() && !subjects.includes(newSubjectName.trim())) {
      const updated = [...subjects, newSubjectName.trim()];
      setSubjects(updated);
      setLogSubject(newSubjectName.trim());
      setNewSubjectName("");
      setIsAddSubjectOpen(false);
      toast.success("Subject added!");
    }
  };

  // === Analytics ===
  const todayStr = format(new Date(), "yyyy-MM-dd");
  
  const todaySessions = useMemo(() => {
    return studySessions
      .filter(s => s.date === todayStr)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [studySessions, todayStr]);

  const todayTotalMins = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  
  const last7DaysData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, "yyyy-MM-dd");
      const daySessions = studySessions.filter(s => s.date === dateStr);
      const totalHours = daySessions.reduce((sum, s) => sum + s.duration, 0) / 60;
      data.push({
        day: format(date, "EEE"), // Mon, Tue
        hours: Number(totalHours.toFixed(1))
      });
    }
    return data;
  }, [studySessions]);

  const subjectDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    studySessions.forEach(s => {
      dist[s.subject] = (dist[s.subject] || 0) + s.duration;
    });
    return Object.entries(dist)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5
  }, [studySessions]);

  const prodScore = useMemo(() => {
    // Simple mock heuristic: hours today * 10, capped at 100, plus streak bonus
    const score = Math.min(100, Math.floor((todayTotalMins / 60) * 15) + (focusStreak * 2));
    return score;
  }, [todayTotalMins, focusStreak]);

  // === Formatting ===
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPct = 100 - (timeLeft / durations[mode]) * 100;
  const strokeDasharray = 2 * Math.PI * 120; // r=120
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progressPct) / 100;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Focus Mode</h2>
            <p className="text-muted-foreground text-sm">Flow into deep work and track your study sessions.</p>
          </div>
        </div>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full border-border/50 text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Timer Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Focus</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={Math.round(editDurations["Focus"] / 60)} 
                    onChange={e => setEditDurations(p => ({ ...p, "Focus": Number(e.target.value) * 60 }))}
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Short Break</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={Math.round(editDurations["Short Break"] / 60)} 
                    onChange={e => setEditDurations(p => ({ ...p, "Short Break": Number(e.target.value) * 60 }))}
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Long Break</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={Math.round(editDurations["Long Break"] / 60)} 
                    onChange={e => setEditDurations(p => ({ ...p, "Long Break": Number(e.target.value) * 60 }))}
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pomodoro & Logging */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pomodoro Timer */}
          <Card className="bg-card shadow-sm border-border/50">
            <CardContent className="pt-6 flex flex-col items-center">
              {/* Mode Selector */}
              <div className="flex p-1 bg-muted rounded-full mb-8">
                {(["Focus", "Short Break", "Long Break"] as TimerMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                      mode === m 
                        ? "bg-white shadow-xs text-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Timer Ring */}
              <div className="relative w-72 h-72 flex items-center justify-center mb-8">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 260 260">
                  <circle
                    cx="130" cy="130" r="120"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="130" cy="130" r="120"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: "linear" }}
                  />
                </svg>
                <div className="text-center">
                  <motion.div 
                    key={timeLeft}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl font-bold text-foreground tabular-nums tracking-tighter"
                  >
                    {formatTime(timeLeft)}
                  </motion.div>
                  <p className="text-muted-foreground text-sm mt-2 font-medium">
                    {mode === "Focus" ? `Session ${pomodoroCount + 1}` : "Take a breather"}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <Button 
                  onClick={toggleTimer}
                  size="lg"
                  className={`w-32 rounded-full font-bold shadow-sm transition-all duration-300 ${
                    isActive 
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                  {isActive ? "Pause" : "Start"}
                </Button>
                <Button 
                  onClick={resetTimer}
                  variant="outline" 
                  size="icon"
                  className="w-12 h-12 rounded-full border-border/50 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manual Logger */}
          <Card className="bg-card shadow-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Log a Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <div className="flex gap-2">
                    <Select value={logSubject} onValueChange={setLogSubject}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    
                    <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New Subject</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <Label htmlFor="subjectName">Subject Name</Label>
                          <Input 
                            id="subjectName" 
                            value={newSubjectName} 
                            onChange={e => setNewSubjectName(e.target.value)}
                            placeholder="e.g. History 101"
                            className="mt-2"
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddSubject}>Add Subject</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input 
                    type="number" 
                    value={logDuration} 
                    onChange={(e) => setLogDuration(e.target.value)} 
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <Label>Session Type</Label>
                <Select value={logType} onValueChange={(v) => setLogType(v as SessionType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pomodoro">Pomodoro (Structured)</SelectItem>
                    <SelectItem value="Deep Work">Deep Work (Uninterrupted)</SelectItem>
                    <SelectItem value="Review">Review (Light Study)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 mb-4">
                <Label>Notes (optional)</Label>
                <Textarea 
                  placeholder="What did you accomplish?"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="resize-none h-20"
                />
              </div>

              <Button onClick={handleManualLog} className="w-full font-bold">
                Log Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Analytics & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border-none shadow-sm bg-gradient-to-br from-primary/10 to-transparent">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Flame className="w-6 h-6 text-primary mb-2" />
                <div className="text-2xl font-bold text-foreground">{focusStreak}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Day Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-none shadow-sm bg-gradient-to-br from-secondary/20 to-transparent">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Trophy className="w-6 h-6 text-secondary mb-2" />
                <div className="text-2xl font-bold text-foreground">{prodScore}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Prod Score</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
                <span>Today's Sessions</span>
                <span className="text-primary font-bold">{Math.floor(todayTotalMins / 60)}h {todayTotalMins % 60}m</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaySessions.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground text-sm flex flex-col items-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 opacity-50" />
                  </div>
                  No sessions logged today yet.
                </div>
              ) : (
                <div className="space-y-3 mt-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence>
                    {todaySessions.map(session => (
                      <motion.div 
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl border border-border/40 bg-muted/30 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-bold text-sm text-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            {session.subject}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {session.type} • {session.notes ? session.notes.substring(0,20)+'...' : 'No notes'}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                          {session.duration}m
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">Study Hours (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                    <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">Time by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              {subjectDistribution.length > 0 ? (
                <div className="h-[180px] w-full mt-2 flex">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} formatter={(val: number) => [`${val} mins`, 'Duration']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col justify-center gap-2 pl-2 w-1/2">
                    {subjectDistribution.map((entry, i) => (
                      <div key={entry.name} className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span className="truncate text-muted-foreground">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
                  Not enough data to display
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
