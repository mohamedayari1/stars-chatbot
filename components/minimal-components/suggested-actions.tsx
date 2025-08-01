import { motion } from "framer-motion";
import { Button } from "../ui/button";

export default function SuggestedActions() {
  const suggestedActions = [
    {
      title: "Get my birth chart",
      label: "based on date, time, and place of birth",
      action: "Generate a birth chart and explain my planetary placements",
    },
    {
      title: "Horoscope forecast",
      label: "for today, this week, or this month",
      action:
        "Give me a daily, weekly, or monthly horoscope based on current transits",
    },
    {
      title: "Check relationship compatibility",
      label: "based on two birth dates",
      action: "Compare two birth charts and analyze compatibility",
    },
    {
      title: "Ask a personal astrology question",
      label: "like why I feel anxious or when to switch jobs",
      action:
        "Analyze my current astrological transits and answer a specific question",
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant={"ghost"}
            onClick={() => console.log(suggestedAction)}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
          <span className="font-medium">{suggestedAction.title}</span>
          <span className="text-muted-foreground">{suggestedAction.label}</span>
          </Button>

        </motion.div>
      ))}
    </div>
  );
}
