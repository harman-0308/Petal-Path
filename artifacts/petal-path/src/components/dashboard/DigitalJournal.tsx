import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, subDays } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, PenLine, Sparkles, Heart, Flame } from "lucide-react";

// Types
type JournalEntry = {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  tone: string;
};

type Highlight = {
  prompt: string;
  answer: string;
  color: string;
};

type GratitudeItem = {
  id: string;
  text: string;
};

// Data models
const HIGHLIGHT_PROMPTS = [
  { prompt: "Today's intention", color: "bg-primary/20" },
  { prompt: "Biggest win today", color: "bg-secondary/20" },
  { prompt: "What made me happy", color: "bg-accent/20" },
  { prompt: "Main focus today", color: "bg-chart-4/30" },
  { prompt: "Highlight of the day", color: "bg-chart-5/30" },
];

const TONE_TAGS = ["peaceful", "anxious", "joyful", "sad", "grateful", "excited", "neutral"];
const MOOD_EMOJIS = ["😊", "🌸", "😌", "😴", "💖", "😭", "😡", "☁️", "✨"];
const GRATITUDE_PROMPTS = [
  "Something that made you smile",
  "A person you appreciate",
  "Something you take for granted",
  "A challenge that taught you",
  "A small joy today"
];

const WEEKLY_PROMPTS = ["Weekly Wins", "Lessons Learned", "Next Week's Goals", "Emotional Check-In", "Something to let go of"];
const MONTHLY_PROMPTS = ["Biggest Achievement", "What I want more of", "What I want less of", "Word of the month", "Declutter checklist"];

import { WidgetSize } from "./widgets/registry";

interface DigitalJournalProps {
  size?: WidgetSize;
}

