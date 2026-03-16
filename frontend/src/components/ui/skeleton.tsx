import { cn } from "@/lib/utils";

export function Skeleton({
  className
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-[linear-gradient(90deg,rgba(226,232,240,0.75),rgba(241,245,249,1),rgba(226,232,240,0.75))] bg-[length:200%_100%]",
        className
      )}
    />
  );
}
