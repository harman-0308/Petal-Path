import { useState } from "react";
import { format, differenceInMinutes, parse } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Star } from "lucide-react";

type SleepLog = { sleepTime: string, wakeTime: string, quality: number, duration: string };

export default function SleepTracker() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [logs, setLogs] = useLocalStorage<Record<string, SleepLog>>("petal-sleep", {});
  const currentLog = logs[today];

  const [sleepTime, setSleepTime] = useState(currentLog?.sleepTime || "22:00");
  const [wakeTime, setWakeTime] = useState(currentLog?.wakeTime || "07:00");
  const [quality, setQuality] = useState(currentLog?.quality || 3);

  const calculateDuration = (sleep: string, wake: string) => {
    try {
      const sleepDate = parse(sleep, 'HH:mm', new Date());
      let wakeDate = parse(wake, 'HH:mm', new Date());
      
      if (wakeDate < sleepDate) {
        wakeDate = new Date(wakeDate.getTime() + 24 * 60 * 60 * 1000); // add 1 day
      }
      
      const diff = differenceInMinutes(wakeDate, sleepDate);
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    } catch {
      return "0h";
    }
  };

  const handleSave = () => {
    const duration = calculateDuration(sleepTime, wakeTime);
    setLogs({ ...logs, [today]: { sleepTime, wakeTime, quality, duration } });
  };

  return (
    <Card className="bg-card hover-elevate">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary font-bold flex items-center gap-2">
          <Moon className="h-5 w-5" /> Sleep
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentLog ? (
          <div className="bg-muted/30 p-4 rounded-xl text-center space-y-2">
            <div className="text-2xl font-bold text-secondary-foreground">{currentLog.duration}</div>
            <div className="flex justify-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < currentLog.quality ? "fill-primary" : "text-muted opacity-50"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {currentLog.sleepTime} - {currentLog.wakeTime}
            </p>
            <Button variant="ghost" size="sm" onClick={() => setLogs({ ...logs, [today]: undefined as any })} className="text-xs h-6 mt-2">
              Edit
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <Label className="text-xs flex items-center gap-1"><Moon className="h-3 w-3"/> Bedtime</Label>
                <Input type="time" value={sleepTime} onChange={e => setSleepTime(e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-xs flex items-center gap-1"><Sun className="h-3 w-3"/> Wake</Label>
                <Input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="h-8 text-sm" />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs">Quality</Label>
              <div className="flex justify-between">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setQuality(i + 1)}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full p-1"
                  >
                    <Star className={`h-5 w-5 transition-all ${i < quality ? "fill-primary text-primary" : "text-muted-foreground opacity-30"}`} />
                  </button>
                ))}
              </div>
            </div>
            
            <Button onClick={handleSave} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Log Sleep
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}