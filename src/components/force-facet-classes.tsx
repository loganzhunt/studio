// Force Facet Classes Component
// This component ensures all facet-related CSS classes are included in the build
import React from 'react';

// Force Tailwind to include all facet-related classes
const ForceFacetClasses: React.FC = () => {
  return (
    <div className="hidden">
      {/* Ontology - Violet */}
      <div className="bg-violet-500 text-violet-500 border-violet-500" />
      <div className="bg-violet-100 text-violet-900 border-violet-200" />
      
      {/* Epistemology - Indigo */}
      <div className="bg-indigo-500 text-indigo-500 border-indigo-500" />
      <div className="bg-indigo-100 text-indigo-900 border-indigo-200" />
      
      {/* Praxeology - Blue */}
      <div className="bg-blue-500 text-blue-500 border-blue-500" />
      <div className="bg-blue-100 text-blue-900 border-blue-200" />
      
      {/* Axiology - Green */}
      <div className="bg-green-500 text-green-500 border-green-500" />
      <div className="bg-green-100 text-green-900 border-green-200" />
      
      {/* Mythology - Yellow */}
      <div className="bg-yellow-500 text-yellow-500 border-yellow-500" />
      <div className="bg-yellow-100 text-yellow-900 border-yellow-200" />
      
      {/* Cosmology - Orange */}
      <div className="bg-orange-500 text-orange-500 border-orange-500" />
      <div className="bg-orange-100 text-orange-900 border-orange-200" />
      
      {/* Teleology - Red */}
      <div className="bg-red-500 text-red-500 border-red-500" />
      <div className="bg-red-100 text-red-900 border-red-200" />
      
      {/* Additional utility classes */}
      <div className="glass-card prism-button spectrum-bar spectrum-slider" />
    </div>
  );
};

export default ForceFacetClasses;
export { ForceFacetClasses as FacetClassForcer };
