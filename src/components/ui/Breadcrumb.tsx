import { ReactNode } from "react";
import { cn } from "tailwind-variants";

export type BreadcrumbItem = { label: string } & (
  | { href: string; onClick?: never }
  | { onClick: () => void; href?: never }
  | { href?: never; onClick?: never }
);

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
  itemClassName?: string;
}

/**
 * A type-safe breadcrumb navigation component.
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Projects", onClick={() => doSomething()} },
 *     { label: "Current" }
 *     { label: "I'm Error!", href: "/", onClick () => doSomething()} } // TypeError
 *   ]}
 *   separator="/"
 * />
 * ```
 */
export function Breadcrumb({
  items,
  separator = "/",
  className,
  itemClassName,
}: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className={className}>
      <ol className="flex items-center list-none m-0 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const defaultItemClassName =
            "text-xs text-muted-foreground hover:text-foreground transition-colors";

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {item.href ? (
                <a
                  href={item.href}
                  className={cn(defaultItemClassName, itemClassName)}
                >
                  {item.label}
                </a>
              ) : item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={cn(
                    defaultItemClassName,
                    "bg-transparent border-none cursor-pointer p-0",
                    itemClassName
                  )}
                >
                  {item.label}
                </button>
              ) : (
                <span className={cn(defaultItemClassName, itemClassName)}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="mx-1 text-muted-foreground" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
