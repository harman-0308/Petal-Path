import { useState } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

const DEFAULT_TASKS = ["Skincare", "Take vitamins", "Stretch", "Meditate", "Drink water", "Get sunlight"];

export default function SelfCareChecklist() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [tasks, setTasks] = useLocalStorage<string[]>("petal-selfcare-tasks", DEFAULT_TASKS);
  const [logs, setLogs] = useLocalStorage<Record<string, string[]>>("petal-selfcare-logs", {});
  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const currentLog = logs[today] || [];

  const toggleTask = (task: string) => {
    const isDone = currentLog.includes(task);
    const newLog = isDone ? currentLog.filter(t => t !== task) : [...currentLog, task];
    setLogs({ ...logs, [today]: newLog });
  };

  const addTask = () => {
    if (newTask.trim() && !tasks.includes(newTask.trim())) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
      setIsAdding(false);
    }
  };

  const removeTask = (task: string) => {
    setTasks(tasks.filter(t => t !== task));
  };

  return (
    <Card className="bg-card hover-elevate">
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle className="text-lg text-primary font-bold">Self-Care</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsAdding(!isAdding)} className="h-6 w-6">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {isAdding && (
          <div className="flex gap-2 mb-3">
            <Input 
              value={newTask} 
              onChange={e => setNewTask(e.target.value)} 
              placeholder="Add self-care task..."
              className="h-8 text-sm"
              onKeyDown={e => e.key === 'Enter' && addTask()}
            />
            <Button size="sm" onClick={addTask} className="h-8 px-3">Add</Button>
          </div>
        )}
        
        <div className="space-y-2">
          {tasks.map(task => {
            const isDone = currentLog.includes(task);
            return (
              <div key={task} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={`sc-${task}`} 
                    checked={isDone} 
                    onCheckedChange={() => toggleTask(task)}
                    className="rounded border-primary/50 data-[state=checked]:bg-primary"
                  />
                  <label 
                    htmlFor={`sc-${task}`} 
                    className={`text-sm cursor-pointer transition-colors ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {task}
                  </label>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeTask(task)} 
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
