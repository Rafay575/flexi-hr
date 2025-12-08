// components/Lucide.tsx

import * as lucideIcons from "lucide-react"; // Import all icons from lucide-react
import { twMerge } from "tailwind-merge"; // For merging Tailwind classNames
import React from "react";
// Extracting all available icons from lucide-react
const { icons } = lucideIcons;

interface LucideProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: keyof typeof icons; // The icon name will be a key of lucideIcons
  title?: string; // Optional title for the icon (useful for accessibility)
  className?: string; // Optional custom classes
}

const Lucide = ({ icon, className, ...computedProps }: LucideProps) => {
  // Dynamically get the icon component
  const IconComponent = icons[icon];

  // Render the icon component
  return (
    <IconComponent
      {...computedProps}
      className={twMerge("stroke-1.5 w-4 h-4", className)} // Merge custom classes with defaults
    />
  );
};

export default Lucide;
