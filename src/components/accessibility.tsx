import React from "react";

/**
 * Accessibility utilities for the Meta-Prism application
 * Provides components and hooks for improved ARIA support, keyboard navigation, and screen reader compatibility
 */

// ARIA live region component for dynamic content announcements
interface LiveRegionProps {
  message: string;
  priority?: "polite" | "assertive";
  id?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  priority = "polite",
  id = "live-region",
}) => (
  <div
    id={id}
    aria-live={priority}
    aria-atomic="true"
    className="sr-only"
    role="status"
  >
    {message}
  </div>
);

// Skip to main content link
export const SkipToMainContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-br-md transition-all"
    onClick={(e) => {
      e.preventDefault();
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView();
      }
    }}
  >
    Skip to main content
  </a>
);

// Focus trap component for modals and dialogs
interface FocusTrapProps {
  children: React.ReactNode;
  enabled?: boolean;
  onEscape?: () => void;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  enabled = true,
  onEscape,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const firstFocusableRef = React.useRef<HTMLElement | null>(null);
  const lastFocusableRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    firstFocusableRef.current = focusableElements[0] as HTMLElement;
    lastFocusableRef.current = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableRef.current) {
          lastFocusableRef.current?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableRef.current) {
          firstFocusableRef.current?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    firstFocusableRef.current?.focus();

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onEscape]);

  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  );
};

// Keyboard navigation hook
export const useKeyboardNavigation = (
  items: Array<{ id: string; element?: HTMLElement }>,
  options: {
    orientation?: "horizontal" | "vertical" | "both";
    loop?: boolean;
    onSelect?: (id: string) => void;
  } = {}
) => {
  const { orientation = "vertical", loop = true, onSelect } = options;
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      const { key } = e;
      let newIndex = activeIndex;

      switch (key) {
        case "ArrowUp":
          if (orientation === "vertical" || orientation === "both") {
            newIndex =
              activeIndex > 0 ? activeIndex - 1 : loop ? items.length - 1 : 0;
            e.preventDefault();
          }
          break;
        case "ArrowDown":
          if (orientation === "vertical" || orientation === "both") {
            newIndex =
              activeIndex < items.length - 1
                ? activeIndex + 1
                : loop
                ? 0
                : items.length - 1;
            e.preventDefault();
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal" || orientation === "both") {
            newIndex =
              activeIndex > 0 ? activeIndex - 1 : loop ? items.length - 1 : 0;
            e.preventDefault();
          }
          break;
        case "ArrowRight":
          if (orientation === "horizontal" || orientation === "both") {
            newIndex =
              activeIndex < items.length - 1
                ? activeIndex + 1
                : loop
                ? 0
                : items.length - 1;
            e.preventDefault();
          }
          break;
        case "Home":
          newIndex = 0;
          e.preventDefault();
          break;
        case "End":
          newIndex = items.length - 1;
          e.preventDefault();
          break;
        case "Enter":
        case " ":
          if (onSelect && items[activeIndex]) {
            onSelect(items[activeIndex].id);
            e.preventDefault();
          }
          break;
      }

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        items[newIndex]?.element?.focus();
      }
    },
    [activeIndex, items, orientation, loop, onSelect]
  );

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    registerKeyboardEvents: (element: HTMLElement) => {
      element.addEventListener("keydown", handleKeyDown);
      return () => element.removeEventListener("keydown", handleKeyDown);
    },
  };
};

// Screen reader only text component
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  children,
  as: Component = "span",
}) => <Component className="sr-only">{children}</Component>;

// Enhanced button with accessibility features
interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  describedBy?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  loading,
  loadingText = "Loading...",
  describedBy,
  disabled,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled || loading}
    aria-disabled={disabled || loading}
    aria-describedby={describedBy}
    aria-busy={loading}
  >
    {loading ? (
      <>
        <span aria-hidden="true" className="inline-block animate-spin mr-2">
          ⟳
        </span>
        <ScreenReaderOnly>{loadingText}</ScreenReaderOnly>
        <span aria-hidden="true">{loadingText}</span>
      </>
    ) : (
      children
    )}
  </button>
);

// Form field with accessibility enhancements
interface AccessibleFieldProps {
  label: string;
  id: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: React.ReactElement;
}

export const AccessibleField: React.FC<AccessibleFieldProps> = ({
  label,
  id,
  error,
  description,
  required,
  children,
}) => {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const ariaDescribedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <div className="form-field">
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
        {required && (
          <span aria-label="required" className="text-destructive ml-1">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground mb-2">
          {description}
        </p>
      )}

      {React.cloneElement(children, {
        id,
        "aria-describedby": ariaDescribedBy || undefined,
        "aria-invalid": error ? "true" : undefined,
        "aria-required": required,
      })}

      {error && (
        <p id={errorId} className="text-sm text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Progress indicator with accessibility
interface AccessibleProgressProps {
  value: number;
  max?: number;
  label?: string;
  description?: string;
}

export const AccessibleProgress: React.FC<AccessibleProgressProps> = ({
  value,
  max = 100,
  label,
  description,
}) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="progress-container">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-muted-foreground">{percentage}%</span>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        aria-describedby={description ? "progress-description" : undefined}
        className="w-full bg-secondary rounded-full h-2"
      >
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>

      {description && (
        <p
          id="progress-description"
          className="text-sm text-muted-foreground mt-1"
        >
          {description}
        </p>
      )}

      <ScreenReaderOnly>Progress: {percentage}% complete</ScreenReaderOnly>
    </div>
  );
};

// High contrast mode detector and manager
export const useHighContrastMode = () => {
  const [isHighContrast, setIsHighContrast] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: high)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    setIsHighContrast(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    document.documentElement.classList.toggle("high-contrast", newValue);
    localStorage.setItem("high-contrast", newValue.toString());
  };

  return { isHighContrast, toggleHighContrast };
};

// Reduced motion preference detector
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};
