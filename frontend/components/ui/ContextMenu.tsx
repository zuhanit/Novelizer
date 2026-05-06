import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { cn } from "tailwind-variants";

export function ContextMenu(props: ContextMenuPrimitive.ContextMenuProps) {
  return <ContextMenuPrimitive.Root {...props} />;
}

export function ContextMenuTrigger({
  className,
  ...props
}: ContextMenuPrimitive.ContextMenuTriggerProps) {
  return (
    <ContextMenuPrimitive.Trigger className={className} {...props} />
  );
}

export function ContextMenuContent({
  className,
  alignOffset = -4,
  ...props
}: ContextMenuPrimitive.ContextMenuContentProps) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        alignOffset={alignOffset}
        className={cn(
          "z-50 min-w-32 overflow-hidden rounded-sm bg-ui-panel-background shadow-popup",
          "p-1",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

export function ContextMenuItem({
  className,
  ...props
}: ContextMenuPrimitive.ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      className={cn(
        "relative flex gap-2 cursor-pointer select-none items-center rounded-xs px-2 py-1.5",
        "text-xs outline-none transition-colors",
        "focus:bg-ui-selection-active focus:text-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.ContextMenuSeparatorProps) {
  return (
    <ContextMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-ui-line", className)}
      {...props}
    />
  );
}

export function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  );
}

export function ContextMenuLabel({
  className,
  ...props
}: ContextMenuPrimitive.ContextMenuLabelProps) {
  return (
    <ContextMenuPrimitive.Label
      className={cn("px-2 py-1.5 text-xs font-semibold", className)}
      {...props}
    />
  );
}

export function ContextMenuGroup(
  props: ContextMenuPrimitive.ContextMenuGroupProps
) {
  return <ContextMenuPrimitive.Group {...props} />;
}

export function ContextMenuSub(
  props: ContextMenuPrimitive.ContextMenuSubProps
) {
  return <ContextMenuPrimitive.Sub {...props} />;
}

export function ContextMenuSubTrigger({
  className,
  ...props
}: ContextMenuPrimitive.ContextMenuSubTriggerProps) {
  return (
    <ContextMenuPrimitive.SubTrigger
      className={cn(
        "relative flex gap-2 cursor-pointer select-none items-center rounded-xs px-2 py-1.5",
        "text-xs outline-none transition-colors",
        "focus:bg-ui-selection-active focus:text-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function ContextMenuSubContent({
  className,
  ...props
}: ContextMenuPrimitive.ContextMenuSubContentProps) {
  return (
    <ContextMenuPrimitive.SubContent
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-sm bg-ui-panel-background shadow-popup",
        "p-1",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  );
}

export function ContextMenuCheckboxItem({
  className,
  children,
  ...props
}: ContextMenuPrimitive.ContextMenuCheckboxItemProps) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      className={cn(
        "relative flex gap-2 cursor-pointer select-none items-center rounded-xs py-1.5 pl-8 pr-2",
        "text-xs outline-none transition-colors",
        "focus:bg-ui-selection-active focus:text-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

export function ContextMenuRadioGroup(
  props: ContextMenuPrimitive.ContextMenuRadioGroupProps
) {
  return <ContextMenuPrimitive.RadioGroup {...props} />;
}

export function ContextMenuRadioItem({
  className,
  children,
  ...props
}: ContextMenuPrimitive.ContextMenuRadioItemProps) {
  return (
    <ContextMenuPrimitive.RadioItem
      className={cn(
        "relative flex gap-2 cursor-pointer select-none items-center rounded-xs py-1.5 pl-8 pr-2",
        "text-xs outline-none transition-colors",
        "focus:bg-ui-selection-active focus:text-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" fill="currentColor" />
          </svg>
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

export function ContextMenuItemIndicator({
  className,
  ...props
}: ContextMenuPrimitive.ContextMenuItemIndicatorProps) {
  return (
    <ContextMenuPrimitive.ItemIndicator
      className={cn("absolute left-2 flex h-3.5 w-3.5 items-center justify-center", className)}
      {...props}
    />
  );
}
