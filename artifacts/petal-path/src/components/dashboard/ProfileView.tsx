import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Sparkles, Target, Heart, Briefcase, Settings2, CheckCircle2 } from "lucide-react";

type UserProfile = {
  gender: string;
  age: string;
  occupation: string;
  goals: string[];
  hobbies: string[];
  interests: string[];
  isComplete: boolean;
};

const DEFAULT_GOALS = ["Mindfulness", "Fitness", "Productivity", "Better Sleep", "Save Money", "Learn a Skill"];
const DEFAULT_HOBBIES = ["Reading", "Gaming", "Art/Drawing", "Music", "Cooking", "Sports"];
const DEFAULT_INTERESTS = ["Technology", "Nature", "Fashion", "Travel", "Photography"];

export default function ProfileView() {
  const [profile, setProfile] = useLocalStorage<UserProfile>("petal-user-profile", {
    gender: "",
    age: "",
    occupation: "",
    goals: [],
    hobbies: [],
    interests: [],
    isComplete: false,
  });

  const [isEditing, setIsEditing] = useState(!profile.isComplete);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  
  // Custom tag inputs
  const [newGoal, setNewGoal] = useState("");
  const [newHobby, setNewHobby] = useState("");
  const [newInterest, setNewInterest] = useState("");

  // Reusable tag selector logic
  const toggleTag = (field: "goals" | "hobbies" | "interests", tag: string) => {
    setTempProfile(prev => {
      const current = prev[field];
      if (current.includes(tag)) {
        return { ...prev, [field]: current.filter(t => t !== tag) };
      }
      return { ...prev, [field]: [...current, tag] };
    });
  };

  const addCustomTag = (field: "goals" | "hobbies" | "interests", value: string, setter: (val: string) => void) => {
    if (value.trim() && !tempProfile[field].includes(value.trim())) {
      setTempProfile(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    }
    setter("");
  };

  const saveProfile = () => {
    setProfile({ ...tempProfile, isComplete: true });
    setIsEditing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2">
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit-profile"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="text-center space-y-2 mb-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Let's personalize your path</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Tell us a little about yourself so we can tailor the Petal Path experience to your lifestyle.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basics Card */}
              <motion.div variants={itemVariants}>
                <Card className="bg-card hover-elevate border-border/50 h-full">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                      <User className="w-4 h-4" /> Basics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Age Range</label>
                      <Select value={tempProfile.age} onValueChange={(val) => setTempProfile({ ...tempProfile, age: val })}>
                        <SelectTrigger className="bg-background/50">
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

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender</label>
                      <Select value={tempProfile.gender} onValueChange={(val) => setTempProfile({ ...tempProfile, gender: val })}>
                        <SelectTrigger className="bg-background/50">
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

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Occupation / Status</label>
                      <Input 
                        placeholder="e.g. Student, Designer, Engineer..." 
                        value={tempProfile.occupation}
                        onChange={(e) => setTempProfile({ ...tempProfile, occupation: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Goals Card */}
              <motion.div variants={itemVariants}>
                <Card className="bg-card hover-elevate border-border/50 h-full">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-secondary">
                      <Target className="w-4 h-4" /> Current Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {DEFAULT_GOALS.map(goal => (
                        <Badge 
                          key={goal}
                          variant={tempProfile.goals.includes(goal) ? "default" : "outline"}
                          className={`cursor-pointer transition-all press-scale ${tempProfile.goals.includes(goal) ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : 'hover:bg-secondary/10 hover:text-secondary'}`}
                          onClick={() => toggleTag("goals", goal)}
                        >
                          {goal}
                        </Badge>
                      ))}
                      {tempProfile.goals.filter(g => !DEFAULT_GOALS.includes(g)).map(goal => (
                        <Badge key={goal} variant="default" className="bg-secondary text-secondary-foreground cursor-pointer press-scale" onClick={() => toggleTag("goals", goal)}>
                          {goal} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add custom goal..." 
                        className="h-8 text-xs bg-background/50"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomTag("goals", newGoal, setNewGoal)}
                      />
                      <Button size="sm" className="h-8 text-xs bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={() => addCustomTag("goals", newGoal, setNewGoal)}>Add</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Hobbies Card */}
              <motion.div variants={itemVariants}>
                <Card className="bg-card hover-elevate border-border/50 h-full">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-accent">
                      <Heart className="w-4 h-4" /> Hobbies & Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {DEFAULT_HOBBIES.map(hobby => (
                        <Badge 
                          key={hobby}
                          variant={tempProfile.hobbies.includes(hobby) ? "default" : "outline"}
                          className={`cursor-pointer transition-all press-scale ${tempProfile.hobbies.includes(hobby) ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'hover:bg-accent/10 hover:text-accent'}`}
                          onClick={() => toggleTag("hobbies", hobby)}
                        >
                          {hobby}
                        </Badge>
                      ))}
                      {tempProfile.hobbies.filter(h => !DEFAULT_HOBBIES.includes(h)).map(hobby => (
                        <Badge key={hobby} variant="default" className="bg-accent text-accent-foreground cursor-pointer press-scale" onClick={() => toggleTag("hobbies", hobby)}>
                          {hobby} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add hobby..." 
                        className="h-8 text-xs bg-background/50"
                        value={newHobby}
                        onChange={(e) => setNewHobby(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomTag("hobbies", newHobby, setNewHobby)}
                      />
                      <Button size="sm" className="h-8 text-xs bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => addCustomTag("hobbies", newHobby, setNewHobby)}>Add</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Interests Card */}
              <motion.div variants={itemVariants}>
                <Card className="bg-card hover-elevate border-border/50 h-full">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                      <Briefcase className="w-4 h-4" /> Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {DEFAULT_INTERESTS.map(interest => (
                        <Badge 
                          key={interest}
                          variant={tempProfile.interests.includes(interest) ? "default" : "outline"}
                          className={`cursor-pointer transition-all press-scale ${tempProfile.interests.includes(interest) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-primary/10 hover:text-primary'}`}
                          onClick={() => toggleTag("interests", interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                      {tempProfile.interests.filter(i => !DEFAULT_INTERESTS.includes(i)).map(interest => (
                        <Badge key={interest} variant="default" className="bg-primary text-primary-foreground cursor-pointer press-scale" onClick={() => toggleTag("interests", interest)}>
                          {interest} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add interest..." 
                        className="h-8 text-xs bg-background/50"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomTag("interests", newInterest, setNewInterest)}
                      />
                      <Button size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => addCustomTag("interests", newInterest, setNewInterest)}>Add</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="flex justify-center pt-6">
              <Button 
                onClick={saveProfile}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-full shadow-lg shadow-primary/20 press-scale flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Save Profile
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="view-profile"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10"
          >
            <Card className="w-full max-w-2xl bg-card border-border/50 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20" />
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm border-border/50 text-foreground hover:bg-background/80"
                onClick={() => setIsEditing(true)}
              >
                <Settings2 className="w-4 h-4 mr-2" /> Edit
              </Button>
              
              <div className="pt-20 px-6 pb-6 relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-card flex items-center justify-center text-primary shadow-lg mb-4">
                  <User className="w-10 h-10" />
                </div>
                
                <h2 className="text-2xl font-bold text-foreground">Your Profile</h2>
                {profile.occupation && (
                  <p className="text-muted-foreground text-sm font-medium mt-1">{profile.occupation}</p>
                )}
                
                <div className="w-full h-px bg-border/40 my-6" />

                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {profile.goals.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
                        <Target className="w-3 h-3" /> Goals
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.goals.map(g => (
                          <Badge key={g} variant="outline" className="text-[10px] py-0 border-secondary/30 text-secondary-foreground">{g}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profile.hobbies.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                        <Heart className="w-3 h-3" /> Hobbies
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.hobbies.map(h => (
                          <Badge key={h} variant="outline" className="text-[10px] py-0 border-accent/30 text-accent-foreground">{h}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.interests.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-3 h-3" /> Interests
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.interests.map(i => (
                          <Badge key={i} variant="outline" className="text-[10px] py-0 border-primary/30 text-primary-foreground">{i}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {profile.goals.length === 0 && profile.hobbies.length === 0 && profile.interests.length === 0 && (
                  <div className="py-8 text-muted-foreground text-sm text-center">
                    You haven't added any tags yet. Click Edit to customize your profile! ✿
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
