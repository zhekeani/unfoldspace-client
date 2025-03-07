import React from "react";

const sizeClasses = {
  small: {
    spinner: "h-6 w-6 border-2",
    pulse: "h-8 w-8 border-2",
  },
  medium: {
    spinner: "h-9 w-9 border-3",
    pulse: "h-11 w-11 border-3",
  },
  large: {
    spinner: "h-12 w-12 border-4",
    pulse: "h-14 w-14 border-4",
  },
};

type PulseSpinnerProps = {
  size?: "small" | "medium" | "large";
};

const PulseSpinner: React.FC<PulseSpinnerProps> = ({ size = "large" }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Core rotating element */}
      <div
        className={`border-primary border-t-transparent rounded-full animate-spin ${sizeClasses[size].spinner}`}
      />

      {/* Pulsing effect */}
      <div
        className={`absolute border-primary/30 rounded-full animate-ping ${sizeClasses[size].pulse}`}
      />
    </div>
  );
};

export default PulseSpinner;
