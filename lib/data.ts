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

export interface RealResultItem {
  id: string;
  title: string;
  thumbnail?: string;
  videoUrl: string;
  views: string;
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
    id: "video-gaming-intro-16-9",
    title: "Gaming Intro Edit",
    category: "Gaming",
    aspectRatio: "16:9",
    thumbnail: "",
    videoUrl: "https://youtu.be/Rx0lVD40vEA",
    description: "Dynamic and high-energy intro editing crafted with sound design, and text effects to hook the audience instantly.",
    duration: "0:30",
  },
  {
    id: "video-9-16",
    title: "High-Retention Reel & TikTok",
    category: "Reels / Shorts",
    aspectRatio: "9:16",
    thumbnail: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=80",
    videoUrl: "",
    description: "Sub-second hook, dynamic kinetic subtitles, and punchy sound design crafted for viral mobile retention and maximum engagement.",
    duration: "0:45",
  },
  {
    id: "video-row2-9-16",
    title: "Viral Lifestyle & Fitness Reel",
    category: "Reels / Shorts",
    aspectRatio: "9:16",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    videoUrl: "",
    description: "Rapid cut transitions, bold typography animations, and beat-synced audio designed for maximum watch time and viewer retention.",
    duration: "0:30",
  },
  {
    id: "video-3-16-9",
    title: "Gaming Tutorial Edit",
    category: "Gaming",
    aspectRatio: "16:9",
    thumbnail: "",
    videoUrl: "https://youtu.be/y4j3Kk24Sjc",
    description: "Dynamic and interactive intro editing in starting to hook audience in the start and make them watch the entire video till the end.",
    duration: "3:40",
  },
  {
    id: "video-3-9-16",
    title: "Cinematic Product & Brand Reel",
    category: "Reels / Shorts",
    aspectRatio: "9:16",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
    videoUrl: "",
    description: "Dynamic speed ramps, synchronized sound design, and modern brand aesthetic engineered for social conversions and viral mobile reach.",
    duration: "0:35",
  },
  {
    id: "video-row2-16-9",
    title: "Cinematic Trailer Editing",
    category: "Trailer",
    aspectRatio: "16:9",
    thumbnail: "",
    videoUrl: "https://youtu.be/c4EcnOGQSno",
    description: "Designed to build hype for an upcoming course, this trailer combines narrative-driven pacing, cinematic color grading, and layered sound design for maximum impact.",
    duration: "2:15",
  },
  {
    id: "video-4-16-9",
    title: "Course Edit",
    category: "Educational",
    aspectRatio: "16:9",
    thumbnail: "",
    videoUrl: "https://youtu.be/AJymOyDD0bk?si=O7DWdXzPVMdr-PTz",
    testimonialUrl: "https://youtu.be/AJymOyDD0bk?si=ZU6naRM1JsIq2i33",
    description: "This was a 3 hour course on Mobile Application Hacking. Received 100K+ views in a week.",
    duration: "1:30",
  },
];

// -------------------------------------------------------------
// REAL-WORLD IMPACT / RESULTS DATA
// These are the videos shown in the "Real-World Impact" section
// with their view counts (auto-fetched from YouTube API when possible)
// -------------------------------------------------------------
export const realResultsData: RealResultItem[] = [
  {
    id: "real-result-1",
    title: "Viral YouTube Edit",
    thumbnail: "",
    videoUrl: "https://youtu.be/Z6O9Qr9r7tQ?si=9NKXq_PpV5Mo4UQh",
    views: "1M+ Views",
  },
  {
    id: "real-result-2",
    title: "High-Retention Gaming Edit",
    thumbnail: "",
    videoUrl: "https://youtu.be/AJymOyDD0bk?si=ZZhospxZ3l4H32FI",
    views: "500K+ Views",
  },
];

export const pricingData: PricingTier[] = [
  {
    id: "short-form-plan",
    name: "Short form content",
    originalPrice: "",
    currentPrice: "₹999",
    taxNote: "",
    description: "Perfect for creators starting out with consistent, clean short-form content.",
    buttonText: "Contact me",
    features: [
      "+ 3-day delivery",
      "+ 2 Revisions",
      "+ Up to 5 minutes of footage provided",
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
    currentPrice: "₹1499",
    taxNote: "",
    description: "Ideal for growing brands demanding dynamic pacing, sound design, and custom graphics.",
    buttonText: "Contact me",
    features: [
      "+ 5-day delivery",
      "+ 5 Revisions",
      "+ Up to 30 minutes of footage provided",
      "+ Up to 10 minutes running time",
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
      "+ Up to 120 minutes of footage provided",
      "+ Up to 30 minutes running time",
      "+ Color grading",
      "+ Sound design & mixing",
      "+ Motion graphics",
      "+ Subtitles",
    ],
    theme: "red",
  },
];
