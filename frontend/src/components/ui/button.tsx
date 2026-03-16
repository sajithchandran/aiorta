import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[linear-gradient(135deg,hsl(var(--accent-yellow)),hsl(var(--accent-orange))_55%,hsl(var(--accent-red)))] px-4 py-2.5 text-white shadow-soft hover:opacity-95",
        secondary:
          "bg-surface-subtle px-4 py-2.5 text-foreground ring-1 ring-line hover:bg-white",
        ghost: "px-3 py-2 text-muted hover:bg-surface-subtle hover:text-foreground",
        subtle:
          "bg-[linear-gradient(135deg,hsl(var(--accent-soft)),rgba(255,255,255,0.9))] px-4 py-2.5 text-[hsl(var(--accent-red))] hover:opacity-90"
      },
      size: {
        default: "h-10",
        sm: "h-9 px-3",
        lg: "h-11 px-5"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps): React.JSX.Element {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
