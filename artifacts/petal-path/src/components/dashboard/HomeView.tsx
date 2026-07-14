import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, FileText, Zap } from "lucide-react";

export default function HomeView() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500 pb-24"
    >
      {/* Today's Overview Widget Placeholder */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
              <Activity className="w-5 h-5" /> Today's Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-primary/5 rounded-xl border border-dashed border-primary/20">
              <span className="text-sm font-medium">Overview data will appear here.</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Summary Widget Placeholder */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-secondary">
              <Zap className="w-5 h-5" /> Progress Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-secondary/5 rounded-xl border border-dashed border-secondary/20">
              <span className="text-sm font-medium">Your progress stats will be shown here.</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions Widget Placeholder */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-accent">
              <Clock className="w-5 h-5" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 flex items-center justify-center rounded-xl bg-accent/5 border border-dashed border-accent/20 text-muted-foreground text-sm font-medium cursor-pointer hover:bg-accent/10 transition-colors">
                  Action {i}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Entries Widget Placeholder */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <Card className="h-full bg-white/50 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground/80">
              <FileText className="w-5 h-5" /> Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 flex items-center px-4 rounded-xl bg-muted/30 border border-dashed border-muted/50 text-muted-foreground text-sm font-medium">
                  Entry placeholder {i}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
