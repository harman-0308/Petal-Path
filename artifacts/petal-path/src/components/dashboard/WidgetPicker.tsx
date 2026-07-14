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
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5" />
            Widget Library
          </DialogTitle>
          <DialogDescription>
            Customize your dashboard. Add or remove widgets to personalize your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {allWidgets.map((widget) => {
            const isActive = activeWidgetIds.includes(widget.id);
            const Icon = widget.icon;

            return (
              <div 
                key={widget.id} 
                className={`relative flex flex-col p-4 rounded-xl border ${isActive ? 'border-primary bg-primary/5' : 'border-border/50 bg-card hover:border-primary/50'} transition-all`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm leading-tight">{widget.title}</span>
                </div>
                
                <div className="mt-auto pt-2">
                  {isActive ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                      onClick={() => onRemoveWidget(widget.id)}
                    >
                      <X className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
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
      </DialogContent>
    </Dialog>
  );
}
