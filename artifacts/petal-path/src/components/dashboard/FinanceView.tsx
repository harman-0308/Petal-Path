import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSettings } from "@/hooks/use-settings";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Wallet, Target, TrendingDown, PiggyBank, Plus, X, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Expense = { id: string; amount: number; category: string; note: string; date: string; };
type Goal = { id: string; name: string; target: number; current: number; deadline?: string; };
type Note = { id: string; content: string; color: string; };

const CATEGORIES = [
  { id: "Food", emoji: "🍔", color: "#f9a8d4" },
  { id: "Shopping", emoji: "🛍", color: "#c4b5fd" },
  { id: "Transport", emoji: "🚌", color: "#86efac" },
  { id: "Subscriptions", emoji: "📱", color: "#fde68a" },
  { id: "Study", emoji: "📚", color: "#93c5fd" },
  { id: "Entertainment", emoji: "🎬", color: "#fdba74" },
  { id: "Savings", emoji: "💰", color: "#a5f3fc" },
  { id: "Miscellaneous", emoji: "✨", color: "#d8b4fe" },
];

const NOTE_COLORS = ["bg-primary/10", "bg-secondary/10", "bg-accent/10", "bg-muted"];

export default function FinanceView() {
  const { settings } = useSettings();
  const weekStartsOn = settings.weekStart === "monday" ? 1 : 0;
  const [balance, setBalance] = useLocalStorage<number>("petal-finance-balance", 0);
  const [savingsTarget, setSavingsTarget] = useLocalStorage<number>("petal-finance-savings-target", 0);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("petal-finance-expenses", []);
  const [goals, setGoals] = useLocalStorage<Goal[]>("petal-finance-goals", []);
  const [notes, setNotes] = useLocalStorage<Note[]>("petal-finance-notes", []);

  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  // Expense Form State
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Food");
  const [expenseNote, setExpenseNote] = useState("");
  const [expenseDate, setExpenseDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [expenseFilter, setExpenseFilter] = useState("All");

  // Goal Form State
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");

  const now = new Date();
  
  // Computations
  const currentMonthExpenses = useMemo(() => {
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return expenses.filter(e => {
      const d = parseISO(e.date);
      return isWithinInterval(d, { start, end });
    });
  }, [expenses, now]);

  const totalSpentThisMonth = useMemo(() => {
    return currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthExpenses]);

  const remainingBalance = balance - totalSpentThisMonth;

  const currentWeekExpenses = useMemo(() => {
    const start = startOfWeek(now, { weekStartsOn });
    const end = endOfWeek(now, { weekStartsOn });
    return expenses.filter(e => {
      const d = parseISO(e.date);
      return isWithinInterval(d, { start, end });
    });
  }, [expenses, now]);

  const totalSpentThisWeek = useMemo(() => {
    return currentWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [currentWeekExpenses]);

  const pieChartData = useMemo(() => {
    const grouped = currentMonthExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [currentMonthExpenses]);

  const barChartData = useMemo(() => {
    const start = startOfWeek(now, { weekStartsOn });
    const end = endOfWeek(now, { weekStartsOn });
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const spent = currentWeekExpenses
        .filter(e => isSameDay(parseISO(e.date), day))
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        day: format(day, "EEE"),
        spent
      };
    });
  }, [currentWeekExpenses, now]);

  // Handlers
  const handleAddExpense = () => {
    if (!expenseAmount || isNaN(Number(expenseAmount))) return;
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: Number(expenseAmount),
      category: expenseCategory,
      note: expenseNote,
      date: expenseDate || format(new Date(), "yyyy-MM-dd")
    };
    setExpenses([...expenses, newExpense]);
    setExpenseAmount("");
    setExpenseNote("");
  };

  const handleAddGoal = () => {
    if (!goalName || !goalTarget || isNaN(Number(goalTarget))) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalName,
      target: Number(goalTarget),
      current: Number(goalCurrent) || 0,
      deadline: goalDeadline || undefined
    };
    setGoals([...goals, newGoal]);
    setGoalName("");
    setGoalTarget("");
    setGoalCurrent("");
    setGoalDeadline("");
  };

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: "",
      color: NOTE_COLORS[notes.length % NOTE_COLORS.length]
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, content } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredExpenses = expenses
    .filter(e => expenseFilter === "All" || e.category === expenseFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* SECTION 1: Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col justify-center items-center text-center space-y-2">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Wallet className="w-6 h-6" />
            </div>
            {isEditingBalance ? (
              <Input
                type="number"
                value={balance}
                onChange={e => setBalance(Number(e.target.value) || 0)}
                onBlur={() => setIsEditingBalance(false)}
                autoFocus
                className="text-center font-bold text-2xl h-10 w-32 mx-auto"
              />
            ) : (
              <h2 
                className="text-3xl font-extrabold cursor-pointer hover:text-primary transition-colors blur-sensitive"
                onClick={() => setIsEditingBalance(true)}
              >
                £{balance.toFixed(2)}
              </h2>
            )}
            <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col justify-center items-center text-center space-y-2">
            <div className="p-3 rounded-full bg-destructive/10 text-destructive">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground blur-sensitive">
              £{totalSpentThisMonth.toFixed(2)}
            </h2>
            <p className="text-sm font-medium text-muted-foreground">Spent This Month</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col justify-center items-center text-center space-y-2">
            <div className={`p-3 rounded-full ${remainingBalance >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
              <PiggyBank className="w-6 h-6" />
            </div>
            <h2 className={`text-3xl font-extrabold blur-sensitive ${remainingBalance >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              £{remainingBalance.toFixed(2)}
            </h2>
            <p className="text-sm font-medium text-muted-foreground">Remaining Balance</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col justify-center items-center text-center space-y-2">
            <div className="p-3 rounded-full bg-secondary/20 text-secondary-foreground">
              <Target className="w-6 h-6" />
            </div>
            {isEditingTarget ? (
              <Input
                type="number"
                value={savingsTarget}
                onChange={e => setSavingsTarget(Number(e.target.value) || 0)}
                onBlur={() => setIsEditingTarget(false)}
                autoFocus
                className="text-center font-bold text-2xl h-10 w-32 mx-auto"
              />
            ) : (
              <h2 
                className="text-3xl font-extrabold cursor-pointer hover:text-secondary-foreground transition-colors blur-sensitive"
                onClick={() => setIsEditingTarget(true)}
              >
                £{savingsTarget.toFixed(2)}
              </h2>
            )}
            <p className="text-sm font-medium text-muted-foreground">Monthly Savings Target</p>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 2 & 3: Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Expenses */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                <span>💸</span> Track Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="space-y-1.5">
                  <Label>Amount (£)</Label>
                  <Input type="number" placeholder="0.00" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={expenseCategory} 
                    onChange={e => setExpenseCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.id}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Note</Label>
                  <Input placeholder="What was it for?" value={expenseNote} onChange={e => setExpenseNote(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleAddExpense} className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Expense
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-lg font-bold">Recent Expenses</CardTitle>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  <button
                    onClick={() => setExpenseFilter("All")}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${expenseFilter === "All" ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                  >
                    All
                  </button>
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setExpenseFilter(c.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${expenseFilter === c.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                    >
                      <span>{c.emoji}</span> {c.id}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border/50">
                  No expenses yet. Start tracking your spending!
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {filteredExpenses.map(expense => {
                      const category = CATEGORIES.find(c => c.id === expense.category);
                      return (
                        <motion.div
                          key={expense.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/40 hover:bg-muted/30 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-muted">
                              {category?.emoji || "✨"}
                            </div>
                            <div>
                              <p className="font-bold text-sm leading-tight">{expense.note || expense.category}</p>
                              <p className="text-xs text-muted-foreground">{format(parseISO(expense.date), "MMM d, yyyy")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-foreground">£{expense.amount.toFixed(2)}</span>
                            <button 
                              onClick={() => setExpenses(expenses.filter(e => e.id !== expense.id))}
                              className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Monthly Spending Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {pieChartData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No data to show for this month.
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => {
                          const catColor = CATEGORIES.find(c => c.id === entry.name)?.color || "#ccc";
                          return <Cell key={`cell-${index}`} fill={catColor} />;
                        })}
                      </Pie>
                      <Tooltip formatter={(value: number) => `£${value.toFixed(2)}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Goals, Weekly, Notes */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Weekly Summary */}
          <Card className="rounded-2xl border-border/40 shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Spent</p>
                  <p className="text-2xl font-extrabold text-foreground">£{totalSpentThisWeek.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Saved</p>
                  <p className="text-xl font-bold text-green-600">
                    £{Math.max(0, (savingsTarget / 4) - totalSpentThisWeek).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="h-[120px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip cursor={{ fill: 'transparent' }} formatter={(val: number) => `£${val.toFixed(2)}`} />
                    <Bar dataKey="spent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Savings Goals */}
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center justify-between">
                <span>Savings Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 p-3 bg-muted/30 rounded-xl border border-border/50">
                <Input placeholder="Goal name" value={goalName} onChange={e => setGoalName(e.target.value)} className="h-8 text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Target £" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} className="h-8 text-sm" />
                  <Input type="number" placeholder="Current £" value={goalCurrent} onChange={e => setGoalCurrent(e.target.value)} className="h-8 text-sm" />
                </div>
                <Button onClick={handleAddGoal} size="sm" className="w-full h-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-lg">
                  Add Goal
                </Button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {goals.map(goal => {
                    const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                    return (
                      <motion.div 
                        key={goal.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="font-bold text-sm">{goal.name}</p>
                            <p className="text-xs text-muted-foreground">£{goal.current} / £{goal.target}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-secondary-foreground bg-secondary/20 px-2 py-0.5 rounded-full">{percent}%</span>
                            <button onClick={() => setGoals(goals.filter(g => g.id !== goal.id))} className="text-muted-foreground hover:text-destructive">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <Progress value={percent} className="h-2 bg-muted" indicatorClassName="bg-secondary" />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Financial Notes */}
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Financial Notes</CardTitle>
              <Button onClick={addNote} size="icon" variant="ghost" className="h-6 w-6">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence>
                {notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No notes. Add a reminder!</p>
                ) : (
                  notes.map(note => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`${note.color} p-3 rounded-xl relative group transition-shadow hover:shadow-sm`}
                    >
                      <Textarea
                        value={note.content}
                        onChange={e => updateNote(note.id, e.target.value)}
                        placeholder="Write a note..."
                        className="border-0 bg-transparent shadow-none px-1 py-1 focus-visible:ring-0 resize-none min-h-[60px] text-sm text-foreground/90 font-medium"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNote(note.id)}
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/50 hover:text-destructive hover:bg-white/50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
