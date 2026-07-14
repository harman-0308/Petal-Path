import { motion } from "framer-motion";
import DailyPlanner from "./DailyPlanner";
import TodoList from "./TodoList";
import HabitTracker from "./HabitTracker";
import WaterTracker from "./WaterTracker";
import SleepTracker from "./SleepTracker";
import ExerciseTracker from "./ExerciseTracker";
import MealTracker from "./MealTracker";
import Affirmations from "./Affirmations";
import Notes from "./Notes";
import MoodTracker from "./MoodTracker";
import EnergyTracker from "./EnergyTracker";
import SelfCareChecklist from "./SelfCareChecklist";
import LittleThings from "./LittleThings";
import GratitudeMini from "./GratitudeMini";
import DigitalJournal from "./DigitalJournal";

export default function DailyView() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500"
    >
      {/* Left Column (Wider) */}
      <div className="lg:col-span-8 space-y-6">
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TodoList />
          <HabitTracker />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DailyPlanner />
        </motion.div>

        <motion.div variants={itemVariants}>
          <DigitalJournal />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Notes />
        </motion.div>
      </div>

      {/* Right Column (Narrower) */}
      <div className="lg:col-span-4 space-y-6">
        <motion.div variants={itemVariants}>
          <MoodTracker />
        </motion.div>
        <motion.div variants={itemVariants}>
          <EnergyTracker />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SelfCareChecklist />
        </motion.div>
        <motion.div variants={itemVariants}>
          <LittleThings />
        </motion.div>
        <motion.div variants={itemVariants}>
          <GratitudeMini />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Affirmations />
        </motion.div>
        <motion.div variants={itemVariants}>
          <WaterTracker />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SleepTracker />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ExerciseTracker />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MealTracker />
        </motion.div>
      </div>
    </motion.div>
  );
}
