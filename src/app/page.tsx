import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Icons } from '@/components/icons';
import { FACETS, FACET_NAMES } from '@/config/facets';
import { FacetIcon } from '@/components/facet-icon';
import { TriangleChart } from '@/components/triangle-chart';
import { GlassCard } from '@/components/glass-card';

export default function HomePage() {
  const howItWorksSteps = [
    {
      icon: Icons.assessment,
      title: "1. Answer Questions",
      description: "Engage with thought-provoking questions across 7 dimensions of your worldview."
    },
    {
      icon: Icons.results,
      title: "2. Generate Your Map",
      description: "Visualize your unique worldview signature as a symbolic Meta-Prism."
    },
    {
      icon: Icons.archetypes,
      title: "3. Reflect & Compare",
      description: "Explore insights, compare with archetypes, and discover new perspectives."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="py-4 border-b border-border/30">
        <div className="container mx-auto flex justify-between items-center">
          <Icons.logo className="h-10 w-auto" />
          <nav className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="default" asChild>
              <Link href="/assessment">Begin Assessment</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 text-center bg-gradient-to-br from-background via-card to-background">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "url('https://placehold.co/1200x800/000000/FFFFFF.png?text=.)", // Placeholder subtle background pattern
              backgroundRepeat: 'repeat',
              backgroundSize: '40px 40px', // Adjust size of pattern elements
              maskImage: 'radial-gradient(circle at center, white 20%, transparent 70%)'
            }}
            data-ai-hint="abstract geometric"
          />
          <div className="container mx-auto relative z-10">
            <div className="mx-auto mb-8 h-24 w-24">
              <Icons.logo className="h-full w-full text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
              Discover Your Meta-Prism
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              A symbolic self-assessment tool for exploring how you construct reality.
            </p>
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-primary/50 transition-shadow" asChild>
              <Link href="/assessment">
                <Icons.sparkles className="mr-2 h-5 w-5" />
                Begin Your Journey
              </Link>
            </Button>
          </div>
        </section>

        {/* Animated Section Divider (Placeholder) */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent my-12 md:my-16"></div>

        {/* How the Assessment Works Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How Meta-Prism Works
              <div className="mt-2 h-1 w-24 bg-primary mx-auto"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step, index) => (
                <GlassCard key={index} className="text-center p-8 hover:shadow-primary/20 transition-shadow duration-300">
                  <div className="mb-6">
                    <step.icon className="h-16 w-16 mx-auto text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Animated Section Divider (Placeholder) */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-12 md:my-16"></div>
        
        {/* Featured Worldviews Placeholder Section */}
        <section className="py-16 md:py-24 bg-card/30">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Worldviews</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Explore a diverse collection of philosophical, religious, and archetypal systems.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl">Example Worldview {i}</CardTitle>
                    <CardDescription>A brief summary of this worldview...</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TriangleChart scores={FACET_NAMES.map(name => ({ facetName: name, score: Math.random()}))} width={200} height={173} className="mx-auto !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
                    <Button variant="link" className="mt-4 p-0 text-primary" asChild>
                      <Link href="/codex/example-worldview">Explore Details <Icons.chevronRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/codex">Explore the Full Codex <Icons.chevronRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Animated Section Divider (Placeholder) */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-12 md:my-16"></div>

        {/* Facet Accordions Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              The 7 Facets of Worldview
              <div className="mt-2 h-1 w-32 bg-primary mx-auto"></div>
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Meta-Prism explores your perspective through seven fundamental dimensions of how we interpret reality, knowledge, action, values, meaning, the cosmos, and purpose.
            </p>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              {FACET_NAMES.map((facetName) => {
                const facet = FACETS[facetName];
                return (
                  <AccordionItem value={facet.name} key={facet.name} className="border-border/50 mb-2 last:mb-0 rounded-lg overflow-hidden shadow-md bg-card/70 hover:bg-card/90 transition-colors">
                    <AccordionTrigger className="p-6 text-lg hover:no-underline">
                      <div className="flex items-center gap-3">
                        <FacetIcon facetName={facet.name} className="h-6 w-6" />
                        <span style={{ color: `hsl(var(${facet.colorVariable.slice(2)}))` }}>{facet.name}</span>: <span className="ml-1 text-base font-medium text-muted-foreground">{facet.tagline}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                      <p className="mb-4 text-muted-foreground">{facet.description}</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/facet/${facet.name.toLowerCase()}`}>
                          Deep Dive into {facet.name} <Icons.chevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/30 bg-background">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Meta-Prism. All rights reserved.</p>
          <p className="text-sm mt-1">Explore your reality.</p>
        </div>
      </footer>
    </div>
  );
}
