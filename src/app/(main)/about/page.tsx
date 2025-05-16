import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { FACETS, FACET_NAMES } from "@/config/facets";
import { FacetIcon } from "@/components/facet-icon";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <header className="text-center">
        <Icons.logo className="h-20 w-auto mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-2">About Meta-Prism</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Meta-Prism is a symbolic self-assessment tool designed to help you explore, understand, and articulate the multifaceted structure of your personal worldview.
        </p>
      </header>

      <section>
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            <p>
              We aim to provide an engaging and insightful framework for self-reflection. By examining your perspectives across seven fundamental domains of human experience, Meta-Prism encourages a deeper awareness of how you construct reality, make decisions, and find meaning in your life. Our goal is to foster intellectual humility, curiosity, and a greater appreciation for the diversity of human thought.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">The 7 Facets of Worldview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACET_NAMES.map(facetName => {
            const facet = FACETS[facetName];
            return (
              <Card key={facet.name} className="glassmorphic-card p-1">
                <CardHeader className="flex flex-row items-center gap-3 pb-3">
                  <FacetIcon facetName={facet.name} className="h-8 w-8" />
                  <div>
                    <CardTitle className="text-xl" style={{ color: `hsl(var(${facet.colorVariable.slice(2)}))` }}>{facet.name}</CardTitle>
                    <p className="text-xs text-muted-foreground -mt-1">{facet.tagline}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{facet.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
         <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground max-w-2xl mx-auto">
            <p><strong>1. Assessment:</strong> Respond to a series of Likert-scale questions for each of the 7 facets. Your answers help quantify your inclinations within each domain.</p>
            <p><strong>2. Visualization:</strong> Your responses generate a unique "Meta-Prism" — a seven-banded triangular chart where each band's appearance (e.g., opacity, height) reflects your score in that facet. This provides a holistic visual signature of your worldview.</p>
            <p><strong>3. Exploration & Reflection:</strong> Review your scores, read interpretations, and compare your profile to archetypal worldviews or previously saved configurations. Use the Codex to explore diverse philosophical and symbolic systems.</p>
            <p><strong>4. Builder Mode:</strong> Construct hypothetical worldviews by selecting different systems for each facet, allowing for creative exploration and "what-if" scenarios.</p>
          </CardContent>
        </Card>
      </section>
      
      <section className="text-center text-muted-foreground">
        <p>Meta-Prism is an exploratory tool and not a diagnostic instrument. Its purpose is to stimulate thought and self-discovery.</p>
        <p className="mt-4">For questions or feedback, please contact us at [contact@meta-prism.app-placeholder].</p>
      </section>
    </div>
  );
}
