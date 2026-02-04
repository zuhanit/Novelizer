import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn, type VariantProps } from "tailwind-variants";
import { buttonVariants } from "./Button";

interface PopoverTriggerProps
  extends PopoverPrimitive.PopoverTriggerProps,
    VariantProps<typeof buttonVariants> {}

export function Popover(props: PopoverPrimitive.PopoverProps) {
  return <PopoverPrimitive.Root {...props} />;
}

export function PopoverTrigger({
  className,
  size,
  ...props
}: PopoverTriggerProps) {
  return (
    <PopoverPrimitive.Trigger
      className={buttonVariants({ size, className })}
      {...props}
    />
  );
}

export function PopoverContent({
  className,
  ...props
}: PopoverPrimitive.PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        className={cn(
          "shadow-popup rounded-sm p-1 bg-ui-panel-background",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
