import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, FileText, Zap, PieChart, LineChart, Wallet, Timer, Target, Phone, Flame, CloudSun } from "lucide-react";

export function TodayTasksOverview() {
  return (
    <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
          <PieChart className="w-5 h-5" /> Today's Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-primary/5 rounded-xl border border-dashed border-primary/20">
          <span className="text-sm font-medium">Task completion chart will appear here.</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductivityAnalytics() {
  return (
    <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-secondary">
          <LineChart className="w-5 h-5" /> Productivity Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-secondary/5 rounded-xl border border-dashed border-secondary/20">
          <span className="text-sm font-medium">Performance graphs will appear here.</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinanceSnapshot() {
  return (
    <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-green-600">
          <Wallet className="w-5 h-5" /> Finance Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-green-500/5 rounded-xl border border-dashed border-green-500/20">
          <span className="text-sm font-medium">Expenses and savings summary.</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function WellnessOverview() {
  return (
    <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-rose-500">
          <Activity className="w-5 h-5" /> Wellness Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-rose-500/5 rounded-xl border border-dashed border-rose-500/20">
          <span className="text-sm font-medium">Hydration, Sleep, Steps.</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function FocusTimerWidget() {
  return (
    <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-purple-500">
          <Timer className="w-5 h-5" /> Focus Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-purple-500/5 rounded-xl border border-dashed border-purple-500/20">
          <span className="text-sm font-medium">Mini focus timer.</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function UpcomingEvents() {
  return (
    <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-blue-500">
          <Clock className="w-5 h-5" /> Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-blue-500/5 rounded-xl border border-dashed border-blue-500/20">
          <span className="text-sm font-medium">Calendar events summary.</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function GoalsProgress() {
  return (
    <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-orange-500">
          <Target className="w-5 h-5" /> Goals Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-orange-500/5 rounded-xl border border-dashed border-orange-500/20">
          <span className="text-sm font-medium">Goal tracking overview.</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContactedHome() {
  return (
    <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-pink-500">
          <Phone className="w-5 h-5" /> Contacted Home
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-24 text-muted-foreground bg-pink-500/5 rounded-xl border border-dashed border-pink-500/20">
          <span className="text-sm font-medium">Yes/No check-in.</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function StreaksConsistency() {
  return (
    <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-500">
          <Flame className="w-5 h-5" /> Streaks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-24 text-muted-foreground bg-red-500/5 rounded-xl border border-dashed border-red-500/20">
          <span className="text-sm font-medium">Consistency streaks.</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherSummary() {
  return (
    <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-cyan-500">
          <CloudSun className="w-5 h-5" /> Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-24 text-muted-foreground bg-cyan-500/5 rounded-xl border border-dashed border-cyan-500/20">
          <span className="text-sm font-medium">Daily forecast.</span>
        </div>
      </CardContent>
    </Card>
  );
}
