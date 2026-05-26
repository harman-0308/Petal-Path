import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

type EnergyLog = { energy: number; motivation: number; stress: number; social: number };

export default function EnergyTracker() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [logs, setLogs] = useLocalStorage<Record<string, EnergyLog>>("petal-energy", {});
  
  const currentLog = logs[today] || { energy: 5, motivation: 5, stress: 5, social: 5 };

  const updateMetric = (metric: keyof EnergyLog, value: number) => {
    setLogs({ ...logs, [today]: { ...currentLog, [metric]: value } });
  };

  const metrics = [
    { key: "energy", label: "Energy ⚡", color: "bg-yellow-400" },
    { key: "motivation", label: "Motivation 🌟", color: "bg-pink-400" },
    { key: "stress", label: "Stress 🌊", color: "bg-purple-400" },
    { key: "social", label: "Social Battery 🔋", color: "bg-green-400" }
  ] as const;

  return (
    <Card className="bg-card hover-elevate">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary font-bold">Energy & Wellness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {metrics.map((m) => (
          <div key={m.key} className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span>{m.label}</span>
              <span className="text-muted-foreground">{currentLog[m.key]}/10</span>
            </div>
            <Slider 
              value={[currentLog[m.key]]} 
              onValueChange={v => updateMetric(m.key, v[0])} 
              max={10} 
              min={0} 
              step={1} 
              className={`[&_[role=slider]]:${m.color} [&_.bg-primary]:${m.color}`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
