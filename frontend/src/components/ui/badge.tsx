import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-[0.01em]",
  {
    variants: {
      variant: {
        neutral: "bg-surface-subtle text-muted",
        active: "bg-accent-soft text-accent",
        success: "bg-emerald-50 text-success",
        warning: "bg-amber-50 text-warning",
        danger: "bg-rose-50 text-danger"
      }
    },
    defaultVariants: {
      variant: "neutral"
    }
  }
);

type BadgeProps = VariantProps<typeof badgeVariants> & {
  className?: string;
  children: React.ReactNode;
};

export function Badge({ className, variant, children }: BadgeProps): React.JSX.Element {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
