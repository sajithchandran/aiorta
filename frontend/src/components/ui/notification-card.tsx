import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const toneMap = {
  info: {
    icon: Info,
    className: "bg-sky-50 text-sky-800"
  },
  success: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-800"
  },
  warning: {
    icon: AlertCircle,
    className: "bg-amber-50 text-amber-900"
  }
} as const;

export function NotificationCard({
  tone,
  title,
  children
}: {
  tone: keyof typeof toneMap;
  title: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const Icon = toneMap[tone].icon;

  return (
    <div className={cn("rounded-2xl px-4 py-3", toneMap[tone].className)}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="mt-1 text-sm leading-6 opacity-80">{children}</div>
        </div>
      </div>
    </div>
  );
}
