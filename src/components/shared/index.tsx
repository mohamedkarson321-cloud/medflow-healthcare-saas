import * as React from "react";
import { TrendingUp, TrendingDown, Minus, Search, Plus, Loader2, AlertCircle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { STATUS_COLORS } from "@/constants";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Status Badge ─────────────────────────────────────────────────────────────
interface StatusBadgeProps {
  status: string;
  label?: string;
  dot?: boolean;
  size?: "sm" | "md";
}

export function StatusBadge({ status, label, dot = true, size = "md" }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status as keyof typeof STATUS_COLORS] ?? {
    bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        colors.bg, colors.text, colors.border,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-0.5 text-xs"
      )}
    >
      {dot && <span className={cn("rounded-full", colors.dot, size === "sm" ? "h-1.5 w-1.5" : "h-1.5 w-1.5")} />}
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBg?: string;
  isCurrency?: boolean;
  currency?: string;
  suffix?: string;
  loading?: boolean;
}

export function StatCard({
  title, value, change, changeLabel, icon, iconBg = "bg-primary/10",
  isCurrency = false, currency = "EGP", suffix, loading = false,
}: StatCardProps) {
  const isPositive = (change ?? 0) > 0;
  const isNeutral = change === 0 || change === undefined;

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className={cn("stat-card-icon", iconBg)}>
          {icon}
        </div>
        {!isNeutral && (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change!)}%
          </span>
        )}
      </div>
      {loading ? (
        <div className="mt-3 space-y-2">
          <div className="skeleton h-8 w-24" />
          <div className="skeleton h-4 w-32" />
        </div>
      ) : (
        <>
          <p className="stat-value">
            {isCurrency
              ? formatCurrency(Number(value), currency)
              : `${value}${suffix ?? ""}`}
          </p>
          <p className="stat-label">{title}</p>
          {changeLabel && (
            <p className="mt-1 text-xs text-muted-foreground">{changeLabel}</p>
          )}
        </>
      )}
      {/* Decorative */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5" />
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

export function PageHeader({ title, description, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        {breadcrumb}
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-subtitle mt-1">{description}</p>}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2 mt-4 sm:mt-0">{actions}</div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button size="sm" className="mt-4" leftIcon={<Plus />}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export function LoadingSpinner({ size = "md", label }: { size?: "sm" | "md" | "lg"; label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <Loader2
        className={cn(
          "animate-spin text-primary",
          size === "sm" && "h-4 w-4",
          size === "md" && "h-8 w-8",
          size === "lg" && "h-12 w-12"
        )}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
export function ErrorState({ message = "Something went wrong", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <p className="text-sm font-medium text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

// ─── Search Input ─────────────────────────────────────────────────────────────
interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search...", className }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
      />
    </div>
  );
}

// ─── Data Table ───────────────────────────────────────────────────────────────
interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
  rowKey: (row: T) => string;
}

export function DataTable<T>({
  columns, data, loading, emptyState, onRowClick, rowKey,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.headerClassName}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    <div className="skeleton h-4 w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return emptyState ? (
      <>{emptyState}</>
    ) : (
      <EmptyState title="No data found" description="Try adjusting your search or filters." />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.headerClassName}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1 py-3">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}–{to}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> results
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = i + Math.max(1, page - 2);
          if (p > totalPages) return null;
          return (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon-sm"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({
  value, max = 100, label, showPercent = true,
  color = "primary", size = "md",
}: {
  value: number; max?: number; label?: string; showPercent?: boolean;
  color?: "primary" | "success" | "warning" | "danger"; size?: "sm" | "md";
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colorMap = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
          {showPercent && <span className="text-xs font-medium">{pct}%</span>}
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-secondary", size === "sm" ? "h-1.5" : "h-2")}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

// ─── Tooltip wrapper ──────────────────────────────────────────────────────────
export function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-card-md opacity-0 transition-opacity group-hover:opacity-100 z-50">
        {label}
      </div>
    </div>
  );
}
