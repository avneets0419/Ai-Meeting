

import { BarChart3Icon, Brain, BrainCog, BrainCogIcon, ClipboardCheckIcon } from "lucide-react";
import { Features } from "./ui/features";

const features= [
  {
    id: 1,
    icon: BrainCogIcon,
    title: "AI-Powered Summaries",
    description:
      "Transform long, complex meetings into concise, actionable summaries in seconds with advanced AI.",
    image: "https://bcalabs.org/companions.jpg",
  },
  {
    id: 2,
    icon: ClipboardCheckIcon,
    title: "Smart Action Tracking",
    description:
      "Automatically extract key decisions, assign tasks, and track responsibilities effortlessly.",
    image: "https://bcalabs.org/companions.jpg",
  },
  {
    id: 3,
    icon: BarChart3Icon,
    title: "Insightful Dashboard",
    description:
      "Visualize meeting insights, task progress, and team productivity — all in one clean dashboard.",
    image: "https://bcalabs.org/companions_group_2.jpg",
  },
];
  

const FeaturesTab = () => {
  return (
  <Features 
  primaryColor="purple-500"
  progressGradientLight="bg-gradient-to-r from-purple-400 to-purple-500"
  progressGradientDark="bg-gradient-to-r from-purple-300 to-purple-400" 
  features={features} />
  )
  

};

export { FeaturesTab };