export default function DigitalJournal({ size = "large" }: DigitalJournalProps) {
  const today = format(new Date(), "yyyy-MM-dd");

  // Journal State
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>("petal-journal-entries", []);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  // Auto-create today's entry if none exists
  useEffect(() => {
    if (!entries.find(e => e.date === today)) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: today,
        title: "",
        content: "",
        mood: "🌸",
        tone: "neutral"
      };
      setEntries([newEntry, ...entries]);
      setCurrentEntryId(newEntry.id);
    } else if (!currentEntryId) {
      setCurrentEntryId(entries.find(e => e.date === today)?.id || null);
    }
  }, [entries, today, setEntries, currentEntryId]);

  const currentEntry = entries.find(e => e.id === currentEntryId) || null;

  // Auto-save logic with debounce
  const [localEntryData, setLocalEntryData] = useState<{ title: string, content: string }>({ title: "", content: "" });
  const entryIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (currentEntry && currentEntry.id !== entryIdRef.current) {
      setLocalEntryData({ title: currentEntry.title, content: currentEntry.content });
      entryIdRef.current = currentEntry.id;
    }
  }, [currentEntry]);

  useEffect(() => {
    if (!currentEntry) return;
    const timer = setTimeout(() => {
      if (localEntryData.title !== currentEntry.title || localEntryData.content !== currentEntry.content) {
        setEntries(prev => prev.map(e => e.id === currentEntry.id ? { ...e, title: localEntryData.title, content: localEntryData.content } : e));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [localEntryData, currentEntry, setEntries]);

  const updateEntryMeta = (updates: Partial<JournalEntry>) => {
    if (!currentEntry) return;
    setEntries(entries.map(e => e.id === currentEntry.id ? { ...e, ...updates } : e));
  };

  // Highlights State
  const [highlights, setHighlights] = useLocalStorage<Record<string, Highlight[]>>("petal-highlights", {});
  const todayHighlights = highlights[today] || HIGHLIGHT_PROMPTS.map(p => ({ ...p, answer: "" }));

  const updateHighlight = (index: number, answer: string) => {
    const newHighlights = [...todayHighlights];
    newHighlights[index].answer = answer;
    setHighlights({ ...highlights, [today]: newHighlights });
  };

  // Gratitude State
  const [gratitudeEntries, setGratitudeEntries] = useLocalStorage<Record<string, GratitudeItem[]>>("petal-gratitude", {});
  const todayGratitude = gratitudeEntries[today] || [];
  const [gratitudePromptIndex, setGratitudePromptIndex] = useState(0);

  const addGratitude = (text: string) => {
    if (!text.trim() || todayGratitude.length >= 3) return;
    const newItems = [...todayGratitude, { id: Date.now().toString(), text }];
    setGratitudeEntries({ ...gratitudeEntries, [today]: newItems });
    setGratitudePromptIndex((prev) => (prev + 1) % GRATITUDE_PROMPTS.length);
  };

  const removeGratitude = (id: string) => {
    setGratitudeEntries({ ...gratitudeEntries, [today]: todayGratitude.filter(g => g.id !== id) });
  };

  // Calculate Streak
  const gratitudeStreak = useMemo(() => {
    let streak = 0;
    let d = new Date();
    while (true) {
      const dateStr = format(d, "yyyy-MM-dd");
      if (gratitudeEntries[dateStr] && gratitudeEntries[dateStr].length > 0) {
        streak++;
        d = subDays(d, 1);
      } else {
        // Allow missing today, but not yesterday
        if (streak === 0 && format(d, "yyyy-MM-dd") === today) {
           d = subDays(d, 1);
        } else {
           break;
        }
      }
    }
    return streak;
  }, [gratitudeEntries, today]);

  // Resets State
  const [weeklyReset, setWeeklyReset] = useLocalStorage<Record<string, string>>("petal-weekly-reset", {});
  const [monthlyReset, setMonthlyReset] = useLocalStorage<Record<string, string>>("petal-monthly-reset", {});

  if (size === "small") {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <PenLine className="w-5 h-5 text-secondary" />
          <h2 className="text-lg font-bold text-secondary font-serif">Journal</h2>
        </div>
        {currentEntry ? (
          <div className="p-3 bg-secondary/10 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium truncate">{localEntryData.title || "Untitled Entry"}</span>
              <span className="text-xl">{currentEntry.mood}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{localEntryData.content || "Write something..."}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Start journaling today...</p>
        )}
      </div>
    );
  }

  if (size === "medium") {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <PenLine className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-bold text-secondary font-serif">Digital Journal</h2>
        </div>
        {currentEntry && (
          <div className="flex-1 bg-white/50 rounded-xl p-4 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-muted-foreground font-medium">
                {format(new Date(currentEntry.date), "EEEE, MMMM do, yyyy")}
              </div>
              <div className="flex items-center gap-2">
                {MOOD_EMOJIS.slice(0, 5).map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => updateEntryMeta({ mood: emoji })}
                    className={`text-xl hover:scale-110 transition-transform ${currentEntry.mood === emoji ? 'scale-125 drop-shadow-md' : 'opacity-50 hover:opacity-100'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <Input
              value={localEntryData.title}
              onChange={(e) => setLocalEntryData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give this entry a title..."
              className="text-lg font-bold border-none bg-transparent px-0 shadow-none focus-visible:ring-0 mb-2 h-auto font-serif"
            />
            <Textarea
              value={localEntryData.content}
              onChange={(e) => setLocalEntryData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="How are you feeling right now? Let it out..."
              className="flex-1 resize-none border-none bg-transparent px-0 shadow-none focus-visible:ring-0 text-foreground/80 leading-relaxed text-sm min-h-[150px]"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TODAY'S HIGHLIGHTS */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-primary font-serif">Today's Highlights</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x">
          {todayHighlights.map((hl, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className={`flex-none w-64 ${hl.color} p-4 rounded-xl shadow-sm border border-border/10 snap-start shrink-0`}
            >
              <h3 className="font-bold text-foreground/80 mb-2 text-sm">{hl.prompt}</h3>
              <Textarea
                value={hl.answer}
                onChange={(e) => updateHighlight(i, e.target.value)}
                placeholder="Write here..."
                className="bg-white/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50 resize-none min-h-[80px] text-sm"
              />
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DIGITAL JOURNAL */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <PenLine className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold text-secondary font-serif">Digital Journal</h2>
            </div>
            
            <div className="flex gap-4 h-[500px]">
              {/* Journal History Sidebar */}
              <Card className="w-64 flex-shrink-0 bg-white/50 border-none shadow-sm hidden md:flex flex-col">
                <CardHeader className="py-4 px-4 bg-primary/5 border-b border-border/50">
                  <CardTitle className="text-sm font-bold text-primary">Entries</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {entries.map(entry => (
                      <button
                        key={entry.id}
                        onClick={() => setCurrentEntryId(entry.id)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${currentEntryId === entry.id ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-primary/10 text-foreground/70'}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span>{entry.date === today ? "Today" : format(new Date(entry.date), "MMM d")}</span>
                          <span>{entry.mood}</span>
                        </div>
                        <div className="truncate text-xs opacity-70">
                          {entry.title || "Untitled Entry"}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              {/* Journal Editor */}
              {currentEntry && (
                <Card className="flex-1 bg-white/80 border-none shadow-sm flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <CardContent className="p-6 flex-1 flex flex-col relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm text-muted-foreground font-medium">
                        {format(new Date(currentEntry.date), "EEEE, MMMM do, yyyy")}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {MOOD_EMOJIS.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => updateEntryMeta({ mood: emoji })}
                            className={`text-xl hover:scale-110 transition-transform ${currentEntry.mood === emoji ? 'scale-125 drop-shadow-md' : 'opacity-50 hover:opacity-100'}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Input
                      value={localEntryData.title}
                      onChange={(e) => setLocalEntryData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Give this entry a title..."
                      className="text-2xl font-bold border-none bg-transparent px-0 shadow-none focus-visible:ring-0 mb-4 h-auto font-serif"
                    />

                    <Textarea
                      value={localEntryData.content}
                      onChange={(e) => setLocalEntryData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="How are you feeling right now? Let it out..."
                      className="flex-1 resize-none border-none bg-transparent px-0 shadow-none focus-visible:ring-0 text-foreground/80 leading-relaxed text-md min-h-[200px]"
                    />

                    <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Emotional Tone</span>
                        <span className="text-xs text-muted-foreground">{localEntryData.content.length} chars</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TONE_TAGS.map(tone => (
                          <button
                            key={tone}
                            onClick={() => updateEntryMeta({ tone })}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${currentEntry.tone === tone ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary-foreground hover:bg-secondary/20'}`}
                          >
                            {tone}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* GRATITUDE TRACKER */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-primary font-serif">Gratitude Tracker</h2>
              </div>
              {gratitudeStreak > 0 && (
                <div className="flex items-center gap-1 text-sm font-bold text-orange-500 bg-orange-100/50 px-2 py-1 rounded-full">
                  <Flame className="w-4 h-4" /> {gratitudeStreak} Day Streak
                </div>
              )}
            </div>
            
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-none shadow-sm group">
              <CardContent className="p-5">
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground/80 mb-2 italic">
                    "{GRATITUDE_PROMPTS[gratitudePromptIndex]}"
                  </p>
                  
                  {todayGratitude.length < 3 ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget.elements.namedItem('gratitude') as HTMLInputElement;
                        addGratitude(input.value);
                        input.value = '';
                      }}
                      className="flex gap-2"
                    >
                      <Input 
                        name="gratitude" 
                        placeholder="I am grateful for..." 
                        className="bg-white/50 border-primary/20 focus-visible:ring-primary/50 text-sm"
                        autoComplete="off"
                      />
                      <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-white shrink-0">
                        Add
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-2 bg-primary/10 rounded-lg text-primary text-sm font-medium">
                      ✨ You've recorded 3 things today!
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <AnimatePresence>
                    {todayGratitude.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 bg-white/80 rounded-lg border border-primary/10 shadow-sm flex justify-between items-center group/item relative overflow-hidden hover:shadow-md hover:border-primary/30 transition-all"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/50 group-hover/item:bg-primary transition-colors" />
                        <span className="text-sm text-foreground/80 pl-2">{item.text}</span>
                        <button 
                          onClick={() => removeGratitude(item.id)}
                          className="opacity-0 group-hover/item:opacity-100 text-destructive/50 hover:text-destructive transition-opacity"
                        >
                          &times;
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* RESET SECTIONS */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold text-secondary font-serif">Resets</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem value="weekly" className="bg-white/50 rounded-xl border-none shadow-sm px-4">
                <AccordionTrigger className="hover:no-underline text-secondary font-bold text-sm">
                  Weekly Reset
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  {WEEKLY_PROMPTS.map((prompt) => (
                    <div key={prompt}>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{prompt}</label>
                      <Textarea 
                        value={weeklyReset[prompt] || ''}
                        onChange={(e) => setWeeklyReset({ ...weeklyReset, [prompt]: e.target.value })}
                        className="min-h-[60px] resize-none bg-white/80 text-sm border-secondary/20 focus-visible:ring-secondary/50" 
                      />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="monthly" className="bg-white/50 rounded-xl border-none shadow-sm px-4">
                <AccordionTrigger className="hover:no-underline text-accent font-bold text-sm">
                  Monthly Reflection
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  {MONTHLY_PROMPTS.map((prompt) => (
                    <div key={prompt}>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{prompt}</label>
                      <Textarea 
                        value={monthlyReset[prompt] || ''}
                        onChange={(e) => setMonthlyReset({ ...monthlyReset, [prompt]: e.target.value })}
                        className="min-h-[60px] resize-none bg-white/80 text-sm border-accent/20 focus-visible:ring-accent/50" 
                      />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </div>
    </div>
  );
}
