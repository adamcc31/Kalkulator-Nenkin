import type { ReactNode } from "react";

export function CalculatorCard({
  title,
  children,
  className,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const base =
    "bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm";
  const classes = className ? `${base} ${className}` : base;

  return (
    <section className={classes}>
      {title ? (
        <div className="text-xs uppercase tracking-widest text-text-sub-light dark:text-text-sub-dark mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <h3>{title}</h3>
        </div>
      ) : null}
      {children}
    </section>
  );
}

