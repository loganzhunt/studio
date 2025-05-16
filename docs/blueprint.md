# **App Name**: Meta-Prism

## Core Features:

- Expanded Assessment Infrastructure: Structure the assessment as 7 facet-specific sections, each with 10 Likert-scale questions. Enable section-based navigation with “Next” and “Previous” buttons. Add real-time progress tracking. Store domain scores as normalized values. Ensure the assessment state is persistently saved to localStorage.
- Triangle Visualization Enhancements: Create a reusable <TriangleChart /> component to draw 7 horizontally stacked bands, each corresponding to a symbolic domain (RO: Ontology, Y: Axiology, etc.). Optionally vary brightness, opacity, or band height based on score strength. Include responsive layout and SVG rendering. Style with a subtle glassmorphic container.
- Expanded Data Handling & Save Features: Use localStorage to save all responses, domain averages, and custom worldview titles. Add ability to name + save custom worldview profiles. Include option to review and compare previously saved profiles.
- Full Site Structure: Include the following pages with placeholder content and working navigation: /assessment, /results, /dashboard, /codex, /facet/[facetName], /archetypes, /builder, /saved-worldviews, /about. Include a responsive navigation menu with icons and dropdown for mobile view.
- Codex Card Interaction + Visual Logic: Codex cards should each include: Worldview title, Short summary (text clamped or expandable), Triangle visualization specific to worldview’s facet scores, and “Facet Details” button. Enable filtering/sorting by category (religious, philosophical, archetypal) and facet emphasis. Add responsive grid behavior and consistent card sizing.
- Facet Selector Experience: On `/facet/[facetName]`, show worldview options filtered by domain. User can select one worldview per facet, stored in their active worldview profile. Display a visual indicator (e.g., checkmark or border glow) on selected worldview. Allow user to review and edit selected worldviews across all 7 facets.
- Archetype Matching & Exploration (MVP-Level): On `/archetypes`, allow browsing of predefined symbolic/archetypal profiles. Include static triangle visuals for each archetype. Future functionality: Match closest archetype based on user triangle similarity.
- Builder Mode Logic: On `/builder`, allow users to select one worldview per facet from the Codex. Upon completion, generate a triangle from their chosen systems. Save the builder-created worldview under a unique title. Treat builder flow as an alternative to the full assessment.
- State Management & Local Storage Strategy: Implement a central worldview state object (in Context or global store) with: `facetSelections`: object with 7 keys (ontology, epistemology, etc.), `domainScores`: object of calculated facet values, and `savedWorldviews`: array of custom worldview profiles. Mirror this object in localStorage for persistent saves. Allow users to update, rename, delete saved worldviews.
- Authentication & User Profiles (Future-Ready): Include Firebase Auth hooks for optional sign-in and user profiles. Allow anonymous use, but enable cloud-based save/restore for logged-in users.
- Insight Panel + Reflective Prompts: Add an `InsightPanel` component on `/results` and `/dashboard`: Offers symbolic interpretation of user scores, Suggests strengths, tensions, or blind spots, Include reflective journaling prompts for each facet. Panel should be collapsible and slide in with animation
- Guided Onboarding Modal: Include a welcome modal (e.g., Step 1 of 5) triggered on first visit to `/assessment`.  Allow skip, next, and back navigation.  Use this onboarding to:Introduce the Meta-Prism modelPreview the 7 worldview dimensionsSet user expectations and flow
- Codex Card Tooltip + Facet Summary: On hover or tap, display a mini insight panel on each Codex card showing:Domain score breakdown (Ontology: 90%, etc.)One-sentence summary for each facetColor-coded percentage text to match ROYGBIV logic
- Facet-Level Color Logic: Titles on Codex cards should change color based on dominant facet score Example: if Ontology is highest, show title as red-toned text Use `text-gradient` or `text-domainColor` logic to reflect symbolic affinity
- Codex Filter and Search System: Top-level search bar (fuzzy keyword match) Dropdown to sort/filter Codex entries:Alphabetical (A–Z)By Dominant FacetBy Tradition Type (Philosophical / Religious / Archetypal)
- Mobile Navigation Optimization: Support full dropdown menu (hamburger on small screens) Ensure navigation drawer includes:DashboardAssessmentCodexBuilderArchetypesResultsSaved Worldviews
- Insight Summary View: Dynamic Domain Feedback: Create a `/results` or `/my-results` page that renders:A breakdown bar for each of the 7 facets (horizontal spectrum)Left label: domain anchor (e.g., “Materialism”)Right label: domain contrast (e.g., “Idealism / Animism”)Real-time bar-fill indicating user score (0.0–1.0)Display header + subtitle per facet (e.g., “What is real?” for Ontology)
- Insight Summary on Dashboard: Include this feature on the dashboard.
- Triangle-Based Comparison Interface: Compare user's triangle side-by-side with archetype matches Render both triangles with matching color-coded domains Include similarity percentage (e.g., “Exploratory Alignment: 64%”) Show archetype name, core description, and philosophy Label: “Closest Archetype Match” + optional match ranking
- Your Worldview Signature (Triangle Result View): Add `/dashboard` or `/my-worldview` route with triangle-only view Headline: “Your Worldview Signature” Interactivity:Hover or click a triangle layer to show matching facet interpretationInclude bottom buttons to export as: PNGPDFShareable linkInclude: “Retake Assessment” or “Edit Selections” call to action
- Your Worldview Signature on Dashboard: Include this feature on the dashboard.
- Codex Deep Dive (Facet View Pages): On each worldview page (e.g., `/codex/aristotelianism`), include:Triangle representation of worldview profileFacet-by-facet analysis in right-side panel% score + mini-description per domainOptional tooltip or “?” icon next to domain for extra contextScrollable layout or tabbed card system
- Builder Mode: Manual Worldview Constructor: On `/builder`, allow users to:Select a worldview per facet (7 total) from CodexUpdate triangle visual live as selections are madeSee a panel showing facet: worldview name (e.g., “Epistemology: Empiricism”)Controls:“Clear All Selections” (resets builder state)“Save Worldview to Library” (localStorage or Firestore-ready)Use animated triangle highlight when a facet is selected
- Featured Worldviews Section: Add a horizontal scroll or grid of curated Codex entries Include triangle visualization, title, and link to facet detail Button: “Explore the Full Codex” with right-arrow icon
- Hero CTA (Begin Assessment): Centered dark banner with large app logo and symbolic triangle icon Button to jump directly to /assessment Clear subtitle: "A symbolic self-assessment tool for exploring how you construct reality"
- Overview Info Blocks: Section: "How the Assessment Works" Step 1: Answer Questions Step 2: Generate Your Map Step 3: Reflect & Compare Use Tailwind cards with icons and title/description text
- Facet Accordions (with Deep Dive Links): Collapsible card list of the 7 facets Each includes: Domain title + icon + tagline (e.g., "What is real?") Full paragraph summary Button link: "Deep Dive into [Facet]" Use ROYGBIV-coded sidebar for each facet accordion
- Animated Section Dividers: Use subtle gradient lines or animated icons to divide homepage sections (e.g., between hero banner and assessment steps)
- Keyword Tag Filtering: Add small tags beneath each worldview card for category chips (e.g., #Mysticism, #Empiricism) Allow users to filter by clicking a tag
- Domain Affinity Bar: Optional: render a thin 7-color bar under each worldview card to show overall domain distribution
- Hover Card Detail Consistency: Ensure Codex card hover reveals: Color-coded domain score breakdown Symbolic phrase or belief snippet "Click for full overview"
- Click-to-Explore Triangle Layers: On results page, allow users to click each colored triangle layer to open insight about that facet Slide-in panel or tooltip shows domain insight, belief polarity, symbolic tension
- Triangle Comparison Toggle: Let users toggle comparison between: Their current triangle Closest archetype Past worldview (if stored)
- Save & Share Footer: On /results and /builder, include export tools: Save to Library Export to PNG Export to PDF Shareable link with optional name slug
- Section Heading Gradient Bar: Add subtle ROYGBIV gradient underline to headings (e.g., "About the 7 Facets")
- Icon Set: Use distinct icons for each facet on buttons/accordions/cards (Unicode, Lucide, or custom SVG)
- 3D / Depth-Enhanced Triangle Mode (Optional Experimental Toggle): Add <Prism3D /> component placeholder using React Three Fiber: Optional toggle between 2D flat triangle and 3D rotating prism. Use declarative <Canvas> layout for smooth GPU-accelerated rendering. Mark as "experimental 3D mode" in UI.
- Touch + Drag Worldview Editor (Builder Mode v2): Add drag-and-drop layer manipulation to /builder: User can tap and drag triangle bands to reorder or morph shape. Use @use-gesture + react-spring for smooth handling. Log reorder data to compare with symbolic implications (e.g., inversion of priorities).
- Sacred Geometry Overlay Library (MVP): Add modal or toggleable library of sacred geometry backgrounds (e.g., Flower of Life, Metatron’s Cube, Sierpinski triangle) behind signature triangle: Use Paper.js, p5.js, or SVG/Canvas overlays. Animate slowly or sync to user input. Toggle via /dashboard or /builder settings.
- Mobile-Optimized Triangle Interaction Modes: Long-press → expand facet info. Swipe-up/down gesture → morph between worldview profiles (previously saved). Touch-and-hold → activate glow ring + tooltip.

## Style Guidelines:

- Use Tailwind-based grid layout (`grid-cols-1`, `md:grid-cols-2`, `xl:grid-cols-4`)
- Headers: `text-3xl font-bold tracking-tight`
- Body: `text-base leading-relaxed font-medium text-muted-foreground`
- Use a muted ROYGBIV spectrum to correspond with the 7 worldview domains: Ontology: Red, Epistemology: Orange, Praxeology: Yellow, Axiology: Green, Mythology: Blue, Cosmology: Indigo, Teleology: Violet
- Apply glassmorphism elements to card and triangle containers
- Use Framer Motion (or Tailwind `transition`) to add page fade/slide transitions, triangle chart entrance animation, hover/scale on Codex and FacetSelector cards and smooth toggle between triangle and radar chart views
- Titles on Codex cards should change color based on dominant facet score
- Use subtle glassmorphism styling for modals, Codex cards, panels: `bg-white/5 backdrop-blur-md rounded-xl shadow-lg p-6`
- Integrate Framer Motion to animate triangle growth, opacity fades, rotations, and hover glows.
- Use React Spring + @use-gesture for physics-based drag interactions or facet-point manipulation.
- Use stroke-dasharray animation (SVG) to “draw” triangle outlines dynamically.
- Implement spectrum ripple effects with SVG or Canvas using expanding circle animations.
- Enable layered triangle stacking animations (e.g., expanding nested triangles with staggered entry).
- Provide sliders on the results/dashboard page to experiment with alternate domain scores (“What if I scored higher in Axiology?”).
- Enable triangle distortion in real time based on slider or touch input (e.g., using React Spring’s useSpring).
- Animate color gradients across triangle bands using chroma.js or D3’s scaleLinear for dynamic spectrum shifts.
- Use animated tooltips or narrative overlays on triangle parts explaining facet meaning on interaction.
- Build a reusable <AnimatedTriangle /> that handles entry, hover, and comparison animations via Framer variants.
- Honor prefers-reduced-motion by disabling continuous animation and providing toggle in settings.
- Add ARIA labels for interactive SVG elements and keyboard navigation across triangle layers and Codex entries.
- Tree-shake unused Tailwind utilities and animation plugins (e.g., GSAP’s ScrollTrigger only when needed).
- Serve gesture/animation libraries via npm in your Webpack/Babel config for Firebase Hosting compatibility.