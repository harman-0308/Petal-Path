import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/hooks/use-settings";
import { toast } from "sonner";
import { 
  Settings, 
  Palette, 
  Bell, 
  ShieldAlert, 
  Database, 
  Download, 
  Trash2, 
  Volume2, 
  EyeOff,
  User
} from "lucide-react";

interface SettingsViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateToProfile?: () => void;
}

export default function SettingsView({ open, onOpenChange, onNavigateToProfile }: SettingsViewProps) {
  const { settings, updateSetting } = useSettings();
  const [activeTab, setActiveTab] = useState<"personalization" | "notifications" | "privacy" | "data">("personalization");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleExportData = () => {
    try {
      const allData: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("petal-")) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              allData[key] = JSON.parse(value);
            } catch {
              allData[key] = value;
            }
          }
        }
      }
      
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `petal-path-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Data exported successfully!");
    } catch (err) {
      toast.error("Failed to export data.");
      console.error(err);
    }
  };

  const handleWipeData = () => {
    if (deleteConfirm !== "DELETE") {
      toast.error("Please type DELETE to confirm.");
      return;
    }
    
    // Clear only petal path local storage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("petal-")) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    toast.success("All data wiped. Reloading...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const tabs = [
    { id: "personalization", label: "Personalization", icon: Palette },
    { id: "notifications", label: "Notifications & Sound", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: ShieldAlert },
    { id: "data", label: "Data Management", icon: Database },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl flex flex-col md:flex-row h-[85vh] max-h-[600px]">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-card/50 border-r border-border/30 p-6 flex flex-col gap-2 shrink-0 overflow-y-auto">
          <div className="flex items-center gap-2 font-bold text-lg mb-4 text-foreground">
            <Settings className="w-5 h-5 text-primary" />
            Settings
          </div>
          
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
          
          {onNavigateToProfile && (
            <div className="mt-auto pt-4 border-t border-border/30">
              <button
                onClick={() => {
                  onOpenChange(false);
                  onNavigateToProfile();
                }}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <User className="w-4 h-4" />
                Profile Settings
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-background">
          {activeTab === "personalization" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
                  <Palette className="w-5 h-5 text-primary" /> Personalization
                </h3>
                <p className="text-sm text-muted-foreground mb-6">Customize how Petal Path looks and feels.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Startup View</Label>
                  <Select value={settings.startupView} onValueChange={(val) => updateSetting("startupView", val)}>
                    <SelectTrigger className="w-full max-w-xs bg-card">
                      <SelectValue placeholder="Select tab" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Planner</SelectItem>
                      <SelectItem value="focus">Focus Mode</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="journal">Journal</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">The tab that opens automatically when you start the app.</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">Time Format</Label>
                  <Select value={settings.timeFormat} onValueChange={(val: any) => updateSetting("timeFormat", val)}>
                    <SelectTrigger className="w-full max-w-xs bg-card">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (1:00 PM)</SelectItem>
                      <SelectItem value="24h">24-hour (13:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">First Day of Week</Label>
                  <Select value={settings.weekStart} onValueChange={(val: any) => updateSetting("weekStart", val)}>
                    <SelectTrigger className="w-full max-w-xs bg-card">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
                  <Bell className="w-5 h-5 text-secondary" /> Notifications & Sound
                </h3>
                <p className="text-sm text-muted-foreground mb-6">Manage your alerts and audio experience.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50">
                  <div className="space-y-1 pr-4">
                    <Label className="text-base font-bold text-foreground flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-muted-foreground" /> Sound Effects
                    </Label>
                    <p className="text-xs text-muted-foreground">Play chimes when focus timers complete.</p>
                  </div>
                  <Switch 
                    checked={settings.soundEnabled} 
                    onCheckedChange={(val) => updateSetting("soundEnabled", val)} 
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50">
                  <div className="space-y-1 pr-4">
                    <Label className="text-base font-bold text-foreground flex items-center gap-2">
                      <Bell className="w-4 h-4 text-muted-foreground" /> App Reminders
                    </Label>
                    <p className="text-xs text-muted-foreground">Enable gentle reminders for hydration, posture, and journaling.</p>
                  </div>
                  <Switch 
                    checked={settings.notificationsEnabled} 
                    onCheckedChange={(val) => updateSetting("notificationsEnabled", val)} 
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
                  <ShieldAlert className="w-5 h-5 text-accent" /> Privacy & Security
                </h3>
                <p className="text-sm text-muted-foreground mb-6">Keep your sensitive information protected.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start sm:items-center justify-between p-5 rounded-2xl border-2 border-accent/20 bg-accent/5">
                  <div className="space-y-1.5 pr-4">
                    <Label className="text-base font-bold text-foreground flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-accent" /> Privacy Blur (Zen Mode)
                    </Label>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Automatically blurs sensitive numbers (like your Finance balances). Hover over the blurred text to reveal it.
                    </p>
                  </div>
                  <Switch 
                    checked={settings.privacyBlur} 
                    onCheckedChange={(val) => updateSetting("privacyBlur", val)} 
                    className="data-[state=checked]:bg-accent mt-2 sm:mt-0 shrink-0"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-1">
                  <Database className="w-5 h-5 text-primary" /> Data Management
                </h3>
                <p className="text-sm text-muted-foreground mb-6">Export your data or start completely fresh.</p>
              </div>

              <div className="space-y-6">
                <div className="p-5 rounded-2xl border border-border/50 bg-card/50 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Download className="w-4 h-4 text-primary" /> Export Data
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Download a JSON file containing all your local habits, tasks, journals, and preferences.
                    </p>
                  </div>
                  <Button onClick={handleExportData} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20">
                    Download JSON Backup
                  </Button>
                </div>

                <div className="p-5 rounded-2xl border-2 border-destructive/20 bg-destructive/5 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-destructive flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Danger Zone: Wipe Data
                    </h4>
                    <p className="text-xs text-destructive/80">
                      This will permanently delete all your Petal Path local data and log you out. This action cannot be undone.
                    </p>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <Label className="text-xs font-semibold text-foreground">Type "DELETE" to confirm</Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input 
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder="DELETE"
                        className="bg-background border-destructive/30 focus-visible:ring-destructive/30 max-w-[200px]"
                      />
                      <Button 
                        onClick={handleWipeData} 
                        variant="destructive"
                        disabled={deleteConfirm !== "DELETE"}
                        className="font-bold w-full sm:w-auto transition-all disabled:opacity-50"
                      >
                        Wipe All Data
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
