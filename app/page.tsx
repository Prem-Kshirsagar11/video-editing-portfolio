"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  X,
  Film,
  Scissors,
  Plus,
  Minus,
  Edit3,
  Monitor,
  Smartphone,
  RotateCcw,
  Check,
} from "lucide-react";

import { VideoProject, servicesData, projectsData, pricingData } from "@/lib/data";

export { type VideoProject };

export const INITIAL_16_9_VIDEO: VideoProject = projectsData[0];
export const INITIAL_9_16_VIDEO: VideoProject = projectsData[1];
export const INITIAL_ROW2_9_16_VIDEO: VideoProject = projectsData[2];
export const INITIAL_ROW2_16_9_VIDEO: VideoProject = projectsData[3];

// Formats user-provided video links into clean embed or direct video URLs
function formatVideoUrl(url: string, autoplay: boolean = true): { type: "iframe" | "video"; src: string } {
  if (!url) return { type: "video", src: "" };
  const trimmed = url.trim();

  // Direct video file
  if (
    trimmed.endsWith(".mp4") ||
    trimmed.endsWith(".webm") ||
    trimmed.endsWith(".ogg") ||
    trimmed.includes("/videos/")
  ) {
    return { type: "video", src: trimmed };
  }

  // YouTube Shorts: youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return {
      type: "iframe",
      src: `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=${autoplay ? 1 : 0}&rel=0`,
    };
  }

  // YouTube watch or shortlink: youtube.com/watch?v=... or youtu.be/...
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "iframe",
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=${autoplay ? 1 : 0}&rel=0`,
    };
  }

  // Vimeo: vimeo.com/VIDEO_ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "iframe",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${autoplay ? 1 : 0}`,
    };
  }

  // If already an embed URL (e.g. youtube embed), ensure autoplay parameter
  if (trimmed.includes("embed") && autoplay && !trimmed.includes("autoplay=")) {
    const separator = trimmed.includes("?") ? "&" : "?";
    return { type: "iframe", src: `${trimmed}${separator}autoplay=1` };
  }

  // Default iframe for existing embed URLs
  return { type: "iframe", src: trimmed };
}

