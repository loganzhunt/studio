"use client";

import React, { useState } from 'react';
import { FACET_COLORS } from '@/lib/colors';

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('colors');

  const tabs = [
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'components', label: 'Components' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Design System</h1>
          <p className="text-muted-foreground mt-2">Meta-Prism visual foundation</p>
        </div>
      </div>

      <nav className="border-b bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground border-t border-x border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'colors' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Facet Colors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(FACET_COLORS).map(([facet, color]) => (
                  <div key={facet} className="border rounded-lg p-4 bg-card">
                    <div 
                      className="w-full h-20 rounded-lg mb-4 border"
                      style={{ backgroundColor: color }}
                    ></div>
                    <h3 className="text-lg font-semibold capitalize mb-2">{facet}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{color}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Typography Scale</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-6 bg-card">
                  <h1 className="text-4xl font-bold mb-2">Heading 1</h1>
                  <p className="text-muted-foreground">Primary page headings</p>
                </div>
                <div className="border rounded-lg p-6 bg-card">
                  <h2 className="text-3xl font-semibold mb-2">Heading 2</h2>
                  <p className="text-muted-foreground">Section headings</p>
                </div>
                <div className="border rounded-lg p-6 bg-card">
                  <p className="text-base mb-2">Body Text</p>
                  <p className="text-muted-foreground">Regular paragraph content</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Basic Components</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6 bg-card">
                  <h3 className="text-lg font-semibold mb-4">Buttons</h3>
                  <div className="space-y-2">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                      Primary Button
                    </button>
                    <button className="px-4 py-2 border border-border rounded-md hover:bg-muted">
                      Secondary Button
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
