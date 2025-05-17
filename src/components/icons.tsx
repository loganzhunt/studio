
import type { LucideIcon } from 'lucide-react';
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
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" {...props}>
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--domain-ontology))', stopOpacity: 1 }} />
          <stop offset="16%" style={{ stopColor: 'hsl(var(--domain-epistemology))', stopOpacity: 1 }} />
          <stop offset="33%" style={{ stopColor: 'hsl(var(--domain-praxeology))', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: 'hsl(var(--domain-axiology))', stopOpacity: 1 }} />
          <stop offset="67%" style={{ stopColor: 'hsl(var(--domain-mythology))', stopOpacity: 1 }} />
          <stop offset="84%" style={{ stopColor: 'hsl(var(--domain-cosmology))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--domain-teleology))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path fill="url(#logoGradient)" d="M50 5 L95 80 L5 80 Z M50 20 L82 70 L18 70 Z M50 35 L70 60 L30 60 Z M50 50 L58 55 L42 55 Z" />
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
  about: LucideInfo,      // Use aliased import
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
};
