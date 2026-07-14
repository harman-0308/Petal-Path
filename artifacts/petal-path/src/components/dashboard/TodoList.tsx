import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { WidgetSize } from "./widgets/registry";
import { Link } from "wouter";

type Priority = "Low" | "Medium" | "High";
type Task = { id: string, text: string, done: boolean, priority: Priority };

interface TodoListProps {
  size?: WidgetSize;
}

export default function TodoList({ size = "medium" }: TodoListProps) {
  const [tasks, setTasks] = useLocalStorage<Task[]>("petal-todos", []);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [filter, setFilter] = useState<"All" | "Active" | "Done">("All");

  const addTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, done: false, priority }]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "Active") return !t.done;
    if (filter === "Done") return t.done;
    return true;
  });

  const getPriorityColor = (p: Priority) => {
    if (p === "High") return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    if (p === "Medium") return "bg-accent text-accent-foreground hover:bg-accent/90";
    return "bg-secondary text-secondary-foreground hover:bg-secondary/90";
  };

  if (size === "small") {
    const activeTasks = tasks.filter(t => !t.done).slice(0, 3);
    const remaining = tasks.filter(t => !t.done).length - activeTasks.length;

    return (
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary">To-Do List</h3>
        </div>
        <div className="space-y-2">
          {activeTasks.length > 0 ? (
            activeTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                <Checkbox 
                  checked={task.done} 
                  onCheckedChange={() => toggleTask(task.id)}
                  className="rounded-full border-primary data-[state=checked]:bg-primary flex-shrink-0"
                />
                <span className="text-sm truncate text-foreground">
                  {task.text}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">All caught up!</p>
          )}
          
          {remaining > 0 && (
            <div className="text-xs text-muted-foreground flex items-center justify-end">
              + {remaining} more active
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-primary font-bold">To-Do List</h3>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs border-primary/20 text-muted-foreground cursor-pointer" onClick={() => setFilter("All")}>All</Badge>
          <Badge variant="outline" className="text-xs border-primary/20 text-muted-foreground cursor-pointer" onClick={() => setFilter("Active")}>Active</Badge>
          <Badge variant="outline" className="text-xs border-primary/20 text-muted-foreground cursor-pointer" onClick={() => setFilter("Done")}>Done</Badge>
        </div>
      </div>
      
      <form onSubmit={addTask} className="flex gap-2">
        <Input 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Add a task..."
          className="flex-1 border-border/50 focus-visible:ring-primary/30"
          data-testid="input-new-task"
        />
        <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
          <SelectTrigger className="w-[110px] border-border/50 focus:ring-primary/30" data-testid="select-priority">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full" data-testid="button-add-task">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-2">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-xl group hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Checkbox 
                  checked={task.done} 
                  onCheckedChange={() => toggleTask(task.id)}
                  className="rounded-full border-primary data-[state=checked]:bg-primary flex-shrink-0"
                  data-testid={`checkbox-task-${task.id}`}
                />
                <span className={`text-sm truncate transition-all duration-300 ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.text}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge className={`text-[10px] py-0 px-2 font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  onClick={() => deleteTask(task.id)}
                  data-testid={`button-delete-task-${task.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No tasks here yet. You're all caught up! ✿
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}