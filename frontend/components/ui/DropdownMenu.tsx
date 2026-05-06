import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn, type VariantProps } from "tailwind-variants";
import { buttonVariants } from "./Button";

interface DropdownMenuTriggerProps
  extends DropdownMenuPrimitive.DropdownMenuTriggerProps,
    VariantProps<typeof buttonVariants> {}

export function DropdownMenu(props: DropdownMenuPrimitive.DropdownMenuProps) {
  return <DropdownMenuPrimitive.Root {...props} />;
}

export function DropdownMenuTrigger({
  className,
  size,
  ...props
}: DropdownMenuTriggerProps) {
  return (
    <DropdownMenuPrimitive.Trigger
      className={buttonVariants({ size, className })}
      {...props}
    />
  );
}

export function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: DropdownMenuPrimitive.DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
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
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
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

export function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuSeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-ui-line", className)}
      {...props}
    />
  );
}

export function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn("px-2 py-1.5 text-xs font-semibold", className)}
      {...props}
    />
  );
}

export function DropdownMenuGroup(
  props: DropdownMenuPrimitive.DropdownMenuGroupProps
) {
  return <DropdownMenuPrimitive.Group {...props} />;
}

export function DropdownMenuSub(
  props: DropdownMenuPrimitive.DropdownMenuSubProps
) {
  return <DropdownMenuPrimitive.Sub {...props} />;
}

export function DropdownMenuSubTrigger({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger
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

export function DropdownMenuSubContent({
  className,
  ...props
}: DropdownMenuPrimitive.DropdownMenuSubContentProps) {
  return (
    <DropdownMenuPrimitive.SubContent
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
