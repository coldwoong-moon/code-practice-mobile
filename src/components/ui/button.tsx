import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-lg font-medium",
          "transition-all duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Touch-friendly active state
          "active:scale-95",
          // Variant styles
          {
            // Primary
            "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 active:bg-blue-800":
              variant === "primary",
            // Secondary
            "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400 active:bg-gray-400":
              variant === "secondary",
            // Outline
            "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500 active:bg-blue-100":
              variant === "outline",
            // Ghost
            "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400 active:bg-gray-200":
              variant === "ghost",
          },
          // Size styles (mobile-friendly touch targets: minimum 44px)
          {
            "min-h-[36px] px-3 py-1.5 text-sm": size === "sm",
            "min-h-[44px] px-4 py-2.5 text-base": size === "md",
            "min-h-[52px] px-6 py-3.5 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
