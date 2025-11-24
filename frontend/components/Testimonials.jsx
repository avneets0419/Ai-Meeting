import { TestimonialsSection } from "./blocks/testimonials-with-marquee";

const testimonials = [
  {
    author: {
      name: "Aarav Mehta",
      handle: "@aarav_meetai",
      avatar:
        "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=150&h=150&fit=crop&qcrop=face",
    },
    text: "Meet Wise saves me hours every week. The summaries are incredibly precise and capture every key point discussed in meetings.",
    
  },
  {
    author: {
      name: "Sofia Alvarez",
      handle: "@sofia_ops",
      avatar:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face",
    },
    text: "The AI-generated action items are game-changing. Our team’s follow-ups and accountability have improved drastically.",
    
  },
  {
    author: {
      name: "Rohan Gupta",
      handle: "@rohan_codes",
      avatar:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    },
    text: "Seamless, smart, and fast — Meet Wise turns long meetings into crisp, actionable summaries instantly. Love the simplicity!",
    
  },
];

export function Testimonials() {
  return (
    <TestimonialsSection
      title="Loved by professionals"
      description="Experience how teams use Meet Wise to replace long, messy notes with instant AI-powered summaries."
      testimonials={testimonials}
    />
  );
}