const FAQS = [
  {
    question: "WHAT IS YOUR TYPICAL TURNAROUND TIME?",
    answer: "Standard short-form content takes 2-3 days. Long-form YouTube or commercial projects typically take 1-2 weeks depending on complexity.",
  },
  {
    question: "WHAT DO YOU NEED FROM ME TO GET STARTED?",
    answer: "I need your raw footage, a project brief or script, any specific branding assets (logos, fonts), and a reference video if you have a specific style in mind.",
  },
  {
    question: "DO YOU OFFER REVISIONS?",
    answer: "Yes, every project includes 2 complimentary rounds of revisions to ensure the final cut perfectly aligns with your vision.",
  },
  {
    question: "WHAT EDITING SOFTWARE DO YOU USE?",
    answer: "I primarily edit in Premiere Pro and DaVinci Resolve, utilizing After Effects for custom motion graphics and visual effects.",
  },
];

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Home() {
  const footerRef = useRef<HTMLElement>(null);
  const [isDocked, setIsDocked] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsDocked(entry.isIntersecting);
    }, { rootMargin: "0px 0px 140px 0px" });
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Left 16:9 Video & Right 9:16 Video State (Row 1)
  const [leftVideo, setLeftVideo] = useState<VideoProject>(projectsData[0] || INITIAL_16_9_VIDEO);
  const [rightVideo, setRightVideo] = useState<VideoProject>(projectsData[1] || INITIAL_9_16_VIDEO);

  // Row 2: Left 9:16 Video & Right 16:9 Video State
  const [row2LeftVideo, setRow2LeftVideo] = useState<VideoProject>(projectsData[2] || INITIAL_ROW2_9_16_VIDEO);
  const [row2RightVideo, setRow2RightVideo] = useState<VideoProject>(projectsData[3] || INITIAL_ROW2_16_9_VIDEO);

  // Currently playing inline video preview ('left' | 'right' | 'row2-left' | 'row2-right' | null)
  const [playingInline, setPlayingInline] = useState<string | null>(null);

  // Quick edit modal state
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<VideoProject>(projectsData[0] || INITIAL_16_9_VIDEO);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Load custom values from localStorage if user saved edits
  useEffect(() => {
    try {
      const savedLeft = localStorage.getItem("portfolio_video_16_9");
      if (savedLeft) setLeftVideo(JSON.parse(savedLeft));

      const savedRight = localStorage.getItem("portfolio_video_9_16");
      if (savedRight) setRightVideo(JSON.parse(savedRight));

      const savedRow2Left = localStorage.getItem("portfolio_video_row2_9_16");
      if (savedRow2Left) setRow2LeftVideo(JSON.parse(savedRow2Left));

      const savedRow2Right = localStorage.getItem("portfolio_video_row2_16_9");
      if (savedRow2Right) setRow2RightVideo(JSON.parse(savedRow2Right));
    } catch {
      // LocalStorage not available or parse error
    }
  }, []);

  const openEditor = (target: string) => {
    setEditingTarget(target);
    if (target === "left") setEditForm(leftVideo);
    else if (target === "right") setEditForm(rightVideo);
    else if (target === "row2-left") setEditForm(row2LeftVideo);
    else if (target === "row2-right") setEditForm(row2RightVideo);
  };

  const saveEditor = () => {
    if (editingTarget === "left") {
      setLeftVideo(editForm);
      try {
        localStorage.setItem("portfolio_video_16_9", JSON.stringify(editForm));
      } catch { }
    } else if (editingTarget === "right") {
      setRightVideo(editForm);
      try {
        localStorage.setItem("portfolio_video_9_16", JSON.stringify(editForm));
      } catch { }
    } else if (editingTarget === "row2-left") {
      setRow2LeftVideo(editForm);
      try {
        localStorage.setItem("portfolio_video_row2_9_16", JSON.stringify(editForm));
      } catch { }
    } else if (editingTarget === "row2-right") {
      setRow2RightVideo(editForm);
      try {
        localStorage.setItem("portfolio_video_row2_16_9", JSON.stringify(editForm));
      } catch { }
    }
    setEditingTarget(null);
  };

  const resetToDefault = () => {
    if (editingTarget === "left") {
      setLeftVideo(INITIAL_16_9_VIDEO);
      try {
        localStorage.removeItem("portfolio_video_16_9");
      } catch { }
    } else if (editingTarget === "right") {
      setRightVideo(INITIAL_9_16_VIDEO);
      try {
        localStorage.removeItem("portfolio_video_9_16");
      } catch { }
    } else if (editingTarget === "row2-left") {
      setRow2LeftVideo(INITIAL_ROW2_9_16_VIDEO);
      try {
        localStorage.removeItem("portfolio_video_row2_9_16");
      } catch { }
    } else if (editingTarget === "row2-right") {
      setRow2RightVideo(INITIAL_ROW2_16_9_VIDEO);
      try {
        localStorage.removeItem("portfolio_video_row2_16_9");
      } catch { }
    }
    setEditingTarget(null);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-neutral-100 selection:bg-[#eaff00] selection:text-black overflow-x-hidden">
      {/* Ambient Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Neon radial glow at the top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] md:w-[1200px] h-[550px] bg-[radial-gradient(ellipse_at_top,_rgba(234,255,0,0.06),transparent_70%)] blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-0 right-0 mx-auto w-[90%] max-w-4xl h-14 z-40 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-6 md:px-8 shadow-2xl flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center justify-start">
          <div className="text-sm md:text-base tracking-tight flex items-center gap-2 font-bold text-white">
            <Film className="w-4 h-4 text-[#eaff00]" />
            <span>YOUR NAME</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center justify-center gap-6 md:gap-8 font-bold text-xs uppercase tracking-widest">
          <a href="#work" className="text-neutral-400 hover:text-white transition-colors">
            Work
          </a>
          <a href="#about" className="text-neutral-400 hover:text-white transition-colors">
            Workflow
          </a>
          <a href="#pricing" className="text-neutral-400 hover:text-white transition-colors">
            Prices
          </a>
          <a href="#faq" className="text-neutral-400 hover:text-white transition-colors">
            FAQ
          </a>
        </div>

        {/* Right: CTA Button */}
        <div className="flex-1 flex items-center justify-end">
          <a
            href="#contact"
            className="py-1.5 px-4 md:px-5 bg-[#eaff00] hover:bg-[#d8ec00] text-black font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-sm"
          >
            Get in Touch
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 pb-4 sm:pb-6 px-6 text-center flex flex-col items-center w-full max-w-5xl mx-auto">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121212]/90 border border-neutral-800/80 backdrop-blur-md -translate-y-2.5 mb-6 sm:mb-8 shadow-sm">
          <svg
            className="w-3.5 h-3.5 text-[#ff4b72] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2C13 6.5 9.5 10 5 10C9.5 10 13 13.5 13 18C13 13.5 16.5 10 21 10C16.5 10 13 6.5 13 2Z" />
            <circle cx="5" cy="18.5" r="1.2" strokeWidth="2" />
            <path d="M19.5 2.5v4M17.5 4.5h4" strokeWidth="2" />
          </svg>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-200">
            AVAILABLE FOR FREELANCE &amp; REMOTE WORK
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 text-shimmer whitespace-nowrap">
          Video Editing Portfolio
        </h1>

        {/* Subtitle & CTA */}
        <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-8">
          Specialized in high-retention social content, cinematic commercials, and digital storytelling that captivates audiences.
        </p>
        <a
          href="#work"
          className="bg-[#eaff00] hover:bg-[#d8ec00] text-black font-bold px-8 py-3.5 rounded-full inline-block transition-all shadow-lg shadow-[#eaff00]/10 hover:shadow-[#eaff00]/20 tracking-wide hover:scale-105 transform duration-200"
        >
          View My Work
        </a>
      </section>

      {/* Work Grid: Dual Showcase (Left 16:9 + Right 9:16) */}
      <section id="work" className="pt-6 sm:pt-8 pb-6 md:pb-8 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">See My Services</h2>
            <p className="text-neutral-400 text-sm md:text-base mt-2 font-medium tracking-wide">
              Showcasing 16:9 widescreen cinema and 9:16 high-retention mobile formats.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111111] border border-neutral-800 text-neutral-300 text-xs font-semibold">
              <Monitor className="w-3.5 h-3.5 text-[#eaff00]" /> 16:9 Landscape
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111111] border border-neutral-800 text-neutral-300 text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-[#eaff00]" /> 9:16 Vertical
            </span>
          </div>
        </div>

        {/* Bento Grid: 16:9 on Left (8 cols), 9:16 on Right (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
          {/* ============================================================= */}
          {/* LEFT SECTION: 16:9 Widescreen Video Showcase                  */}
          {/* ============================================================= */}
          <div className="lg:col-span-8 group bg-[#111111] border border-neutral-800 hover:border-neutral-700 rounded-3xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* 16:9 Video Container (Inline Preview) */}
              {playingInline === "left" ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl border border-neutral-800/80">
                  {(() => {
                    const formatted = formatVideoUrl(leftVideo.videoUrl, true);
                    if (formatted.type === "video") {
                      return (
                        <video
                          src={formatted.src}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      );
                    }
                    return (
                      <iframe
                        className="w-full h-full"
                        src={formatted.src}
                        title={leftVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  })()}

                  {/* Close / Return to Preview button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingInline(null);
                    }}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/80 hover:bg-neutral-900 text-neutral-300 hover:text-[#eaff00] transition-colors border border-neutral-700/80 shadow-lg backdrop-blur-md"
                    title="Close preview"
                    aria-label="Close preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setPlayingInline("left")}
                  className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 shadow-xl cursor-pointer group/player border border-neutral-800/80"
                >
                  {leftVideo.thumbnail ? (
                    <img
                      src={leftVideo.thumbnail}
                      alt={leftVideo.title}
                      className="w-full h-full object-cover group-hover/player:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        // Fallback gradient if thumbnail URL fails
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-950" />
                  )}

                  {/* Ambient vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#eaff00] text-black flex items-center justify-center shadow-2xl transform group-hover/player:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 ml-1 fill-black text-black" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-neutral-800">
                      <Monitor className="w-3 h-3 text-[#eaff00]" /> 16:9 Widescreen
                    </span>
                    <span className="bg-black/80 backdrop-blur-md text-[#eaff00] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-neutral-800">
                      {leftVideo.category}
                    </span>
                  </div>

                  {/* Bottom Duration Badge */}
                  {leftVideo.duration && (
                    <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-neutral-300 font-mono text-[11px] px-2 py-0.5 rounded border border-neutral-800">
                      {leftVideo.duration}
                    </span>
                  )}
                </div>
              )}

              {/* 16:9 Details */}
              <div className="pt-5 pb-1">
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-[#eaff00] transition-colors">
                  {leftVideo.title}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-[13px] mt-2 leading-relaxed font-normal">
                  {leftVideo.description}
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* RIGHT SECTION: 9:16 Vertical Video Showcase                   */}
          {/* ============================================================= */}
          <div className="lg:col-span-4 group bg-[#111111] border border-neutral-800 hover:border-neutral-700 rounded-3xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* 9:16 Smartphone Mockup Container (Inline Preview) */}
              {playingInline === "right" ? (
                <div className="relative aspect-[9/16] w-full max-w-[215px] sm:max-w-[220px] mx-auto rounded-3xl overflow-hidden bg-black shadow-2xl border-2 border-neutral-800/90">
                  {/* Subtle phone speaker notch indicator */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1 bg-neutral-800 rounded-full z-10 opacity-70 pointer-events-none" />

                  {(() => {
                    const formatted = formatVideoUrl(rightVideo.videoUrl, true);
                    if (formatted.type === "video") {
                      return (
                        <video
                          src={formatted.src}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      );
                    }
                    return (
                      <iframe
                        className="w-full h-full"
                        src={formatted.src}
                        title={rightVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  })()}

                  {/* Close / Return to Preview button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingInline(null);
                    }}
                    className="absolute top-4 right-3 z-20 p-2 rounded-full bg-black/80 hover:bg-neutral-900 text-neutral-300 hover:text-[#eaff00] transition-colors border border-neutral-700/80 shadow-lg backdrop-blur-md"
                    title="Close preview"
                    aria-label="Close preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setPlayingInline("right")}
                  className="relative aspect-[9/16] w-full max-w-[215px] sm:max-w-[220px] mx-auto rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl cursor-pointer group/player border-2 border-neutral-800/90"
                >
                  {/* Subtle phone speaker notch indicator */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1 bg-neutral-800 rounded-full z-10 opacity-70" />

                  {rightVideo.thumbnail ? (
                    <img
                      src={rightVideo.thumbnail}
                      alt={rightVideo.title}
                      className="w-full h-full object-cover group-hover/player:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800" />
                  )}

                  {/* Ambient vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#eaff00] text-black flex items-center justify-center shadow-2xl transform group-hover/player:scale-110 transition-transform duration-300">
                      <Play className="w-5 h-5 ml-0.5 fill-black text-black" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-neutral-800">
                      <Smartphone className="w-3 h-3 text-[#eaff00]" /> 9:16
                    </span>
                    <span className="bg-black/80 backdrop-blur-md text-[#eaff00] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-neutral-800">
                      {rightVideo.category}
                    </span>
                  </div>

                  {/* Bottom Duration Badge */}
                  {rightVideo.duration && (
                    <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-neutral-300 font-mono text-[11px] px-2 py-0.5 rounded border border-neutral-800">
                      {rightVideo.duration}
                    </span>
                  )}
                </div>
              )}

              {/* 9:16 Details */}
              <div className="pt-5 pb-1">
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-[#eaff00] transition-colors">
                  {rightVideo.title}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-[13px] mt-2 leading-relaxed font-normal">
                  {rightVideo.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Alternating Bento Grid (Left 9:16 + Right 16:9) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch mt-6 md:mt-8">
          {/* ============================================================= */}
          {/* ROW 2 LEFT SECTION: 9:16 Vertical Video Showcase              */}
          {/* ============================================================= */}
          <div className="lg:col-span-4 group bg-[#111111] border border-neutral-800 hover:border-neutral-700 rounded-3xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* 9:16 Smartphone Mockup Container (Inline Preview) */}
              {playingInline === "row2-left" ? (
                <div className="relative aspect-[9/16] w-full max-w-[215px] sm:max-w-[220px] mx-auto rounded-3xl overflow-hidden bg-black shadow-2xl border-2 border-neutral-800/90">
                  {/* Subtle phone speaker notch indicator */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1 bg-neutral-800 rounded-full z-10 opacity-70 pointer-events-none" />

                  {(() => {
                    const formatted = formatVideoUrl(row2LeftVideo.videoUrl, true);
                    if (formatted.type === "video") {
                      return (
                        <video
                          src={formatted.src}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      );
                    }
                    return (
                      <iframe
                        className="w-full h-full"
                        src={formatted.src}
                        title={row2LeftVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  })()}

                  {/* Close / Return to Preview button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingInline(null);
                    }}
                    className="absolute top-4 right-3 z-20 p-2 rounded-full bg-black/80 hover:bg-neutral-900 text-neutral-300 hover:text-[#eaff00] transition-colors border border-neutral-700/80 shadow-lg backdrop-blur-md"
                    title="Close preview"
                    aria-label="Close preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setPlayingInline("row2-left")}
                  className="relative aspect-[9/16] w-full max-w-[215px] sm:max-w-[220px] mx-auto rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl cursor-pointer group/player border-2 border-neutral-800/90"
                >
                  {/* Subtle phone speaker notch indicator */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1 bg-neutral-800 rounded-full z-10 opacity-70" />

                  {row2LeftVideo.thumbnail ? (
                    <img
                      src={row2LeftVideo.thumbnail}
                      alt={row2LeftVideo.title}
                      className="w-full h-full object-cover group-hover/player:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800" />
                  )}

                  {/* Ambient vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#eaff00] text-black flex items-center justify-center shadow-2xl transform group-hover/player:scale-110 transition-transform duration-300">
                      <Play className="w-5 h-5 ml-0.5 fill-black text-black" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-neutral-800">
                      <Smartphone className="w-3 h-3 text-[#eaff00]" /> 9:16
                    </span>
                    <span className="bg-black/80 backdrop-blur-md text-[#eaff00] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-neutral-800">
                      {row2LeftVideo.category}
                    </span>
                  </div>

                  {/* Bottom Duration Badge */}
                  {row2LeftVideo.duration && (
                    <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-neutral-300 font-mono text-[11px] px-2 py-0.5 rounded border border-neutral-800">
                      {row2LeftVideo.duration}
                    </span>
                  )}
                </div>
              )}

              {/* 9:16 Details */}
              <div className="pt-5 pb-1">
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-[#eaff00] transition-colors">
                  {row2LeftVideo.title}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-[13px] mt-2 leading-relaxed font-normal">
                  {row2LeftVideo.description}
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* ROW 2 RIGHT SECTION: 16:9 Widescreen Video Showcase           */}
          {/* ============================================================= */}
          <div className="lg:col-span-8 group bg-[#111111] border border-neutral-800 hover:border-neutral-700 rounded-3xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* 16:9 Video Container (Inline Preview) */}
              {playingInline === "row2-right" ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl border border-neutral-800/80">
                  {(() => {
                    const formatted = formatVideoUrl(row2RightVideo.videoUrl, true);
                    if (formatted.type === "video") {
                      return (
                        <video
                          src={formatted.src}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      );
                    }
                    return (
                      <iframe
                        className="w-full h-full"
                        src={formatted.src}
                        title={row2RightVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  })()}

                  {/* Close / Return to Preview button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingInline(null);
                    }}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/80 hover:bg-neutral-900 text-neutral-300 hover:text-[#eaff00] transition-colors border border-neutral-700/80 shadow-lg backdrop-blur-md"
                    title="Close preview"
                    aria-label="Close preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setPlayingInline("row2-right")}
                  className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 shadow-xl cursor-pointer group/player border border-neutral-800/80"
                >
                  {row2RightVideo.thumbnail ? (
                    <img
                      src={row2RightVideo.thumbnail}
                      alt={row2RightVideo.title}
                      className="w-full h-full object-cover group-hover/player:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-950" />
                  )}

                  {/* Ambient vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#eaff00] text-black flex items-center justify-center shadow-2xl transform group-hover/player:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 ml-1 fill-black text-black" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-neutral-800">
                      <Monitor className="w-3 h-3 text-[#eaff00]" /> 16:9 Widescreen
                    </span>
                    <span className="bg-black/80 backdrop-blur-md text-[#eaff00] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-neutral-800">
                      {row2RightVideo.category}
                    </span>
                  </div>

                  {/* Bottom Duration Badge */}
                  {row2RightVideo.duration && (
                    <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-neutral-300 font-mono text-[11px] px-2 py-0.5 rounded border border-neutral-800">
                      {row2RightVideo.duration}
                    </span>
                  )}
                </div>
              )}

              {/* 16:9 Details */}
              <div className="pt-5 pb-1">
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-[#eaff00] transition-colors">
                  {row2RightVideo.title}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-[13px] mt-2 leading-relaxed font-normal">
                  {row2RightVideo.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Section: Wide Bento Card below Projects */}
        <div id="about" className="mt-8 md:mt-10 bg-[#111111] border border-neutral-800 rounded-3xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5 text-[#eaff00]" />
              </div>
              <div>
                <h3 className="font-bold text-lg md:text-xl text-white tracking-tight">Tooling & Workflow</h3>
                <p className="text-xs md:text-sm text-neutral-400 font-normal mt-1 leading-relaxed">
                  Industry-standard post-production pipeline built for speed, color fidelity, and dynamic rhythm.
                </p>
              </div>
            </div>

            {/* Tight Flex Row for Software Tags */}
            <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
              {Array.from(new Set(servicesData.flatMap((s) => s.tools)))
                .filter((t) => ["DaVinci Resolve", "Audacity", "Photoshop"].includes(t))
                .map((tool) => {
                  const logoMap: Record<string, string> = {
                    "DaVinci Resolve": "/images/davinci.png",
                    Audacity: "/images/audacity.png",
                    Photoshop: "/images/photoshop.png",
                  };

                  return (
                    <span
                      key={tool}
                      className="flex items-center gap-2.5 px-4 py-2.5 bg-[#111] border border-neutral-800 rounded-xl text-neutral-300 font-bold text-xs tracking-tight hover:border-neutral-700 hover:text-white transition-all shadow-sm"
                    >
                      <img
                        src={logoMap[tool]}
                        alt={tool}
                        className="w-5 h-5 rounded-sm object-cover"
                      />
                      {tool}
                    </span>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Texture Transition & Ambient Glow */}
      <section id="pricing" className="relative w-full pt-12 md:pt-16 pb-20 md:pb-24 mt-0 md:-mt-2 mb-12 md:mb-16 overflow-hidden">
        {/* Top Luminous Beam Divider */}
        <div className="absolute top-0 left-0 right-0 luminous-divider" />

        {/* Top Soft Spotlight Accent */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-36 bg-[radial-gradient(ellipse_at_top,_rgba(234,255,0,0.18),transparent_70%)] blur-2xl" />

        {/* Multi-Layered Textured Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* Solid Base Layer (Completely covers old grid) */}
          <div className="absolute inset-0 bg-neutral-950" />

          {/* Dynamic Glowing Mesh */}
          <div className="absolute inset-0 pricing-glow-ambient" />

          {/* Dotted Texture with Radial Mask for Smooth Transition */}
          <div className="absolute inset-0 bg-dot-matrix mask-radial-fade opacity-70" />

          {/* Fine Diagonal Tech Scanlines */}
          <div className="absolute inset-0 bg-diagonal-hatch mask-edge-fade-y opacity-90" />
        </div>

        {/* Content Container */}
        <div className="relative max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              The Best Prices Ever
            </h2>
            <p className="text-neutral-400 text-sm md:text-base mt-3 max-w-lg mx-auto">
              Transparent, straightforward packages tailored for high-impact content creators.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
            {pricingData.map((tier, idx) => {
              const cardStyle =
                tier.theme === "blue"
                  ? "bg-[#0b274a] border border-blue-900 hover:border-blue-500/60 rounded-2xl p-7 md:p-8 relative overflow-hidden flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-blue-950/70"
                  : tier.theme === "red"
                    ? "bg-[#5c0a0a] border-2 border-dashed border-red-600 hover:border-red-500 rounded-2xl p-7 md:p-8 relative overflow-hidden flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-red-950/70"
                    : "bg-[#111] border border-neutral-800 hover:border-neutral-700 rounded-2xl p-7 md:p-8 relative overflow-hidden flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-black/80";

              const descStyle =
                tier.theme === "default"
                  ? "text-xs text-neutral-400 mt-3 leading-relaxed mb-6"
                  : "text-xs text-neutral-300 mt-3 leading-relaxed mb-6";

              const listStyle =
                tier.theme === "default"
                  ? "space-y-3 text-xs text-neutral-300"
                  : "space-y-3 text-xs text-neutral-200";

              return (
                <div key={tier.id} className={`${cardStyle} pricing-card-${idx + 1}`}>
                  {/* Shimmer Effect */}
                  <div className="price-card-shimmer" />

                  <div className="relative z-10">
                    <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                      {tier.name}
                    </h3>
                    <div className="mt-4 mb-2 flex items-baseline gap-2">
                      <span className="text-neutral-500 line-through">
                        {tier.originalPrice}
                      </span>
                      <span className="text-4xl font-bold text-white">
                        {tier.currentPrice}
                      </span>
                      {tier.taxNote && (
                        <span className="text-xs text-neutral-400 font-normal">
                          {tier.taxNote}
                        </span>
                      )}
                    </div>
                    <p className={descStyle}>
                      {tier.description}
                    </p>
                    <button className="w-full bg-[#eaff00] text-black font-bold py-3 px-4 rounded-xl hover:bg-[#d8ec00] transition-colors mb-6 shadow-sm">
                      {tier.buttonText}
                    </button>
                    <div className="text-xs text-neutral-500 mb-3.5 font-semibold uppercase tracking-wider">
                      {"WHAT'S INCLUDED:"}
                    </div>
                    <ul className={listStyle}>
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#eaff00] font-bold">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Luminous Beam Divider */}
        <div className="absolute bottom-0 left-0 right-0 luminous-divider" />
      </section>

      {/* Interactive Quick Edit / Add Video Modal */}
      {editingTarget && (
        <div
          onClick={() => setEditingTarget(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <div className="flex items-center gap-2.5">
                {editingTarget === "left" || editingTarget === "row2-right" ? (
                  <Monitor className="w-5 h-5 text-[#eaff00]" />
                ) : (
                  <Smartphone className="w-5 h-5 text-[#eaff00]" />
                )}
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {editingTarget === "left" && "Edit 16:9 Video (Top Left)"}
                  {editingTarget === "right" && "Edit 9:16 Video (Top Right)"}
                  {editingTarget === "row2-left" && "Edit 9:16 Video (Bottom Left)"}
                  {editingTarget === "row2-right" && "Edit 16:9 Video (Bottom Right)"}
                </h3>
              </div>
              <button
                onClick={() => setEditingTarget(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  Video Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#eaff00] transition-colors"
                  placeholder="e.g., Cinematic Travel Commercial"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  Category / Tag
                </label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#eaff00] transition-colors"
                  placeholder="e.g., Commercial, YouTube, Reels"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  Video URL (YouTube, Shorts, Vimeo, or .mp4)
                </label>
                <input
                  type="text"
                  value={editForm.videoUrl}
                  onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#eaff00] transition-colors font-mono text-[11px]"
                  placeholder="e.g. https://www.youtube.com/watch?v=... or .mp4 URL"
                />
                <span className="text-[10px] text-neutral-500 mt-1.5 block">
                  Accepts regular YouTube links, YouTube Shorts, Vimeo, or direct MP4/WebM video files.
                </span>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  Thumbnail / Poster Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={editForm.thumbnail}
                  onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#eaff00] transition-colors font-mono text-[11px]"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#eaff00] transition-colors leading-relaxed"
                  placeholder="Describe the editing techniques, pacing, sound design..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 mt-5 border-t border-neutral-800">
              <button
                type="button"
                onClick={resetToDefault}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Default
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingTarget(null)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEditor}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#eaff00] hover:bg-[#d8ec00] text-black rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <Check className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section id="faq" className="pt-6 md:pt-10 pb-16 md:pb-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Got Questions?
          </h2>
          <p className="text-neutral-400 text-base md:text-lg mt-3">
            Everything you need to know about turnaround, revisions, and workflow.
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQS.map((faq, index) => {
            const isExpanded = openFaq === index;
            return (
              <div
                key={index}
                onClick={() => setOpenFaq(isExpanded ? null : index)}
                className={`group bg-[#111] border rounded-2xl p-6 md:p-7 cursor-pointer transition-all duration-300 ${isExpanded
                    ? "border-[#eaff00]/40 bg-[#141414] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                    : "border-neutral-800 hover:border-neutral-700 hover:bg-[#151515]"
                  }`}
              >
                <div className="flex items-center justify-between gap-4 select-none">
                  <span className={`font-bold uppercase tracking-wide text-base md:text-lg transition-colors duration-200 ${isExpanded ? "text-white" : "text-white group-hover:text-neutral-200"
                    }`}>
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${isExpanded
                        ? "bg-[#eaff00] text-black rotate-45 shadow-[0_0_12px_rgba(234,255,0,0.25)]"
                        : "bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700 group-hover:text-white rotate-0"
                      }`}
                  >
                    <Plus className="w-4 h-4 transition-transform duration-300" />
                  </div>
                </div>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-neutral-400 text-base pt-4 mt-4 border-t border-neutral-800/80 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Section & Floating Widget Wrapper */}
      <div className="relative w-full bg-neutral-950 border-t-2 border-neutral-700/60">
        {/* Contact Section / Compact Footer */}
        <footer ref={footerRef} id="contact" className="py-16 md:py-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-16 text-sm text-neutral-400">
          {/* Left Column */}
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs text-white font-bold overflow-hidden">
                <Film className="w-4 h-4 text-[#eaff00]" />
              </div>
              <span className="font-bold text-white text-base">YOUR NAME</span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Video Editor & Motion Designer specialized in high-retention social content, commercials, and digital storytelling.
            </p>

            <div className="text-xs sm:text-sm">
              <span className="text-neutral-500">Get in Touch: </span>
              <a href="mailto:your-email@example.com" className="text-neutral-200 hover:text-[#eaff00] transition-colors font-medium">
                your-email@example.com
              </a>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-400 hover:text-[#eaff00] transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-400 hover:text-[#eaff00] transition-colors"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-400 hover:text-[#eaff00] transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: 2-Column Links Grid */}
          <div className="grid grid-cols-2 gap-10 sm:gap-16 text-xs sm:text-sm">
            {/* Col 1: Sections */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold tracking-wider uppercase text-xs">Sections</span>
              <div className="flex flex-col gap-2.5">
                <a href="#work" className="hover:text-[#eaff00] transition-colors py-0.5">See My Services</a>
                <a href="#about" className="hover:text-[#eaff00] transition-colors py-0.5">Tooling &amp; Workflow</a>
                <a href="#contact" className="hover:text-[#eaff00] transition-colors py-0.5">Contact</a>
              </div>
            </div>

            {/* Col 2: Pages */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold tracking-wider uppercase text-xs">Pages</span>
              <div className="flex flex-col gap-2.5">
                <a href="#" className="hover:text-[#eaff00] transition-colors py-0.5">Home</a>
                <a href="#work" className="hover:text-[#eaff00] transition-colors py-0.5">Archive</a>
                <a href="#" className="hover:text-[#eaff00] transition-colors py-0.5">Showreel</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Message Widget */}
        <a
          href="mailto:your-email@example.com"
          onClick={() => {
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`left-6 z-50 flex items-center gap-3.5 bg-white text-black p-2.5 pr-6 rounded-full shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300 no-underline ${isDocked ? 'absolute -top-10' : 'fixed bottom-6'}`}
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-400 border-2 border-white rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">Message Your Name</span>
            <span className="text-xs text-gray-500 font-medium">Away • Avg. response time: 1 Hour</span>
          </div>
        </a>
      </div>
    </div>
  );
}