// Mock for lucide-react package
const React = require('react');

const createMockIcon = (name) => {
  const MockIcon = (props) => React.createElement('svg', { ...props, 'data-testid': `${name}Icon` }, name);
  MockIcon.displayName = name;
  MockIcon.name = name;
  return MockIcon;
};

module.exports = {
  Atom: createMockIcon('Atom'),
  Brain: createMockIcon('Brain'),
  Zap: createMockIcon('Zap'),
  Heart: createMockIcon('Heart'),
  BookOpen: createMockIcon('BookOpen'),
  Globe: createMockIcon('Globe'),
  Target: createMockIcon('Target'),
  HelpCircle: createMockIcon('HelpCircle'),
  Loader2: createMockIcon('Loader2'),
  AlertTriangle: createMockIcon('AlertTriangle'),
  RefreshCw: createMockIcon('RefreshCw'),
  ArrowLeft: createMockIcon('ArrowLeft'),
  ArrowRight: createMockIcon('ArrowRight'),
  ChevronLeft: createMockIcon('ChevronLeft'),
};
