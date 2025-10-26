

import { Brain, BrainCog } from "lucide-react";
import { Features } from "./ui/features";

const features= [
  {
    id: 1,
    icon: BrainCog,
    title: "Who Are AI Experts?",
    description:
      "AI Experts at BCA Labs are domain-specific mentors trained to guide you in tech, coding, and academics.",
    image: "https://bcalabs.org/companions.jpg",
  },
  {
    id: 2,
    icon: BrainCog,
    title: "Why AI Experts?",
    description:
      "Get instant, accurate help from experts—whether it's for coding or understanding tough concepts. They are trained on their expertise.",
    image: "https://bcalabs.org/companions.jpg",
  },
  {
    id: 3,
    icon: Brain,
    title: "AI-Powered Learning",
    description:
      "Experience personalized, AI-driven learning tailored for BCA, BBA, and other students.",
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
