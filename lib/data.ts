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
  testimonialUrl?: string; // YouTube or video link to client testimonial / results
  testimonialStats?: {
    views?: string; // e.g. "1.2M" (auto-fetched from YouTube if omitted)
    likes?: string; // e.g. "85K" (auto-fetched from YouTube if omitted)
    comments?: string; // e.g. "3.4K" (auto-fetched from YouTube if omitted)
  };
  description: string;
  aspectRatio: "16:9" | "9:16";
  duration?: string;
}

export interface HeroBadgeConfig {
  imageUrl: string;
  text: string;
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

// -------------------------------------------------------------
// PROFILE BADGE CONFIGURATION
// To change your avatar:
// 1. Put your image in /portfolio/public/images/ (e.g., /images/avatar.png)
// 2. Or paste any direct image URL below
// -------------------------------------------------------------
export const heroBadgeData: HeroBadgeConfig = {
  imageUrl: "/images/avatar.png",
  text: "Available for Freelance Work",
};

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
    title: "YouTube Long Form Content",
    category: "Long Form",
    aspectRatio: "16:9",
    thumbnail: "",
    videoUrl: "https://youtu.be/429fbGhc_uI",
    testimonialUrl: "https://youtu.be/Z6O9Qr9r7tQ?si=DhXjxWanfK-Gp-H9",
    testimonialStats: {
      comments: "1.2K+", // Verified public engagement
    },
    description: "Fast-paced motion graphics, sound design, and high-contrast color grading. Gone viral and received 1 Million views in 7 Days.",
    duration: "1:08",
  },
  {
    id: "video-9-16",
    title: "High-Retention Reel & TikTok",
    category: "Reels / Shorts",
    aspectRatio: "9:16",
    thumbnail: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://youtube.com/shorts/CkQ_-8KIv6w?si=ieWxYv1AHpqdUdSZ",
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
    title: "Cinematic Trailer Editing",
    category: "Commercial / Doc",
    aspectRatio: "16:9",
    thumbnail: "",
    videoUrl: "https://youtu.be/c4EcnOGQSno",
    description: "Designed to build hype for an upcoming course, this trailer combines narrative-driven pacing, cinematic color grading, and layered sound design for maximum impact.",
    duration: "2:15",
  },
];

export const pricingData: PricingTier[] = [
  {
    id: "short-form-plan",
    name: "Short form content",
    originalPrice: "",
    currentPrice: "₹1499",
    taxNote: "",
    description: "Perfect for creators starting out with consistent, clean short-form content.",
    buttonText: "Contact me",
    features: [
      "+ 3-day delivery",
      "+ 2 Revisions",
      "+ Up to 15 minutes of footage provided",
      "+ Up to 1 minute running time",
      "+ Sound design & mixing",
      "+ Motion graphics",
    ],
    theme: "default",
  },
  {
    id: "long-form-plan",
    name: "long form content",
    originalPrice: "",
    currentPrice: "₹2499",
    taxNote: "",
    description: "Ideal for growing brands demanding dynamic pacing, sound design, and custom graphics.",
    buttonText: "Contact me",
    features: [
      "+ 5-day delivery",
      "+ 5 Revisions",
      "+ Up to 30 minutes of footage provided",
      "+ Up to 5 minutes running time",
      "+ Subtitles",
      "+ Sound design & mixing",
      "+ Motion graphics",

    ],
    theme: "blue",
  },
  {
    id: "ultimate-plan",
    name: "ULTIMATE",
    originalPrice: "",
    currentPrice: "₹4999",
    taxNote: "",
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
    ],
    theme: "red",
  },
];
