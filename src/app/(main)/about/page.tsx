
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutMetaPrismPage() {
  const facetList = [
    { name: "Ontology", question: "What is real?" },
    { name: "Epistemology", question: "How do we know?" },
    { name: "Praxeology", question: "How should we act?" },
    { name: "Axiology", question: "What matters?" },
    { name: "Mythology", question: "What stories shape us?" },
    { name: "Cosmology", question: "How is reality ordered?" },
    { name: "Teleology", question: "Why are we here?" },
  ];

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <header className="text-center">
        <Icons.logo className="h-20 w-auto mx-auto mb-6 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight mb-3 text-foreground roygbiv-gradient-underline pb-2">
          About The Meta-Prism Model
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Delve into the foundational concepts of the Meta-Prism framework and the worldview assessment tool.
        </p>
      </header>

      <section id="what-is" className="scroll-mt-20">
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-foreground roygbiv-gradient-underline pb-2">
              What Is the Meta-Prism?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base md:text-lg leading-relaxed">
            <p>
              The Meta-Prism Framework was created by Logan Zane Hunt from 2018-2020 while serving as a Peace Corps Volunteer in a high Himalayan village in Nepal.
            </p>
            <p>
              The Meta-Prism is a symbolic framework for exploring the hidden structure of human perception. It proposes that we do not passively receive the world “as it is,” but rather refract it through seven interlocking domains of meaning. These domains—called facets—filter experience, organize thought, and shape our sense of reality.
            </p>
            <p>
              Each facet answers a fundamental question about how we inhabit the world:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4 my-3 text-muted-foreground">
              {facetList.map(facet => (
                <li key={facet.name}>
                  <strong>{facet.name}</strong> — {facet.question}
                </li>
              ))}
            </ul>
            <p>
              These are not simply philosophical categories—they are cognitive and symbolic lenses. Each person (and each culture) carries a unique configuration of these assumptions, often without realizing it. The Meta-Prism allows you to make those filters visible, so they can be understood, questioned, and intentionally redesigned.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="how-it-works" className="scroll-mt-20">
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-foreground roygbiv-gradient-underline pb-2">
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base md:text-lg leading-relaxed">
            <p>
              The Meta-Prism framework treats worldview not as a static belief system, but as a living perceptual matrix—a prism through which meaning is refracted.
            </p>
            <p>
              Using the Meta-Prism Worldview Assessment Tool (MPWAT), your responses are mapped onto each of the seven facets. Each facet is placed on a symbolic spectrum, generating a color-coded triangle that visualizes the current shape of your worldview. The result is your symbolic signature—a snapshot of how you currently orient toward reality, knowledge, morality, myth, and purpose.
            </p>
            <p>From there, the system allows you to:</p>
            <ul className="list-disc list-inside space-y-1 pl-4 my-3 text-muted-foreground">
              <li>Explore each facet in depth</li>
              <li>Compare your worldview to others in the Codex</li>
              <li>Match with symbolic archetypes</li>
              <li>Begin the process of intentional worldview transformation through the Builder Tool</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="why-it-matters" className="scroll-mt-20">
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-foreground roygbiv-gradient-underline pb-2">
              Why It Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base md:text-lg leading-relaxed">
            <p>
              Your worldview is not just what you believe—<br />
              It is the interface through which you experience being.
            </p>
            <p>It determines:</p>
            <ul className="list-disc list-inside space-y-1 pl-4 my-3 text-muted-foreground">
              <li>What you notice or ignore</li>
              <li>What you trust or question</li>
              <li>What stories feel true</li>
              <li>What futures feel possible</li>
            </ul>
            <p>
              Most of this operates beneath awareness—until it is made visible.
            </p>
            <p>
              The Meta-Prism does not diagnose or divide. It reveals the symbolic scaffolding of perception itself. It offers a way to witness, refine, and redesign the architecture of your experience—with philosophical rigor, psychological depth, and aesthetic clarity.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="begin-mapping" className="scroll-mt-20">
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-foreground roygbiv-gradient-underline pb-2">
              Begin Mapping Your Worldview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base md:text-lg leading-relaxed">
            <p>
              The tools on this platform are designed to turn this model into an interactive map of your mind. Through reflection, comparison, and symbolic exploration, you can trace the prism that shapes your reality—and begin to consciously reshape it.
            </p>
            <div className="text-center">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/assessment">
                  <Icons.assessment className="mr-2 h-5 w-5" />
                  Start Your Assessment
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
