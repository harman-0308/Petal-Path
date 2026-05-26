import { useState, FormEvent } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

export default function MonthlyView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habitLogs] = useLocalStorage<Record<string, string[]>>("petal-habit-logs", {});
  const [goals, setGoals] = useLocalStorage<any[]>("petal-goals", []);
  
  const [newGoal, setNewGoal] = useState("");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Pad beginning of month
  const startingDayOfWeek = monthStart.getDay(); // 0 is Sunday
  const paddingDays = Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map(() => null);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const addGoal = (e: FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    setGoals([...goals, { id: Date.now().toString(), text: newGoal, progress: 0 }]);
    setNewGoal("");
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress } : g));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar */}
        <Card className="bg-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl text-primary font-bold">
              {format(currentDate, "MMMM yyyy")}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-full border-primary/20">
                <ChevronLeft className="h-4 w-4 text-primary" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-full border-primary/20">
                <ChevronRight className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-xs font-bold text-muted-foreground uppercase">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 lg:gap-2">
              {paddingDays.map((_, i) => (
                <div key={`pad-${i}`} className="h-16 lg:h-24 rounded-xl bg-transparent"></div>
              ))}
              {daysInMonth.map(day => {
                const dateStr = format(day, "yyyy-MM-dd");
                const logsCount = (habitLogs[dateStr] || []).length;
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={day.toISOString()} 
                    className={`h-16 lg:h-24 rounded-xl border border-border/40 p-1 flex flex-col items-center hover:bg-muted/30 transition-colors ${
                      isToday ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20' : 'bg-card'
                    }`}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground/80'}`}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-auto flex flex-wrap gap-1 justify-center p-1">
                      {logsCount > 0 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" title={`${logsCount} habits`} />
                      )}
                      {logsCount > 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-primary font-bold flex items-center gap-2">
              <Target className="h-5 w-5" /> Monthly Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={addGoal} className="flex gap-2">
              <Input 
                value={newGoal} 
                onChange={e => setNewGoal(e.target.value)} 
                placeholder="New goal..." 
                className="text-sm"
              />
              <Button type="submit" className="bg-primary text-white">Add</Button>
            </form>

            <div className="space-y-4">
              {goals.map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{goal.text}</span>
                    <span className="text-muted-foreground">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex gap-1 justify-end">
                    {[0, 25, 50, 75, 100].map(val => (
                      <button 
                        key={val}
                        onClick={() => updateGoalProgress(goal.id, val)}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${goal.progress === val ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {goals.length === 0 && (
                <p className="text-center text-sm text-muted-foreground italic py-4">What do you want to achieve this month?</p>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}