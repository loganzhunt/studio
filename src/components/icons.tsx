import type { LucideIcon } from "lucide-react";
import {
  Home,
  Triangle,
  ScrollText,
  Library,
  Users,
  Sparkles,
  Wand2,
  Bookmark,
  Info as LucideInfo, // Aliased import
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  Filter,
  Check,
  Copy,
  Share2,
  Download,
  Printer,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  PlusCircle,
  MinusCircle,
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  List,
  BarChart3,
  ChevronsUpDown,
  User,
  LogOut,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Atom,
  Brain,
  Heart,
  BookOpen,
  Globe,
  Target,
  Zap,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="currentColor"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: "hsl(var(--domain-ontology))", stopOpacity: 1 }}
          />
          <stop
            offset="16%"
            style={{
              stopColor: "hsl(var(--domain-epistemology))",
              stopOpacity: 1,
            }}
          />
          <stop
            offset="33%"
            style={{
              stopColor: "hsl(var(--domain-praxeology))",
              stopOpacity: 1,
            }}
          />
          <stop
            offset="50%"
            style={{ stopColor: "hsl(var(--domain-axiology))", stopOpacity: 1 }}
          />
          <stop
            offset="67%"
            style={{
              stopColor: "hsl(var(--domain-mythology))",
              stopOpacity: 1,
            }}
          />
          <stop
            offset="84%"
            style={{
              stopColor: "hsl(var(--domain-cosmology))",
              stopOpacity: 1,
            }}
          />
          <stop
            offset="100%"
            style={{
              stopColor: "hsl(var(--domain-teleology))",
              stopOpacity: 1,
            }}
          />
        </linearGradient>
      </defs>
      <path
        fill="url(#logoGradient)"
        d="M50 5 L95 80 L5 80 Z M50 20 L82 70 L18 70 Z M50 35 L70 60 L30 60 Z M50 50 L58 55 L42 55 Z"
      />
    </svg>
  ),
  home: Home,
  assessment: ScrollText,
  results: BarChart3,
  dashboard: LayoutGrid,
  codex: Library,
  facet: Triangle,
  archetypes: Users,
  builder: Wand2,
  saved: Bookmark,
  about: LucideInfo, // Use aliased import
  settings: Settings,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  menu: Menu,
  close: X,
  sun: Sun,
  moon: Moon,
  search: Search,
  filter: Filter,
  check: Check,
  copy: Copy,
  share: Share2,
  download: Download,
  print: Printer,
  view: Eye,
  hide: EyeOff,
  edit: Edit3,
  delete: Trash2,
  add: PlusCircle,
  remove: MinusCircle,
  sliders: SlidersHorizontal,
  reset: RotateCcw,
  grid: LayoutGrid,
  list: List,
  sort: ChevronsUpDown,
  sparkles: Sparkles,
  user: User,
  logout: LogOut,
  loader: Loader2,
  info: LucideInfo, // Use aliased import
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  bookmark: Bookmark,
  lightbulb: Lightbulb,
  atom: Atom,
  brain: Brain,
  heart: Heart,
  bookOpen: BookOpen,
  globe: Globe,
  target: Target,
  zap: Zap,
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  ),
};
