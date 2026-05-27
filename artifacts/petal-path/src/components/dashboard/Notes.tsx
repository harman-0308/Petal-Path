import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type Note = { id: string, title: string, content: string, color: string };

const colors = ["bg-primary/20", "bg-secondary/20", "bg-accent/20", "bg-chart-4/30", "bg-chart-5/30"];

export default function Notes() {
  const [notes, setNotes] = useLocalStorage<Note[]>("petal-notes", []);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      color: colors[notes.length % colors.length]
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id: string, field: "title" | "content", value: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary">Sticky Notes</h3>
        <Button onClick={addNote} size="sm" variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
          <Plus className="h-4 w-4 mr-1" /> New Note
        </Button>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`${note.color} p-4 rounded-xl shadow-sm break-inside-avoid relative group transition-shadow hover:shadow-md border border-border/10 mb-4`}
            >
              <Input
                value={note.title}
                onChange={e => updateNote(note.id, "title", e.target.value)}
                placeholder="Title..."
                className="font-bold text-foreground border-0 bg-transparent shadow-none px-0 focus-visible:ring-0 text-md"
              />
              <Textarea
                value={note.content}
                onChange={e => updateNote(note.id, "content", e.target.value)}
                placeholder="Write something..."
                className="border-0 bg-transparent shadow-none px-0 focus-visible:ring-0 resize-none min-h-[100px] text-sm text-foreground/80 leading-relaxed"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteNote(note.id)}
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/50 hover:text-destructive hover:bg-white/50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {notes.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
            No notes yet. Click the button to add a sticky note! 📝
          </div>
        )}
      </div>
    </div>
  );
}