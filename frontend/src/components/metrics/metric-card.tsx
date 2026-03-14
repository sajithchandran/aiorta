import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  meta
}: {
  label: string;
  value: string;
  meta: string;
}): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground">{value}</p>
        </div>
        <div className="rounded-2xl bg-accent-soft p-2 text-accent">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-12 rounded-2xl bg-accent-soft/55" />
        <p className="mt-3 text-sm text-muted">{meta}</p>
      </CardContent>
    </Card>
  );
}
