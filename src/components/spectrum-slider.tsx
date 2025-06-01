// Spectrum Slider Component for Meta-Prism
import React from 'react';
import { getROYGBIVSpectrum } from '@/lib/colors';
import { cn } from '@/lib/utils';

interface SpectrumSliderProps {
  value: number;
  onChange?: (value: number) => void;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  label?: string;
  facetName?: string;
  facet?: string;
  size?: string;
  showPercentage?: boolean;
  showLabels?: boolean;
}

export const SpectrumSlider: React.FC<SpectrumSliderProps> = ({
  value,
  onChange,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  label,
  facetName,
  facet,
  size,
  showPercentage,
  showLabels
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Use dynamic LCH ROYGBIV spectrum colors for vivid gradient
  const spectrumColors = getROYGBIVSpectrum(0.8); // Use high score for vivid colors
  const gradientBackground = `linear-gradient(to right, ${spectrumColors.join(', ')})`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    if (onChange) onChange(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className={cn('spectrum-slider w-full space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Spectrum track */}
        <div 
          className="h-2 rounded-full"
          style={{ background: gradientBackground }}
        />
        
        {/* Slider input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        />
        
        {/* Slider thumb */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full shadow-lg"
          style={{ left: `${percentage}%` }}
        />
      </div>
      
      {/* Value display */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span className="font-medium">{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default SpectrumSlider;
