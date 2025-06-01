/**
 * Sample Meta-Prism Components using the Facet Color System
 * Demonstrates comprehensive usage of the muted ROYGBIV color palette
 */

import React from 'react';

// Types for the facet system
type FacetType = 'ontology' | 'epistemology' | 'praxeology' | 'axiology' | 'mythology' | 'cosmology' | 'teleology';

interface FacetCardProps {
  facet: FacetType;
  title: string;
  description: string;
  progress?: number;
  tags?: string[];
  children: React.ReactNode;
}

// Sample Facet Card Component
export const FacetCard = ({ facet, title, description, progress, tags, children }: FacetCardProps) => {
  const facetClasses: Record<FacetType, {
    header: string;
    accent: string;
    progress: string;
    button: string;
    tag: string;
  }> = {
    ontology: {
      header: 'bg-gradient-to-r from-facet-ontology-500 to-facet-ontology-600',
      accent: 'border-l-4 border-facet-ontology-200',
      progress: 'bg-gradient-to-r from-facet-ontology-400 to-facet-ontology-600',
      button: 'bg-facet-ontology hover:bg-facet-ontology-700',
      tag: 'bg-facet-ontology-100 text-facet-ontology-800',
    },
    epistemology: {
      header: 'bg-gradient-to-r from-facet-epistemology-500 to-facet-epistemology-600',
      accent: 'border-l-4 border-facet-epistemology-200',
      progress: 'bg-gradient-to-r from-facet-epistemology-400 to-facet-epistemology-600',
      button: 'bg-facet-epistemology hover:bg-facet-epistemology-700',
      tag: 'bg-facet-epistemology-100 text-facet-epistemology-800',
    },
    praxeology: {
      header: 'bg-gradient-to-r from-facet-praxeology-500 to-facet-praxeology-600',
      accent: 'border-l-4 border-facet-praxeology-200',
      progress: 'bg-gradient-to-r from-facet-praxeology-400 to-facet-praxeology-600',
      button: 'bg-facet-praxeology hover:bg-facet-praxeology-700',
      tag: 'bg-facet-praxeology-100 text-facet-praxeology-800',
    },
    axiology: {
      header: 'bg-gradient-to-r from-facet-axiology-500 to-facet-axiology-600',
      accent: 'border-l-4 border-facet-axiology-200',
      progress: 'bg-gradient-to-r from-facet-axiology-400 to-facet-axiology-600',
      button: 'bg-facet-axiology hover:bg-facet-axiology-700',
      tag: 'bg-facet-axiology-100 text-facet-axiology-800',
    },
    mythology: {
      header: 'bg-gradient-to-r from-facet-mythology-500 to-facet-mythology-600',
      accent: 'border-l-4 border-facet-mythology-200',
      progress: 'bg-gradient-to-r from-facet-mythology-400 to-facet-mythology-600',
      button: 'bg-facet-mythology hover:bg-facet-mythology-700',
      tag: 'bg-facet-mythology-100 text-facet-mythology-800',
    },
    cosmology: {
      header: 'bg-gradient-to-r from-facet-cosmology-500 to-facet-cosmology-600',
      accent: 'border-l-4 border-facet-cosmology-200',
      progress: 'bg-gradient-to-r from-facet-cosmology-400 to-facet-cosmology-600',
      button: 'bg-facet-cosmology hover:bg-facet-cosmology-700',
      tag: 'bg-facet-cosmology-100 text-facet-cosmology-800',
    },
    teleology: {
      header: 'bg-gradient-to-r from-facet-teleology-500 to-facet-teleology-600',
      accent: 'border-l-4 border-facet-teleology-200',
      progress: 'bg-gradient-to-r from-facet-teleology-400 to-facet-teleology-600',
      button: 'bg-facet-teleology hover:bg-facet-teleology-700',
      tag: 'bg-facet-teleology-100 text-facet-teleology-800',
    },
  };

  const classes = facetClasses[facet];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header with facet gradient */}
      <div className={`${classes.header} px-6 py-4`}>
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
      
      {/* Content with subtle accent */}
      <div className={`p-6 ${classes.accent}`}>
        {children}
        
        {/* Progress bar if provided */}
        {progress && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className={`${classes.progress} h-2 rounded-full transition-all duration-300 ease-in-out`} 
              style={{width: `${progress}%`}}
            />
          </div>
        )}
        
        {/* Tags if provided */}
        {tags && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {tags.map((tag: string, index: number) => (
              <span 
                key={index}
                className={`${classes.tag} px-3 py-1 rounded-full text-sm font-medium`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Action button */}
        <button className={`${classes.button} text-white px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out font-medium`}>
          Explore Further
        </button>
      </div>
    </div>
  );
};

// Spectrum Bar Component
export const SpectrumBar = ({ className = "" }) => (
  <div className={`bg-gradient-facet-spectrum h-2 rounded-full ${className}`} />
);

// Facet Navigation Component
export const FacetNavigation = () => {
  const facets = [
    { key: 'ontology', label: 'Ontology', question: 'What is real?' },
    { key: 'epistemology', label: 'Epistemology', question: 'What can be known?' },
    { key: 'praxeology', label: 'Praxeology', question: 'How should we act?' },
    { key: 'axiology', label: 'Axiology', question: 'What has value?' },
    { key: 'mythology', label: 'Mythology', question: 'What is the story?' },
    { key: 'cosmology', label: 'Cosmology', question: 'What is the universe?' },
    { key: 'teleology', label: 'Teleology', question: 'What is the purpose?' },
  ];

  return (
    <nav className="flex flex-wrap gap-2">
      {facets.map((facet) => (
        <button
          key={facet.key}
          className={`
            bg-facet-${facet.key}-100 
            text-facet-${facet.key}-800 
            hover:bg-facet-${facet.key}
            hover:text-white
            px-4 py-2 rounded-lg 
            transition-all duration-300 ease-in-out 
            font-medium text-sm
            border border-facet-${facet.key}-200
            hover:border-facet-${facet.key}
          `}
          title={facet.question}
        >
          {facet.label}
        </button>
      ))}
    </nav>
  );
};

// Prismatic Hero Section
export const PrismaticHero = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
    {/* Background mesh gradient */}
    <div className="absolute inset-0 bg-gradient-mesh-primary opacity-10" />
    
    {/* Spectrum overlay */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-facet-spectrum" />
    
    <div className="relative container mx-auto px-6 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-6">
        Meta-<span className="bg-gradient-facet-spectrum bg-clip-text text-transparent">Prism</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Explore the seven fundamental facets of understanding through our comprehensive framework
      </p>
      
      {/* Spectrum indicator */}
      <SpectrumBar className="max-w-md mx-auto mb-8" />
      
      <FacetNavigation />
    </div>
  </section>
);

// Status Indicator Component
interface StatusIndicatorProps {
  facet: FacetType;
  active?: boolean;
}

export const StatusIndicator = ({ facet, active = false }: StatusIndicatorProps) => {
  const dotClasses = {
    ontology: 'bg-facet-ontology',
    epistemology: 'bg-facet-epistemology',
    praxeology: 'bg-facet-praxeology',
    axiology: 'bg-facet-axiology',
    mythology: 'bg-facet-mythology',
    cosmology: 'bg-facet-cosmology',
    teleology: 'bg-facet-teleology',
  };

  return (
    <div className={`
      w-3 h-3 rounded-full transition-all duration-300 ease-in-out
      ${dotClasses[facet]}
      ${active ? 'scale-125 shadow-lg' : 'opacity-60'}
    `} />
  );
};

// Facet Chip Component
interface FacetChipProps {
  facet: FacetType;
  children: React.ReactNode;
  variant?: 'solid' | 'soft' | 'outline';
}

export const FacetChip = ({ facet, children, variant = 'soft' }: FacetChipProps) => {
  const variants: Record<'solid' | 'soft' | 'outline', Record<FacetType, string>> = {
    solid: {
      ontology: 'bg-facet-ontology text-white',
      epistemology: 'bg-facet-epistemology text-white',
      praxeology: 'bg-facet-praxeology text-white',
      axiology: 'bg-facet-axiology text-white',
      mythology: 'bg-facet-mythology text-white',
      cosmology: 'bg-facet-cosmology text-white',
      teleology: 'bg-facet-teleology text-white',
    },
    soft: {
      ontology: 'bg-facet-ontology-100 text-facet-ontology-800',
      epistemology: 'bg-facet-epistemology-100 text-facet-epistemology-800',
      praxeology: 'bg-facet-praxeology-100 text-facet-praxeology-800',
      axiology: 'bg-facet-axiology-100 text-facet-axiology-800',
      mythology: 'bg-facet-mythology-100 text-facet-mythology-800',
      cosmology: 'bg-facet-cosmology-100 text-facet-cosmology-800',
      teleology: 'bg-facet-teleology-100 text-facet-teleology-800',
    },
    outline: {
      ontology: 'border border-facet-ontology-300 text-facet-ontology-700',
      epistemology: 'border border-facet-epistemology-300 text-facet-epistemology-700',
      praxeology: 'border border-facet-praxeology-300 text-facet-praxeology-700',
      axiology: 'border border-facet-axiology-300 text-facet-axiology-700',
      mythology: 'border border-facet-mythology-300 text-facet-mythology-700',
      cosmology: 'border border-facet-cosmology-300 text-facet-cosmology-700',
      teleology: 'border border-facet-teleology-300 text-facet-teleology-700',
    },
  };

  return (
    <span className={`
      px-3 py-1 rounded-full text-sm font-medium 
      ${variants[variant][facet]}
    `}>
      {children}
    </span>
  );
};

// Usage Example Component
export const FacetShowcase = () => (
  <div className="min-h-screen bg-gray-50">
    <PrismaticHero />
    
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FacetCard
          facet="ontology"
          title="Ontology"
          description="What is real?"
          progress={75}
          tags={["Being", "Existence", "Reality"]}
        >
          <p className="text-gray-700 mb-4">
            Explore the fundamental nature of being and existence. What constitutes reality?
          </p>
        </FacetCard>
        
        <FacetCard
          facet="epistemology"
          title="Epistemology"
          description="What can be known?"
          progress={60}
          tags={["Knowledge", "Truth", "Belief"]}
        >
          <p className="text-gray-700 mb-4">
            Investigate the nature of knowledge, justified belief, and rationality.
          </p>
        </FacetCard>
        
        <FacetCard
          facet="praxeology"
          title="Praxeology"
          description="How should we act?"
          progress={85}
          tags={["Action", "Choice", "Behavior"]}
        >
          <p className="text-gray-700 mb-4">
            Study human action and decision-making in social contexts.
          </p>
        </FacetCard>
        
        <FacetCard
          facet="axiology"
          title="Axiology"
          description="What has value?"
          progress={70}
          tags={["Ethics", "Values", "Worth"]}
        >
          <p className="text-gray-700 mb-4">
            Examine the nature of value and valuation across domains.
          </p>
        </FacetCard>
        
        <FacetCard
          facet="mythology"
          title="Mythology"
          description="What is the story?"
          progress={90}
          tags={["Narrative", "Meaning", "Symbol"]}
        >
          <p className="text-gray-700 mb-4">
            Uncover the stories and narratives that shape understanding.
          </p>
        </FacetCard>
        
        <FacetCard
          facet="cosmology"
          title="Cosmology"
          description="What is the universe?"
          progress={55}
          tags={["Universe", "Structure", "Origin"]}
        >
          <p className="text-gray-700 mb-4">
            Investigate the origin and structure of the universe.
          </p>
        </FacetCard>
      </div>
      
      {/* Status indicators */}
      <div className="flex justify-center items-center gap-4 mt-16">
        <span className="text-sm text-gray-600">Facet Progress:</span>
        <StatusIndicator facet="ontology" active />
        <StatusIndicator facet="epistemology" />
        <StatusIndicator facet="praxeology" active />
        <StatusIndicator facet="axiology" />
        <StatusIndicator facet="mythology" active />
        <StatusIndicator facet="cosmology" />
        <StatusIndicator facet="teleology" />
      </div>
      
      {/* Chip examples */}
      <div className="flex justify-center gap-2 mt-8 flex-wrap">
        <FacetChip facet="ontology" variant="soft">Reality</FacetChip>
        <FacetChip facet="epistemology" variant="outline">Knowledge</FacetChip>
        <FacetChip facet="praxeology" variant="solid">Action</FacetChip>
        <FacetChip facet="axiology" variant="soft">Value</FacetChip>
      </div>
    </div>
  </div>
);

export default FacetShowcase;
