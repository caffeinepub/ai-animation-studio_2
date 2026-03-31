import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Download,
  FileText,
  Film,
  ImagePlus,
  LayoutGrid,
  Loader2,
  Maximize2,
  Mic,
  Music,
  Palette,
  Pause,
  Play,
  Settings2,
  Sparkles,
  Upload,
  Volume2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type SceneStatus = "pending" | "generating" | "rendering" | "completed";

interface Scene {
  id: number;
  title: string;
  status: SceneStatus;
  progress: number;
  thumb: string;
  duration: string;
}

const INITIAL_SCENES: Scene[] = [
  {
    id: 1,
    title: "Scene 1",
    status: "pending",
    progress: 0,
    thumb: "/assets/generated/scene1-thumb.dim_320x180.jpg",
    duration: "0:08",
  },
  {
    id: 2,
    title: "Scene 2",
    status: "pending",
    progress: 0,
    thumb: "/assets/generated/scene2-thumb.dim_320x180.jpg",
    duration: "0:07",
  },
  {
    id: 3,
    title: "Scene 3",
    status: "pending",
    progress: 0,
    thumb: "/assets/generated/scene3-thumb.dim_320x180.jpg",
    duration: "0:09",
  },
  {
    id: 4,
    title: "Scene 4",
    status: "pending",
    progress: 0,
    thumb: "/assets/generated/scene4-thumb.dim_320x180.jpg",
    duration: "0:06",
  },
];

const DEFAULT_SCRIPT = `In a world where imagination meets artificial intelligence, 
we journey through breathtaking landscapes that have never 
been seen by human eyes.

The camera sweeps across endless purple horizons as the 
narrator begins: "Every great story starts with a single 
frame. Today, we paint our story with light."

Cut to: Close-up of a glowing crystal orb, reflecting
infinity. The music swells...`;

