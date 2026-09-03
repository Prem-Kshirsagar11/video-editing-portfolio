export interface Service {
  id: string;
  title: string;
  description: string;
  tools: string[];
}

export interface VideoProject {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl: string; // YouTube, Shorts, Vimeo, or direct MP4/WebM URL
  description: string;
  aspectRatio: "16:9" | "9:16";
  duration?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  originalPrice: string;
  currentPrice: string;
  taxNote?: string;
  description: string;
  buttonText: string;
  features: string[];
  isPopular?: boolean;
  theme: "default" | "blue" | "red";
}

export const servicesData: Service[] = [
  {
    id: "short-form",
    title: "Short-Form Vertical Videos",
    description: "High-retention Reels, TikToks, and Shorts crafted with punchy pacing, kinetic typography, dynamic sound design, and sub-second hooks.",
    tools: ["Premiere Pro", "After Effects", "CapCut Pro"],
  },
  {
    id: "cinematic-commercials",
    title: "Cinematic Commercials & Ads",
    description: "Premium widescreen commercial edits, color-graded to perfection with immersive multi-track soundscapes and seamless storytelling.",
    tools: ["DaVinci Resolve", "Premiere Pro", "Audacity"],
  },
  {
    id: "youtube-documentary",
    title: "YouTube & Documentary Storytelling",
    description: "Long-form narrative pacing, retention-focused editing, custom visual effects, and research-backed b-roll integration for creators and brands.",
    tools: ["DaVinci Resolve", "Photoshop", "After Effects"],
  },
];

export const projectsData: VideoProject[] = [
  {
    id: "video-16-9",
    title: "Cinematic Travel Commercial",
    category: "Commercial",
    aspectRatio: "16:9",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://youtu.be/nXQVoJdDdBg?si=HCa2bYDwt1UkWwRF",
    description: "Fast-paced sound design, speed ramps, and high-contrast color grading. Mastered in 4K DCI for commercial broadcast and high-impact web delivery.",
    duration: "1:30",
  },
  {
    id: "video-9-16",
    title: "High-Retention Reel & TikTok",
    category: "Reels / Shorts",
    aspectRatio: "9:16",
    thumbnail: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    description: "Sub-second hook, dynamic kinetic subtitles, and punchy sound design crafted for viral mobile retention and maximum engagement.",
    duration: "0:45",
  },
  {
    id: "video-row2-9-16",
    title: "Viral Lifestyle & Fitness Reel",
    category: "Reels / Shorts",
    aspectRatio: "9:16",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    description: "Rapid cut transitions, bold typography animations, and beat-synced audio designed for maximum watch time and viewer retention.",
    duration: "0:30",
  },
  {
    id: "video-row2-16-9",
    title: "Documentary Brand Story",
    category: "Commercial / Doc",
    aspectRatio: "16:9",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    description: "Narrative-driven pacing, color grading calibrated for cinematic mood, and multi-track audio soundscapes tailored for high impact.",
    duration: "2:15",
  },
];

export const pricingData: PricingTier[] = [
  {
    id: "short-form-plan",
    name: "Short form content",
    originalPrice: "₹8000",
    currentPrice: "₹4999",
    taxNote: "+GST",
    description: "Perfect for creators starting out with consistent, clean short-form content.",
    buttonText: "Contact me",
    features: [
      "+ 4-day delivery",
      "+ 4 Revisions",
      "+ Up to 15 minutes of footage provided",
      "+ Up to 1 minute running time",
      "+ Sound design & mixing",
    ],
    theme: "default",
  },
  {
    id: "long-form-plan",
    name: "long form content",
    originalPrice: "₹12,000",
    currentPrice: "₹6999",
    taxNote: "+GST",
    description: "Ideal for growing brands demanding dynamic pacing, sound design, and custom graphics.",
    buttonText: "Contact me",
    features: [
      "+ 5-day delivery",
      "+ 7 Revisions",
      "+ Up to 30 minutes of footage provided",
      "+ Up to 5 minutes running time",
      "+ Color grading",
      "+ Sound design & mixing",
      "+ Motion graphics",
    ],
    theme: "blue",
  },
  {
    id: "ultimate-plan",
    name: "ULTIMATE",
    originalPrice: "₹25000",
    currentPrice: "₹14999",
    taxNote: "+GST",
    description: "Full-service dedicated post-production partner for commercial scale and viral retention.",
    buttonText: "Contact me",
    features: [
      "+ 10-day delivery",
      "+ Unlimited Revisions",
      "+ Up to 60 minutes of footage provided",
      "+ Up to 10 minutes running time",
      "+ Color grading",
      "+ Sound design & mixing",
      "+ Motion graphics",
      "+ Subtitles",
      "+ Include source file",
    ],
    theme: "red",
  },
];
