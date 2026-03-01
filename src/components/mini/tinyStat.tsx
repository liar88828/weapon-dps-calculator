import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import * as React from "react";

export function TinyStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/30 p-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="font-medium tabular-nums">{value}</div>
    </div>
  );
}

export function TinyStatCompare({
  icon,
  label,
  value1,
  value2,
}: {
  icon: React.ReactNode;
  label: string;
  value1: string;
  value2: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/30 p-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="font-medium tabular-nums text-red-400">{value1}</div>
      <div className="font-medium tabular-nums text-blue-400 ">{value2}</div>
      <div
        className={`font-medium tabular-nums  ${
          value1 > value2 ? "text-green-400" : "text-red-600"
        }`}
      >
        {value1 > value2 ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>
    </div>
  );
}

export function StatTileCompare({
  icon,
  label,
  value1,
  value2,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value1: string;
  value2: string;
  hint?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center justify-between rounded-2xl border p-3">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
          <span className="font-semibold tabular-nums text-red-400">
            {value1}
          </span>
          <span className="font-semibold tabular-nums text-blue-400">
            {value2}
          </span>
          <span
            className={`font-medium tabular-nums  ${
              value1 > value2 ? "text-green-400" : "text-red-600"
            }`}
          >
            {value1 > value2 ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </span>
        </div>
      </TooltipTrigger>

      {hint ? (
        <TooltipContent className="max-w-xs text-xs">{hint}</TooltipContent>
      ) : null}
    </Tooltip>
  );
}

export function StatTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center justify-between rounded-2xl border p-3">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
          <span className="font-semibold tabular-nums">{value}</span>
        </div>
      </TooltipTrigger>

      {hint ? (
        <TooltipContent className="max-w-xs text-xs">{hint}</TooltipContent>
      ) : null}
    </Tooltip>
  );
}
