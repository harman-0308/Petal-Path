import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X, LayoutGrid } from "lucide-react";
import { WIDGET_REGISTRY } from "./widgets/registry";

interface WidgetPickerProps {
  activeWidgetIds: string[];
  onAddWidget: (id: string) => void;
  onRemoveWidget: (id: string) => void;
  children: React.ReactNode;
}

export default function WidgetPicker({ activeWidgetIds, onAddWidget, onRemoveWidget, children }: WidgetPickerProps) {
  const allWidgets = Object.values(WIDGET_REGISTRY);
  
  // Group widgets by category
  const groupedWidgets = allWidgets.reduce((acc, widget) => {
    const category = widget.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(widget);
    return acc;
  }, {} as Record<string, typeof allWidgets>);

  // Sort categories (Overview first, then specific ones)
  const categories = Object.keys(groupedWidgets).sort((a, b) => {
    if (a === "Overview") return -1;
    if (b === "Overview") return 1;
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return a.localeCompare(b);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <LayoutGrid className="w-6 h-6 text-primary" />
            Widget Library
          </DialogTitle>
          <DialogDescription className="text-base">
            Customize your dashboard. Add or remove widgets to personalize your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border/50">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {groupedWidgets[category].map((widget) => {
                  const isActive = activeWidgetIds.includes(widget.id);
                  const Icon = widget.icon;

                  return (
                    <div 
                      key={widget.id} 
                      className={`relative flex flex-col p-4 rounded-2xl border ${isActive ? 'border-primary bg-primary/5' : 'border-border/50 bg-card hover:border-primary/50'} transition-all`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm leading-tight">{widget.title}</span>
                      </div>
                      
                      <div className="mt-auto pt-2">
                        {isActive ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 rounded-xl"
                            onClick={() => onRemoveWidget(widget.id)}
                          >
                            <X className="w-4 h-4 mr-2" /> Remove
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="w-full rounded-xl"
                            onClick={() => onAddWidget(widget.id)}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
