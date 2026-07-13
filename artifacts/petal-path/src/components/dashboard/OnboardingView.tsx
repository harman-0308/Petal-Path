import { useState } from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, ArrowRight, SkipForward } from "lucide-react";

type UserProfile = {
  gender: string;
  age: string;
  occupation: string;
  goals: string[];
  hobbies: string[];
  interests: string[];
  isComplete: boolean;
};

const DEFAULT_INTERESTS = ["Technology", "Nature", "Fashion", "Travel", "Photography", "Design", "Fitness", "Music"];

interface OnboardingViewProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingView({ onComplete, onSkip }: OnboardingViewProps) {
  const [profile, setProfile] = useLocalStorage<UserProfile>("petal-user-profile", {
    gender: "",
    age: "",
    occupation: "",
    goals: [],
    hobbies: [],
    interests: [],
    isComplete: false,
  });

  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  const [newInterest, setNewInterest] = useState("");

  const toggleInterest = (interest: string) => {
    setTempProfile(prev => {
      const current = prev.interests;
      if (current.includes(interest)) {
        return { ...prev, interests: current.filter(t => t !== interest) };
      }
      return { ...prev, interests: [...current, interest] };
    });
  };

  const addCustomInterest = () => {
    if (newInterest.trim() && !tempProfile.interests.includes(newInterest.trim())) {
      setTempProfile(prev => ({ ...prev, interests: [...prev.interests, newInterest.trim()] }));
    }
    setNewInterest("");
  };

  const handleSave = () => {
    setProfile({ ...tempProfile, isComplete: true });
    onComplete();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-y-auto selection:bg-primary/20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-3xl mx-auto py-12 px-6 flex-1 flex flex-col justify-center"
      >
        <motion.div variants={itemVariants} className="text-center space-y-4 mb-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Welcome to Petal Path</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Let's personalize your experience. We use this information to customize your recommendations, productivity insights, widgets, and AI suggestions.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl p-6 md:p-8 rounded-3xl">
            <CardContent className="space-y-8 p-0">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-foreground">Age Range</label>
                  <Select value={tempProfile.age} onValueChange={(val) => setTempProfile({ ...tempProfile, age: val })}>
                    <SelectTrigger className="bg-background/80 h-12 rounded-xl">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_18">Under 18</SelectItem>
                      <SelectItem value="18_24">18 - 24</SelectItem>
                      <SelectItem value="25_34">25 - 34</SelectItem>
                      <SelectItem value="35_44">35 - 44</SelectItem>
                      <SelectItem value="45_plus">45+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-foreground">Gender</label>
                  <Select value={tempProfile.gender} onValueChange={(val) => setTempProfile({ ...tempProfile, gender: val })}>
                    <SelectTrigger className="bg-background/80 h-12 rounded-xl">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non_binary">Non-binary</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">Occupation / Status</label>
                <Input 
                  placeholder="e.g. Student, Software Engineer, Designer..." 
                  value={tempProfile.occupation}
                  onChange={(e) => setTempProfile({ ...tempProfile, occupation: e.target.value })}
                  className="bg-background/80 h-12 rounded-xl px-4"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-foreground">What are your interests?</label>
                <div className="flex flex-wrap gap-2.5">
                  {DEFAULT_INTERESTS.map(interest => (
                    <Badge 
                      key={interest}
                      variant={tempProfile.interests.includes(interest) ? "default" : "outline"}
                      className={`cursor-pointer transition-all px-4 py-2 rounded-full text-sm font-medium ${
                        tempProfile.interests.includes(interest) 
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90' 
                          : 'bg-background hover:bg-primary/10 hover:text-primary border-border/60 hover:border-primary/50 text-muted-foreground'
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                  {tempProfile.interests.filter(i => !DEFAULT_INTERESTS.includes(i)).map(interest => (
                    <Badge 
                      key={interest} 
                      variant="default" 
                      className="bg-primary text-primary-foreground cursor-pointer px-4 py-2 rounded-full text-sm font-medium" 
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Input 
                    placeholder="Add custom interest..." 
                    className="h-12 bg-background/80 rounded-xl"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()}
                  />
                  <Button size="lg" className="h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={addCustomInterest}>
                    Add
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col-reverse md:flex-row items-center justify-between mt-10 gap-4">
          <Button 
            variant="ghost" 
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground h-12 px-6 rounded-full w-full md:w-auto"
          >
            Skip for now
            <SkipForward className="w-4 h-4 ml-2" />
          </Button>
          
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 px-10 rounded-full shadow-xl shadow-primary/20 press-scale flex items-center gap-2 w-full md:w-auto text-lg"
          >
            Save & Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
