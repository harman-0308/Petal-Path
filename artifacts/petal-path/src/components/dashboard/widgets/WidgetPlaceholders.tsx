import { CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, PieChart, LineChart, Wallet, Timer, Target, Phone, Flame, CloudSun } from "lucide-react";

function PlaceholderShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      {children}
    </div>
  );
}

export function TodayTasksOverview() {
  return (
    <PlaceholderShell>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
          <PieChart className="w-5 h-5" /> Today's Overview
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-4 flex-1">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-primary/5 dark:bg-primary/10 rounded-xl border border-dashed border-primary/20">
          <span className="text-sm font-medium">Task completion chart will appear here.</span>
        </div>
      </div>
    </PlaceholderShell>
  );
}

export function ProductivityAnalytics() {
  return (
    <PlaceholderShell>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-secondary">
          <LineChart className="w-5 h-5" /> Productivity Analytics
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-4 flex-1">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-secondary/5 dark:bg-secondary/10 rounded-xl border border-dashed border-secondary/20">
          <span className="text-sm font-medium">Performance graphs will appear here.</span>
        </div>
      </div>
    </PlaceholderShell>
  );
}

export function FinanceSnapshot() {
  return (
    <PlaceholderShell>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-green-600 dark:text-green-400">
          <Wallet className="w-5 h-5" /> Finance Snapshot
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-4 flex-1">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-green-500/5 dark:bg-green-500/10 rounded-xl border border-dashed border-green-500/20">
          <span className="text-sm font-medium">Expenses and savings summary.</span>
        </div>
      </div>
    </PlaceholderShell>
  );
}

export function WellnessOverview() {
  return (
    <PlaceholderShell>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-rose-500">
          <Activity className="w-5 h-5" /> Wellness Overview
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-4 flex-1">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-rose-500/5 dark:bg-rose-500/10 rounded-xl border border-dashed border-rose-500/20">
          <span className="text-sm font-medium">Hydration, Sleep, Steps.</span>
        </div>
      </div>
    </PlaceholderShell>
  );
}

export function FocusTimerWidget() {
  return (
    <PlaceholderShell>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-purple-500">
          <Timer className="w-5 h-5" /> Focus Timer
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-4 flex-1">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-purple-500/5 dark:bg-purple-500/10 rounded-xl border border-dashed border-purple-500/20">
          <span className="text-sm font-medium">Mini focus timer.</span>
        </div>
      </div>
    </PlaceholderShell>
  );
}

export function UpcomingEvents() {
  return (
    <PlaceholderShell>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-blue-500">
          <Clock className="w-5 h-5" /> Upcoming Events
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-4 flex-1">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-dashed border-blue-500/20">
          <span className="text-sm font-medium">Calendar events summary.</span>
        </div>
      </div>
    </PlaceholderShell>
  );
}

export function GoalsProgress() {
  return (
    <PlaceholderShell>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-orange-500">
          <Target className="w-5 h-5" /> Goals Progress
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-4 flex-1">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-orange-500/5 dark:bg-orange-500/10 rounded-xl border border-dashed border-orange-500/20">
          <span className="text-sm font-medium">Goal tracking overview.</span>
        </div>
      </div>
    </PlaceholderShell>
  );
}

export function ContactedHome() {
  return (
    <PlaceholderShell>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-pink-500">
          <Phone className="w-5 h-5" /> Contacted Home
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-4 flex-1">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-pink-500/5 dark:bg-pink-500/10 rounded-xl border border-dashed border-pink-500/20">
          <span className="text-sm font-medium">Yes/No check-in.</span>
        </div>
      </div>
    </PlaceholderShell>
  );
}

export function StreaksConsistency() {
  return (
    <PlaceholderShell>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-500">
          <Flame className="w-5 h-5" /> Streaks
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-4 flex-1">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-red-500/5 dark:bg-red-500/10 rounded-xl border border-dashed border-red-500/20">
          <span className="text-sm font-medium">Consistency streaks.</span>
        </div>
      </div>
    </PlaceholderShell>
  );
}

export function WeatherSummary() {
  return (
    <PlaceholderShell>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-cyan-500">
          <CloudSun className="w-5 h-5" /> Weather
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-4 flex-1">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-cyan-500/5 dark:bg-cyan-500/10 rounded-xl border border-dashed border-cyan-500/20">
          <span className="text-sm font-medium">Daily forecast.</span>
        </div>
      </div>
    </PlaceholderShell>
  );
}