function StatusBadge({ status }: { status: SceneStatus }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/25">
        <CheckCircle2 className="w-2.5 h-2.5" /> Completed
      </span>
    );
  }
  if (status === "rendering") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/25">
        <Loader2 className="w-2.5 h-2.5 animate-spin" /> Rendering
      </span>
    );
  }
  if (status === "generating") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/25">
        <Loader2 className="w-2.5 h-2.5 animate-spin" /> Generating
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-white/40 border border-white/10">
      <Circle className="w-2.5 h-2.5" /> Pending
    </span>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"script" | "upload">("script");
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [storyboarding, setStoryboarding] = useState("auto");
  const [voiceover, setVoiceover] = useState("cinematic");
  const [bgMusic, setBgMusic] = useState("epic");
  const [style, setStyle] = useState("cinematic");
  const [quality, setQuality] = useState("4k");
  const [activeNavLink, setActiveNavLink] = useState("Create");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleGenerate = useCallback(() => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationDone(false);
    setScenes(
      INITIAL_SCENES.map((s) => ({ ...s, status: "pending", progress: 0 })),
    );
    toast("Generation started", {
      description: "AI is processing your request...",
    });

    // Simulate generation: each scene takes ~2s
    const allTimers: ReturnType<typeof setTimeout>[] = [];

    scenes.forEach((_, idx) => {
      const startDelay = idx * 2000;
      const genDuration = 1500;
      const renderDuration = 1000;

      // Start generating
      const t1 = setTimeout(() => {
        setScenes((prev) =>
          prev.map((s) =>
            s.id === idx + 1 ? { ...s, status: "generating", progress: 0 } : s,
          ),
        );
        // Animate progress
        let prog = 0;
        const interval = setInterval(() => {
          prog = Math.min(prog + 6, 65);
          setScenes((prev) =>
            prev.map((s) => (s.id === idx + 1 ? { ...s, progress: prog } : s)),
          );
          if (prog >= 65) clearInterval(interval);
        }, 80);
        allTimers.push(interval as unknown as ReturnType<typeof setTimeout>);
      }, startDelay);

      // Start rendering
      const t2 = setTimeout(() => {
        setScenes((prev) =>
          prev.map((s) =>
            s.id === idx + 1 ? { ...s, status: "rendering", progress: 65 } : s,
          ),
        );
        let prog = 65;
        const interval2 = setInterval(() => {
          prog = Math.min(prog + 5, 100);
          setScenes((prev) =>
            prev.map((s) => (s.id === idx + 1 ? { ...s, progress: prog } : s)),
          );
          if (prog >= 100) clearInterval(interval2);
        }, 60);
        allTimers.push(interval2 as unknown as ReturnType<typeof setTimeout>);
      }, startDelay + genDuration);

      // Complete
      const t3 = setTimeout(
        () => {
          setScenes((prev) =>
            prev.map((s) =>
              s.id === idx + 1
                ? { ...s, status: "completed", progress: 100 }
                : s,
            ),
          );
          if (idx === 3) {
            setIsGenerating(false);
            setGenerationDone(true);
            toast.success("Video generated!", {
              description: "All scenes are ready. You can now export.",
            });
          }
        },
        startDelay + genDuration + renderDuration,
      );

      allTimers.push(t1, t2, t3);
    });

    intervalsRef.current = allTimers;
  }, [isGenerating, scenes]);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    toast.success("Image uploaded", { description: file.name });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const navLinks = [
    "Dashboard",
    "Create",
    "My Projects",
    "Pricing",
    "Community",
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--app-bg)" }}
    >
      <Toaster richColors position="top-right" />

      {/* TOP NAV */}
      <header
        className="sticky top-0 z-50 w-full border-b"
        style={{
          background: "oklch(9% 0.022 260 / 0.95)",
          borderColor: "var(--border-subtle)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-[1340px] mx-auto px-6 h-14 flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm glow-purple-sm">
              A
            </div>
            <span
              className="font-bold text-base tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Animate<span className="gradient-text">AI</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <button
                key={link}
                type="button"
                data-ocid={`nav.${link.toLowerCase().replace(" ", "_")}.link`}
                onClick={() => setActiveNavLink(link)}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeNavLink === link ? "text-white" : "hover:text-white"
                }`}
                style={{
                  color:
                    activeNavLink === link
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  background:
                    activeNavLink === link
                      ? "oklch(20% 0.04 270)"
                      : "transparent",
                  borderBottom:
                    activeNavLink === link
                      ? "2px solid var(--accent-purple)"
                      : "2px solid transparent",
                  borderRadius: activeNavLink === link ? "6px 6px 0 0" : "6px",
                }}
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
              style={{ color: "var(--text-secondary)" }}
            >
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                AJ
              </div>
              <span
                className="text-sm hidden sm:block"
                style={{ color: "var(--text-secondary)" }}
              >
                Alex J.
              </span>
              <ChevronDown
                className="w-3.5 h-3.5"
                style={{ color: "var(--text-secondary)" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-[1340px] mx-auto w-full px-6 py-6">
        {/* Page title */}
        <div className="mb-6">
          <h1
            className="text-[28px] font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Create New Video
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Transform your ideas into stunning AI-generated animations
          </p>
        </div>

        {/* 3-Column Workspace */}
        <div className="grid grid-cols-[320px_1fr_280px] gap-4 items-start">
          {/* ===== LEFT PANEL ===== */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl p-4 card-surface">
              {/* Tabs */}
              <div
                className="flex mb-4 border-b"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <button
                  type="button"
                  data-ocid="create.upload_tab.tab"
                  onClick={() => setActiveTab("upload")}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === "upload"
                      ? "border-purple-500"
                      : "border-transparent"
                  }`}
                  style={{
                    color:
                      activeTab === "upload"
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                  }}
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Assets
                </button>
                <button
                  type="button"
                  data-ocid="create.script_tab.tab"
                  onClick={() => setActiveTab("script")}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === "script"
                      ? "border-purple-500"
                      : "border-transparent"
                  }`}
                  style={{
                    color:
                      activeTab === "script"
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                  }}
                >
                  <FileText className="w-3.5 h-3.5" /> Write Script
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "script" ? (
                  <motion.div
                    key="script"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Textarea
                      data-ocid="create.script.textarea"
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      placeholder="Write your animation script here..."
                      className="min-h-[180px] text-sm resize-none"
                      style={{
                        background: "oklch(9% 0.022 260)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <p
                      className="text-[11px] mt-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {script.length} characters · ~
                      {Math.ceil(script.split(" ").length / 150)} min read
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      type="button"
                      data-ocid="create.upload.dropzone"
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`min-h-[180px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                        isDragging
                          ? "border-purple-500 bg-purple-500/5"
                          : "border-white/10 hover:border-purple-500/50 hover:bg-white/[0.02]"
                      }`}
                    >
                      {uploadedImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={uploadedImage}
                            alt="Uploaded"
                            className="w-full h-36 object-cover rounded-md"
                          />
                          <p
                            className="text-xs mt-2 text-center"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Click to replace
                          </p>
                        </div>
                      ) : (
                        <>
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ background: "oklch(18% 0.04 270)" }}
                          >
                            <ImagePlus
                              className="w-5 h-5"
                              style={{ color: "var(--accent-purple)" }}
                            />
                          </div>
                          <div className="text-center">
                            <p
                              className="text-sm font-medium"
                              style={{ color: "var(--text-primary)" }}
                            >
                              Drop image here
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              PNG, JPG, WEBP up to 10MB
                            </p>
                          </div>
                          <Button
                            data-ocid="create.upload.upload_button"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            style={{
                              borderColor: "var(--border-subtle)",
                              color: "var(--text-secondary)",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            <Upload className="w-3 h-3 mr-1" /> Browse Files
                          </Button>
                        </>
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0])
                          handleFileChange(e.target.files[0]);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Options */}
            <div className="rounded-xl p-4 card-surface flex flex-col gap-3">
              <h3
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-secondary)" }}
              >
                Settings
              </h3>

              <OptionRow
                icon={<LayoutGrid className="w-3.5 h-3.5" />}
                label="Storyboarding"
              >
                <Select value={storyboarding} onValueChange={setStoryboarding}>
                  <SelectTrigger
                    data-ocid="create.storyboarding.select"
                    className="h-7 text-xs w-[130px]"
                    style={{
                      background: "oklch(9% 0.022 260)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "var(--card-surface)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <SelectItem value="auto">Auto Generate</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                  </SelectContent>
                </Select>
              </OptionRow>

              <OptionRow
                icon={<Mic className="w-3.5 h-3.5" />}
                label="Voiceover"
              >
                <Select value={voiceover} onValueChange={setVoiceover}>
                  <SelectTrigger
                    data-ocid="create.voiceover.select"
                    className="h-7 text-xs w-[130px]"
                    style={{
                      background: "oklch(9% 0.022 260)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "var(--card-surface)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="documentary">Documentary</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </OptionRow>

              <OptionRow
                icon={<Music className="w-3.5 h-3.5" />}
                label="Background Music"
              >
                <Select value={bgMusic} onValueChange={setBgMusic}>
                  <SelectTrigger
                    data-ocid="create.bgmusic.select"
                    className="h-7 text-xs w-[130px]"
                    style={{
                      background: "oklch(9% 0.022 260)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "var(--card-surface)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <SelectItem value="epic">Epic Orchestral</SelectItem>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </OptionRow>

              <OptionRow
                icon={<Palette className="w-3.5 h-3.5" />}
                label="Visual Style"
              >
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger
                    data-ocid="create.style.select"
                    className="h-7 text-xs w-[130px]"
                    style={{
                      background: "oklch(9% 0.022 260)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "var(--card-surface)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="painterly">Painterly</SelectItem>
                  </SelectContent>
                </Select>
              </OptionRow>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              data-ocid="create.generate.primary_button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest text-white transition-all ${
                isGenerating
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
              } ${!isGenerating ? "pulse-glow" : ""}`}
              style={{
                background:
                  "linear-gradient(135deg, oklch(50% 0.22 295), oklch(62% 0.22 302), oklch(65% 0.25 328))",
              }}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> Generate Video
                </span>
              )}
            </button>

            {/* Settings row */}
            <div
              className="rounded-lg px-3 py-2 flex items-center justify-between text-[11px]"
              style={{
                background: "oklch(12% 0.025 258)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <span style={{ color: "var(--text-secondary)" }}>
                Aspect Ratio:{" "}
                <span style={{ color: "var(--text-primary)" }}>16:9</span>
              </span>
              <span style={{ color: "var(--text-secondary)" }}>
                Style:{" "}
                <span style={{ color: "var(--text-primary)" }}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </span>
              </span>
              <span style={{ color: "var(--text-secondary)" }}>
                Length:{" "}
                <span style={{ color: "var(--text-primary)" }}>30s</span>
              </span>
            </div>
          </div>

          {/* ===== CENTER PANEL ===== */}
          <div className="flex flex-col gap-4">
            {/* Video Preview */}
            <div className="rounded-xl overflow-hidden card-surface">
              <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Film
                    className="w-4 h-4"
                    style={{ color: "var(--accent-purple)" }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Generation Preview
                  </span>
                </div>
                {generationDone && (
                  <Badge className="text-[10px] bg-green-500/15 text-green-400 border-green-500/25">
                    Ready
                  </Badge>
                )}
              </div>

              {/* 16:9 Preview Area */}
              <div
                className="relative"
                style={{ aspectRatio: "16/9", background: "#04060F" }}
              >
                <AnimatePresence mode="wait">
                  {uploadedImage ? (
                    <motion.img
                      key="upload-preview"
                      src={uploadedImage}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  ) : (
                    <motion.img
                      key="default-preview"
                      src="/assets/generated/animation-preview-placeholder.dim_800x450.jpg"
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </AnimatePresence>

                {/* Overlay when generating */}
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                      style={{
                        background: "oklch(5% 0.02 260 / 0.75)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center glow-purple mb-3">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        AI is generating your video
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Processing{" "}
                        {scenes.filter((s) => s.status !== "pending").length}/
                        {scenes.length} scenes...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Video controls overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-3"
                  style={{
                    background:
                      "linear-gradient(to top, oklch(5% 0.02 260 / 0.95), transparent)",
                  }}
                >
                  <button
                    type="button"
                    data-ocid="preview.play.toggle"
                    onClick={() => setIsPlaying((v) => !v)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <div
                    className="flex-1 h-1 rounded-full"
                    style={{ background: "var(--border-subtle)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: generationDone ? "0%" : "0%",
                        background:
                          "linear-gradient(90deg, var(--accent-violet), var(--accent-magenta))",
                      }}
                    />
                  </div>
                  <span
                    className="text-[11px]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    0:00 / 0:30
                  </span>
                  <Volume2
                    className="w-4 h-4"
                    style={{ color: "var(--text-secondary)" }}
                  />
                  <Maximize2
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--text-secondary)" }}
                  />
                </div>
              </div>
            </div>

            {/* Scene Grid */}
            <div className="rounded-xl p-4 card-surface">
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Scene Timeline
                </h3>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {scenes.filter((s) => s.status === "completed").length}/
                  {scenes.length} completed
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {scenes.map((scene, i) => (
                  <motion.div
                    key={scene.id}
                    data-ocid={`scene.item.${i + 1}`}
                    layout
                    className="rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-1"
                    style={{
                      background: "oklch(9% 0.022 260)",
                      border: "1px solid var(--border-subtle)",
                      // ringColor removed
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative" style={{ aspectRatio: "16/9" }}>
                      <img
                        src={scene.thumb}
                        alt={scene.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: "oklch(5% 0.02 260 / 0.4)" }}
                      />
                      <div className="absolute top-1.5 left-1.5">
                        <StatusBadge status={scene.status} />
                      </div>
                      <div
                        className="absolute bottom-1.5 right-1.5 text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          background: "oklch(5% 0.02 260 / 0.8)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {scene.duration}
                      </div>
                    </div>
                    <div className="px-2 py-1.5">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {scene.title}
                        </span>
                        <span
                          className="text-[10px]"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {scene.progress}%
                        </span>
                      </div>
                      <div
                        className="h-1 rounded-full overflow-hidden"
                        style={{ background: "var(--border-subtle)" }}
                      >
                        <motion.div
                          className={`h-full rounded-full ${scene.status !== "completed" && scene.status !== "pending" ? "progress-shimmer" : ""}`}
                          style={{
                            background:
                              scene.status === "completed"
                                ? "oklch(65% 0.18 145)"
                                : scene.status === "pending"
                                  ? "transparent"
                                  : undefined,
                          }}
                          animate={{ width: `${scene.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== RIGHT PANEL ===== */}
          <div className="flex flex-col gap-4">
            {/* Quick Generate */}
            <button
              type="button"
              data-ocid="controls.generate.primary_button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, oklch(50% 0.22 295), oklch(65% 0.25 328))",
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                {isGenerating ? "Generating..." : "Generate"}
              </span>
            </button>

            {/* Video Controls / Scene Timeline */}
            <div className="rounded-xl p-4 card-surface">
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Video Controls
              </h3>
              <div className="flex flex-col gap-0">
                {scenes.map((scene, i) => (
                  <div
                    key={scene.id}
                    data-ocid={`controls.scene.item.${i + 1}`}
                    className="flex items-start gap-3 pb-3"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all"
                        style={{
                          borderColor:
                            scene.status === "completed"
                              ? "oklch(65% 0.18 145)"
                              : scene.status !== "pending"
                                ? "var(--accent-purple)"
                                : "var(--border-subtle)",
                          background:
                            scene.status === "completed"
                              ? "oklch(65% 0.18 145 / 0.15)"
                              : "transparent",
                        }}
                      >
                        {scene.status === "completed" ? (
                          <CheckCircle2
                            className="w-3 h-3"
                            style={{ color: "oklch(65% 0.18 145)" }}
                          />
                        ) : scene.status !== "pending" ? (
                          <Loader2
                            className="w-3 h-3 animate-spin"
                            style={{ color: "var(--accent-purple)" }}
                          />
                        ) : (
                          <Circle
                            className="w-2.5 h-2.5"
                            style={{ color: "var(--border-subtle)" }}
                          />
                        )}
                      </div>
                      {i < scenes.length - 1 && (
                        <div
                          className="w-0.5 flex-1 mt-1 rounded-full"
                          style={{
                            minHeight: "24px",
                            background:
                              scene.status === "completed"
                                ? "oklch(65% 0.18 145 / 0.4)"
                                : "var(--border-subtle)",
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-medium"
                          style={{
                            color:
                              scene.status !== "pending"
                                ? "var(--text-primary)"
                                : "var(--text-secondary)",
                          }}
                        >
                          {scene.title}
                        </span>
                        <span
                          className="text-[10px]"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {scene.duration}
                        </span>
                      </div>
                      {scene.status !== "pending" && (
                        <div
                          className="mt-1.5 h-0.5 rounded-full overflow-hidden"
                          style={{ background: "var(--border-subtle)" }}
                        >
                          <motion.div
                            className={`h-full rounded-full ${scene.status !== "completed" ? "progress-shimmer" : ""}`}
                            style={{
                              background:
                                scene.status === "completed"
                                  ? "oklch(65% 0.18 145)"
                                  : undefined,
                            }}
                            animate={{ width: `${scene.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export */}
            <div className="rounded-xl p-4 card-surface">
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Export Video
              </h3>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger
                  data-ocid="export.quality.select"
                  className="w-full h-8 text-xs mb-3"
                  style={{
                    background: "oklch(9% 0.022 260)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-primary)",
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "var(--card-surface)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <SelectItem value="4k">High 4K 60fps</SelectItem>
                  <SelectItem value="1080p">HD 1080p 30fps</SelectItem>
                  <SelectItem value="720p">720p 30fps</SelectItem>
                  <SelectItem value="web">Web Optimized</SelectItem>
                </SelectContent>
              </Select>
              <Button
                data-ocid="export.download.primary_button"
                disabled={!generationDone}
                className="w-full h-8 text-xs font-bold uppercase tracking-wider"
                style={{
                  background: generationDone
                    ? "linear-gradient(135deg, oklch(50% 0.22 295), oklch(65% 0.25 328))"
                    : undefined,
                }}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                {generationDone ? "Export Now" : "Generate First"}
              </Button>
            </div>

            {/* Add Effects */}
            <div className="rounded-xl p-3 card-surface flex flex-col gap-2">
              <ActionRow
                icon={<Sparkles className="w-3.5 h-3.5" />}
                label="Add Effects"
                ocid="controls.effects.button"
              />
              <div
                className="h-px"
                style={{ background: "var(--border-subtle)" }}
              />
              <ActionRow
                icon={<Clock className="w-3.5 h-3.5" />}
                label="Adjust Timing"
                ocid="controls.timing.button"
              />
              <div
                className="h-px"
                style={{ background: "var(--border-subtle)" }}
              />
              <ActionRow
                icon={<Settings2 className="w-3.5 h-3.5" />}
                label="Advanced Settings"
                ocid="controls.settings.button"
              />
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="mt-8 border-t"
        style={{
          borderColor: "var(--border-subtle)",
          background: "oklch(8% 0.018 260)",
        }}
      >
        <div className="max-w-[1340px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            <span>© {new Date().getFullYear()} AnimateAI</span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Terms
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span style={{ color: "var(--text-secondary)" }}>Status:</span>
            <span
              className="flex items-center gap-1"
              style={{ color: "oklch(65% 0.18 145)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                style={{ boxShadow: "0 0 6px oklch(65% 0.18 145)" }}
              />
              AI Systems Operational
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: "var(--accent-purple)" }}
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function OptionRow({
  icon,
  label,
  children,
}: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span style={{ color: "var(--text-secondary)" }}>{icon}</span>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function ActionRow({
  icon,
  label,
  ocid,
}: { icon: React.ReactNode; label: string; ocid: string }) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      className="w-full flex items-center justify-between px-1 py-1 rounded-lg transition-all hover:bg-white/5 group"
    >
      <div className="flex items-center gap-2">
        <span style={{ color: "var(--accent-purple)" }}>{icon}</span>
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {label}
        </span>
      </div>
      <ArrowRight
        className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "var(--text-secondary)" }}
      />
    </button>
  );
}
