import type { FacetName } from '@/types';
import { FACETS, DEFAULT_FACET_ICON } from '@/config/facets';
import type { LucideProps } from 'lucide-react';

interface FacetIconProps extends LucideProps {
  facetName: FacetName | string; // Allow string for flexibility, but map to FacetName
}

export function FacetIcon({ facetName, className, ...props }: FacetIconProps) {
  const facet = FACETS[facetName as FacetName];
  const IconComponent = facet ? facet.icon : DEFAULT_FACET_ICON;
  
  // Dynamically set color using CSS variable from facet config
  const style = facet ? { color: `hsl(var(${facet.colorVariable.slice(2)}))` } : {};

  return <IconComponent className={className} style={style} {...props} />;
}
